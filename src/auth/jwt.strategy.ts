import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepository } from './users.repository';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { ConfigService } from '@nestjs/config';
import { configEnum } from 'config.schema';

/**
 * The JwtStrategy validates the token:
 * Extracts the token from the Authorization header
 * Verifies the token's signature using the secret key
 * Extracts the payload (username)
 * Finds the user in the database
 * If everything is valid, the request proceeds
 * If not, throws UnauthorizedException
 */

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersRepository: UsersRepository,
    private configService: ConfigService,
  ) {
    const jwtSecret = configService.get<string>(configEnum.JWT_SECRET);
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    super({
      secretOrKey: jwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    // payload is the decoded token
    const { username } = payload;
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
