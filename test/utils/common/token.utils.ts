import {UserRole} from '../../../src/models/enums/user-role';
import {User} from '../../../src/models/entities/user';
import {NumberUtils} from './number.utils';
import {JwtToken} from '../../../src/models/common/security/jwt-token';
import jwt from 'jsonwebtoken';
import {instanceToPlain} from 'class-transformer';
import config from 'config';

export class TokenUtils {

  private static readonly jwtSecret: string = config.get('security.jwt.secret');
  private static readonly jwtTtlSeconds: number = config.get('security.jwt.ttlSeconds');

  public static getAuthToken(userRole: UserRole, userId?: number): string {
    const user: User = new User();
    user.role = userRole;
    user.id = userId || NumberUtils.getRandomInteger();

    const jwtToken: JwtToken = new JwtToken(user);

    return jwt.sign(
      instanceToPlain(jwtToken),
      this.jwtSecret,
      {
        expiresIn: this.jwtTtlSeconds,
      }
    );
  }
}
