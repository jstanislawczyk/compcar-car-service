import {User} from '../../src/models/entities/user';
import {UserRole} from '../../src/models/enums/user-role';

export const user: User = {
  email: 'test@user.com',
  password: '1qazXSW@',
  activated: true,
  registerDate: new Date().toISOString(),
  role: UserRole.USER,
};

export const fullUser: User = {
  ...user,
  id: 1,
};
