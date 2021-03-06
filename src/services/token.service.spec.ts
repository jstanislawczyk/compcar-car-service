import {expect} from 'chai';
import {TokenService} from './token.service';
import {User} from '../models/entities/user';
import {fullUser} from '../../test/fixtures/user.fixture';
import bcrypt from 'bcrypt';
import {LoginCredentials} from '../models/common/login-credentials';
import {AuthenticationError} from 'apollo-server';
import {JwtUtils} from '../../test/utils/common/jwt.utils';

context('TokenService', () => {

  let tokenService: TokenService;

  beforeEach(() => {
    tokenService = new TokenService();
  });

  describe('getUserToken', () => {
    it('should return JWT token', () => {
      // Arrange
      const user: User = fullUser;
      const loginCredentials: LoginCredentials = {
        email: user.email,
        password: user.password,
      };

      user.password = bcrypt.hashSync(user.password, 1);

      // Act
      const token: string = tokenService.getUserToken(loginCredentials, user);

      // Assert
      expect(JwtUtils.isJwt(token)).to.be.true;
    });

    it('should throw error if password given in login and password in user object are different', () => {
      // Arrange
      const user: User = fullUser;
      const loginCredentials: LoginCredentials = {
        email: user.email,
        password: 'WrongPassword',
      };

      user.password = '1qazXSW@';

      // Act & Assert
      expect(() => tokenService.getUserToken(loginCredentials, user))
        .to.throw('Authentication data are not valid')
        .and.to.be.an.instanceOf(AuthenticationError);
    });
  });
});
