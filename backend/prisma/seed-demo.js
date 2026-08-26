require("dotenv").config();
const { Client } = require("pg");

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const users = [
    ["admin@plataforma.com", "Administrador", "0202"],
    ["aluno@plataforma.com", "Aluno Demo", "0202"],
  ];

  for (const [email, nome, senha] of users) {
    await client.query(
      `INSERT INTO "Usuario" (email, nome, senha, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, NOW(), NOW())
       ON CONFLICT (email)
       DO UPDATE SET nome = EXCLUDED.nome, senha = EXCLUDED.senha, "updatedAt" = NOW()`,
      [email, nome, senha],
    );
  }

  const result = await client.query('SELECT id, email, nome FROM "Usuario"');
  console.log(result.rows);
  await client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
