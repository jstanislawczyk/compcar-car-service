import {UserRole} from '../../enums/user-role';
import {User} from '../entities/user';

export class JwtToken {

  public iat: number;
  public exp: number;
  public sub?: number;
  public role: UserRole;

  constructor(user: User) {
    this.sub = user.id;
    this.role = user.role;
  }
}
