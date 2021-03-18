import {Service} from 'typedi';
import {AuthenticationError} from 'apollo-server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from 'config';
import {User} from '../models/entities/user';
import {JwtToken} from '../models/common/jwt-token';
import {classToPlain} from 'class-transformer';
import {LoginCredentials} from '../models/common/login-credentials';
import {InvalidTokenError} from '../models/errors/invalid-token.error';
import {UserRole} from '../models/enums/user-role';

@Service()
export class TokenService {

  private readonly jwtSecret: string = config.get('security.jwt.secret');
  private readonly jwtTtlSeconds: number = config.get('security.jwt.ttlSeconds');

  public getUserToken(loginCredentials: LoginCredentials, user: User): string {
    const isCorrectPassword: boolean = bcrypt.compareSync(loginCredentials.password, user.password);

    if (isCorrectPassword) {
      return this.createJwtToken(user);
    } else {
      throw new AuthenticationError('Authentication data are not valid');
    }
  }

  public validateToken(jwtToken: string, allowedRoles: string[]): boolean {
    const decodedToken: JwtToken = jwt.verify(jwtToken, this.jwtSecret) as JwtToken;
    const isExistingRole : boolean = Object.values(UserRole).includes(decodedToken.role as UserRole);

    if (!isExistingRole) {
      throw new InvalidTokenError(`Given role "${decodedToken.role}" is not supported`);
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(decodedToken.role)) {
      throw new InvalidTokenError('User is not required to perform this action');
    }

    return true;
  }

  private createJwtToken(user: User): string {
    const jwtToken: JwtToken = new JwtToken(user);

    return jwt.sign(
      classToPlain(jwtToken),
      this.jwtSecret,
      {
        expiresIn: this.jwtTtlSeconds,
      }
    );
  }
}
