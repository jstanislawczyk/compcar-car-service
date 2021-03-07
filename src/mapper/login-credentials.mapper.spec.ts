import {expect} from 'chai';
import {LoginCredentialsMapper} from './login-credentials.mapper';
import {LoginInput} from '../inputs/user/login.input';
import {LoginCredentials} from '../models/common/login-credentials';

context('LoginCredentialsMapper', () => {

  let loginCredentialsMapper: LoginCredentialsMapper;

  beforeEach(() => {
    loginCredentialsMapper = new LoginCredentialsMapper();
  });

  describe('toLoginCredentials', () => {
    it('should map to login credentials', async () => {
      // Arrange
      const loginInput: LoginInput = {
        email: 'test@mail.com',
        password: '1qazXSW@',
      };

      // Act
      const loginCredentials: LoginCredentials = loginCredentialsMapper.toLoginCredentials(loginInput);

      // Assert
      expect(loginCredentials.email).to.be.eql(loginInput.email);
      expect(loginCredentials.password).to.be.eql(loginInput.password);
    });
  });
});
