import {expect} from 'chai';
import {DateUtils} from '../../test/utils/common/date.utils';
import {UserMapper} from './user.mapper';
import {RegisterInput} from '../models/inputs/user/register.input';
import {User} from '../models/entities/user';
import {UserRole} from '../models/enums/user-role';

context('UserMapper', () => {

  let userMapper: UserMapper;

  beforeEach(() => {
    userMapper = new UserMapper();
  });

  describe('toRegisterUser', () => {
    it('should map to user register entity', () => {
      // Arrange
      const registerInput: RegisterInput = {
        email: 'test@mail.com',
        password: '1qazXSW@',
        passwordRepeat: '1qazXSW@',
      };

      // Act
      const userToRegister: User = userMapper.toRegisterUser(registerInput);

      // Assert
      expect(userToRegister.email).to.be.eql(registerInput.email);
      expect(userToRegister.password).to.be.eql(registerInput.password);
      expect(userToRegister.role).to.be.eql(UserRole.USER);
      expect(userToRegister.activated).to.be.true;
      expect(DateUtils.isISODate(userToRegister.registerDate)).to.be.true;
      expect(userToRegister.id).to.be.undefined;
      expect(userToRegister.comments).to.be.undefined;
    });
  });
});
