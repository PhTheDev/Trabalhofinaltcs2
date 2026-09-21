require("dotenv").config();
const { Client } = require("pg");
const bcrypt = require("bcryptjs");

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const plainPassword = "0202";
  const senhaHash = await bcrypt.hash(plainPassword, 10);

  const users = [
    ["admin@plataforma.com", "Administrador", senhaHash, "ADMIN"],
    ["aluno@plataforma.com", "Aluno Demo", senhaHash, "ALUNO"],
  ];

  for (const [email, nome, senha, role] of users) {
    await client.query(
      `INSERT INTO "Usuario" (email, nome, senha, role, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4::"Role", NOW(), NOW())
       ON CONFLICT (email)
       DO UPDATE SET
         nome = EXCLUDED.nome,
         senha = EXCLUDED.senha,
         role = EXCLUDED.role,
         "updatedAt" = NOW()`,
      [email, nome, senha, role],
    );
  }

  const result = await client.query(
    'SELECT id, email, nome, role FROM "Usuario"',
  );
  console.log(result.rows);
  await client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
