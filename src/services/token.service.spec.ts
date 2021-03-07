import {expect} from 'chai';
import {TokenService} from './token.service';
import {User} from '../models/entities/user';
import {fullUser, user} from '../../test/fixtures/user.fixture';
import bcrypt from 'bcrypt';
import {LoginCredentials} from '../models/common/login-credentials';
import {AuthenticationError} from 'apollo-server';
import {JwtUtils} from '../../test/utils/common/jwt.utils';
import {UserRole} from '../enums/user-role';
import {JwtToken} from '../models/common/jwt-token';
import jwt, {TokenExpiredError} from 'jsonwebtoken';
import {classToPlain} from 'class-transformer';
import config from 'config';
import {InvalidTokenError} from '../models/errors/invalid-token.error';

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

  describe('validateToken', () => {
    it('should validate token', () => {
      // Arrange
      const authenticatedUser: User = {
        ...user,
        role: UserRole.ADMIN,
      };
      const jwtSecret: string = config.get('security.jwt.secret');
      const allowedRoles: UserRole[] = [UserRole.ADMIN];
      const jwtToken: JwtToken = new JwtToken(authenticatedUser);
      const token: string = jwt.sign(
        classToPlain(jwtToken),
        jwtSecret,
        {
          expiresIn: 100000,
        }
      );

      // Act
      const isValidated: boolean = tokenService.validateToken(token, allowedRoles);

      // Assert
      expect(isValidated).to.be.true;
    });

    it('should not validate token if it expires', () => {
      // Arrange
      const jwtSecret: string = config.get('security.jwt.secret');
      const allowedRoles: UserRole[] = [UserRole.ADMIN];
      const authenticatedUser: User = {
        ...user,
        role: UserRole.ADMIN,
      };
      const jwtToken: JwtToken = new JwtToken(authenticatedUser);
      const token: string = jwt.sign(
        classToPlain(jwtToken),
        jwtSecret,
        {
          expiresIn: -10000,
        }
      );

      // Act & Assert
      expect(() => tokenService.validateToken(token, allowedRoles))
        .to.throw('jwt expired')
        .and.to.be.an.instanceOf(TokenExpiredError);
    });

    it('should not validate token if is not supported role', () => {
      // Arrange
      const jwtSecret: string = config.get('security.jwt.secret');
      const authenticatedUser: User = {
        ...user,
        role: 'NotSupportedRole' as UserRole,
      };
      const allowedRoles: UserRole[] = [UserRole.USER];
      const jwtToken: JwtToken = new JwtToken(authenticatedUser);
      const token: string = jwt.sign(
        classToPlain(jwtToken),
        jwtSecret,
        {
          expiresIn: 100000,
        }
      );

      // Act & Assert
      expect(() => tokenService.validateToken(token, allowedRoles))
        .to.throw(`Given role "${authenticatedUser.role}" is not supported`)
        .and.to.be.an.instanceOf(InvalidTokenError);
    });

    it('should not validate token if role is not allowed', () => {
      // Arrange
      const jwtSecret: string = config.get('security.jwt.secret');
      const authenticatedUser: User = {
        ...user,
        role: UserRole.ADMIN,
      };
      const allowedRoles: UserRole[] = [UserRole.USER];
      const jwtToken: JwtToken = new JwtToken(authenticatedUser);
      const token: string = jwt.sign(
        classToPlain(jwtToken),
        jwtSecret,
        {
          expiresIn: 100000,
        }
      );

      // Act & Assert
      expect(() => tokenService.validateToken(token, allowedRoles))
        .to.throw('User is not required to perform this action')
        .and.to.be.an.instanceOf(InvalidTokenError);
    });
  });
});
