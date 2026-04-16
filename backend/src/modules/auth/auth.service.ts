import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface JwtPayload {
  userId: number;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  generateToken(userId: number): string {
    const payload = { userId };
    return this.jwtService.sign(payload, {
      expiresIn: '24h',
    });
  }

  validateToken(token: string): JwtPayload | null {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch {
      return null;
    }
  }
}
