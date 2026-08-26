import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.usersService.login(dto.email, dto.senha);
  }
}
