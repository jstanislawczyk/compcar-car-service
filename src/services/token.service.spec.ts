import {expect} from 'chai';
import {TokenService} from './token.service';
import {User} from '../models/entities/user';
import {LoginCredentials} from '../models/common/security/login-credentials';
import {AuthenticationError} from 'apollo-server';
import {StringUtils} from '../../test/utils/common/string.utils';
import {JwtToken} from '../models/common/security/jwt-token';
import jwt, {TokenExpiredError} from 'jsonwebtoken';
import {instanceToPlain} from 'class-transformer';
import {InvalidTokenError} from '../models/errors/invalid-token.error';
import {UserBuilder} from '../../test/utils/builders/user.builder';
import {UserRole} from '../models/enums/user-role';
import bcrypt from 'bcryptjs';
import config from 'config';

context('TokenService', () => {

  let tokenService: TokenService;

  beforeEach(() => {
    tokenService = new TokenService();
  });

  describe('getUserToken', () => {
    it('should return JWT token', () => {
      // Arrange
      const user: User = new UserBuilder(true).build();
      const loginCredentials: LoginCredentials = {
        email: user.email,
        password: user.password,
      };

      user.password = bcrypt.hashSync(user.password, 1);

      // Act
      const token: string = tokenService.getUserToken(loginCredentials, user);

      // Assert
      expect(StringUtils.isJwtToken(token)).to.be.true;
    });

    it('should throw error if password given in login and password in user object are different', () => {
      // Arrange
      const user: User = new UserBuilder(true)
        .withPassword('1qazXSW@')
        .build();
      const loginCredentials: LoginCredentials = {
        email: user.email,
        password: 'WrongPassword',
      };

      // Act & Assert
      expect(() => tokenService.getUserToken(loginCredentials, user))
        .to.throw('Authentication data are not valid')
        .and.to.be.an.instanceOf(AuthenticationError);
    });
  });

  describe('validateToken', () => {
    it('should validate token', () => {
      // Arrange
      const authenticatedUser: User = new UserBuilder(true)
        .withRole(UserRole.ADMIN)
        .build();
      const jwtSecret: string = config.get('security.jwt.secret');
      const allowedRoles: UserRole[] = [UserRole.ADMIN];
      const jwtToken: JwtToken = new JwtToken(authenticatedUser);
      const token: string = jwt.sign(
        instanceToPlain(jwtToken),
        jwtSecret,
        {
          expiresIn: 100000,
        }
      );
      const fullToken: string = `Bearer ${token}`;

      // Act
      const isValidated: boolean = tokenService.isTokenValid(fullToken, allowedRoles);

      // Assert
      expect(isValidated).to.be.true;
    });

    describe('should not validate token ', () => {
      it("if it it doesn't have 'Bearer' prefix", () => {
        // Arrange
        const jwtSecret: string = config.get('security.jwt.secret');
        const allowedRoles: UserRole[] = [UserRole.ADMIN];
        const authenticatedUser: User = new UserBuilder(true)
          .withRole(UserRole.ADMIN)
          .build();
        const jwtToken: JwtToken = new JwtToken(authenticatedUser);
        const token: string = jwt.sign(
          instanceToPlain(jwtToken),
          jwtSecret,
          {
            expiresIn: -10000,
          }
        );

        // Act & Assert
        expect(() => tokenService.isTokenValid(token, allowedRoles))
          .to.throw("Given token doesn't match pattern 'Bearer token'")
          .and.to.be.an.instanceOf(InvalidTokenError);
      });

      it('if it expires', () => {
        // Arrange
        const jwtSecret: string = config.get('security.jwt.secret');
        const allowedRoles: UserRole[] = [UserRole.ADMIN];
        const authenticatedUser: User = new UserBuilder(true)
          .withRole(UserRole.ADMIN)
          .build();
        const jwtToken: JwtToken = new JwtToken(authenticatedUser);
        const token: string = jwt.sign(
          instanceToPlain(jwtToken),
          jwtSecret,
          {
            expiresIn: -10000,
          }
        );
        const fullToken: string = `Bearer ${token}`;

        // Act & Assert
        expect(() => tokenService.isTokenValid(fullToken, allowedRoles))
          .to.throw('jwt expired')
          .and.to.be.an.instanceOf(TokenExpiredError);
      });

      it('if is not supported role', () => {
        // Arrange
        const jwtSecret: string = config.get('security.jwt.secret');
        const authenticatedUser: User = new UserBuilder(true)
          .withRole('NotSupportedRole' as UserRole)
          .build();
        const allowedRoles: UserRole[] = [UserRole.USER];
        const jwtToken: JwtToken = new JwtToken(authenticatedUser);
        const token: string = jwt.sign(
          instanceToPlain(jwtToken),
          jwtSecret,
          {
            expiresIn: 100000,
          }
        );
        const fullToken: string = `Bearer ${token}`;

        // Act & Assert
        expect(() => tokenService.isTokenValid(fullToken, allowedRoles))
          .to.throw(`Given role "${authenticatedUser.role}" is not supported`)
          .and.to.be.an.instanceOf(InvalidTokenError);
      });

      it('if role is not allowed', () => {
        // Arrange
        const role: UserRole = UserRole.USER;
        const jwtSecret: string = config.get('security.jwt.secret');
        const authenticatedUser: User = new UserBuilder(true)
          .withRole(role)
          .build();
        const allowedRoles: UserRole[] = [UserRole.ADMIN];
        const jwtToken: JwtToken = new JwtToken(authenticatedUser);
        const token: string = jwt.sign(
          instanceToPlain(jwtToken),
          jwtSecret,
          {
            expiresIn: 100000,
          }
        );
        const fullToken: string = `Bearer ${token}`;

        // Act & Assert
        expect(() => tokenService.isTokenValid(fullToken, allowedRoles))
          .to.throw(`User with role=${role} is not allowed to perform this action`)
          .and.to.be.an.instanceOf(InvalidTokenError);
      });
    });
  });
});
