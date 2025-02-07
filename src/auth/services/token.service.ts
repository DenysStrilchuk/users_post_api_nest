import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import * as process from 'process';
import {IJwtPayload} from "../interfaces/jwt-payload.interface";

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {
  }

  generateAccessToken(userId: string, email: string): string {
    return this.jwtService.sign(
      {sub: userId, email},
      {secret: process.env.JWT_SECRET, expiresIn: '15m'}
    );
  }

  generateRefreshToken(userId: string): string {
    return this.jwtService.sign(
      {sub: userId},
      {secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d'}
    );
  }

  verifyAccessToken(token: string): IJwtPayload {
    return this.jwtService.verify<IJwtPayload>(token, {secret: process.env.JWT_SECRET});
  }

  verifyRefreshToken(token: string): IJwtPayload {
    return this.jwtService.verify<IJwtPayload>(token, {secret: process.env.JWT_REFRESH_SECRET});
  }
}
