import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Logger } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(private usersRepository: UsersRepository) {}

  signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    this.logger.verbose(`Signing up a new user. Data: ${JSON.stringify(authCredentialsDto)}`);
    return this.usersRepository.createUser(authCredentialsDto);
  }

  signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    this.logger.verbose(`Signing in a user. Data: ${JSON.stringify(authCredentialsDto)}`);
    return this.usersRepository.signin(authCredentialsDto);
  }

  getAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }
}
