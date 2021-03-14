import {User} from '../entities/user';
import {UserRole} from '../enums/user-role';

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
