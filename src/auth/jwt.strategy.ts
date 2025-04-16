import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { UsersRepository } from './users.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersRepository: UsersRepository) {}
}
