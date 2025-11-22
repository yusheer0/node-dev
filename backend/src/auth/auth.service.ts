import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(password: string): Promise<any> {
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'; // В продакшене использовать сильный пароль
    console.log('Validating password:', password ? 'provided' : 'empty');
    console.log('Admin password from env:', process.env.ADMIN_PASSWORD ? 'set' : 'default (admin123)');

    const isValidPassword = await bcrypt.compare(password, await this.hashPasswordIfNeeded(adminPassword));
    console.log('Password validation result:', isValidPassword);

    if (isValidPassword) {
      return { userId: 1, username: 'admin' };
    }
    return null;
  }

  async hashPasswordIfNeeded(password: string): Promise<string> {
    // Если пароль уже захэширован (начинается с $2), возвращаем как есть
    if (password.startsWith('$2')) {
      return password;
    }
    // Иначе хэшируем и возвращаем
    return await bcrypt.hash(password, 12);
  }

  async login(user: any, response: Response) {
    const payload = { username: user.username, sub: user.userId };
    const token = this.jwtService.sign(payload);

    // Устанавливаем токен в secure cookie
    response.cookie('access_token', token, {
      httpOnly: true, // Защищает от доступа через JavaScript
      secure: process.env.NODE_ENV === 'production', // Только HTTPS в продакшене
      sameSite: 'strict', // Защищает от CSRF
      maxAge: 60 * 60 * 1000, // 1 час в миллисекундах
    });

    return { message: 'Login successful' };
  }

  async logout(response: Response) {
    // Очищаем cookie с токеном
    response.clearCookie('access_token');
    return { message: 'Logout successful' };
  }
}
