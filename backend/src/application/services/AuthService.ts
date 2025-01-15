import jwt from 'jsonwebtoken'
import process from 'process';
import { AuthRepository } from '../../domain/repositories/AuthRepository.js';
import { UserRepository } from '../../domain/repositories/UserRepository.js';
import { ForbiddenError } from '../../utils/errors/Errors.js';
import { Request } from 'express';

export class AuthService {
  private authRepository: AuthRepository;
  private userRepository: UserRepository;
  constructor(authRepository: AuthRepository, userRepository: UserRepository) {
    this.authRepository = authRepository;
    this.userRepository = userRepository;
  }

  
  async login(
    email: string,
    password: string
  ): Promise<{ token: string; user: { id: string; password: string } }> {
    const userByEmail = await this.userRepository.getUserByEmail(email);
    if (!userByEmail) {
      throw new ForbiddenError('Invalid email or password');
    }
    const response = await this.authRepository.login(email, password);
    if (!response) throw new ForbiddenError('Autenthication failed');
    return {
      token: response.token,
      user: { id: userByEmail.id.toString(), password: userByEmail.password },
    };
  }
  
  async getUserFromRequest(request: Request) {
    const authHeader = request.headers['authorization'];
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const isValid = await this.authRepository.validateToken(token);
      if (!isValid) {
        throw new ForbiddenError('Invalid token');
      }
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
      const userId = decodedToken.userId;
      const user = await this.userRepository.getUserById(userId.toString());
      if (!user) {
        throw new ForbiddenError('User not found');
      }
      return user;
    }
    throw new ForbiddenError('Authorization header not found');
  }


  async logout(): Promise<void> {
    await this.authRepository.logout();
  }
}
