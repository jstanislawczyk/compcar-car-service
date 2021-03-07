import {expect, use} from 'chai';
import {ExpressContext} from 'apollo-server-express/dist/ApolloServer';
import sinon, {SinonSandbox, SinonStub} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {TokenService} from '../services/token.service';
import {customAuthChecker} from './auth-checker';
import {ResolverData} from 'type-graphql';
import {InvalidTokenError} from '../models/errors/invalid-token.error';

use(sinonChai);
use(chaiAsPromised);

context('AuthChecker', () => {

  let sandbox: SinonSandbox;
  let validateTokenStub: SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    validateTokenStub = sandbox.stub(TokenService.prototype, 'validateToken');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('customAuthChecker', () => {
    it('should validate token', () => {
      // Arrange
      const allowedRoles: string[] = ['USER'];
      const token: string = 'TestToken';
      const resolverData: ResolverData<ExpressContext> = {
        context: {
          req: {
            headers: {
              authorization: token,
            },
          },
        },
      } as unknown as ResolverData<ExpressContext>;

      validateTokenStub.returns(true);

      // Act
      const validationResult: Promise<boolean> | boolean = customAuthChecker(resolverData, allowedRoles);

      // Assert
      expect(validationResult).to.be.true;
      expect(validateTokenStub).to.be.calledOnceWith(token, allowedRoles);
    });

    it('should reject if token validation fails', async () => {
      // Arrange
      const errorMessage: string = 'Validation Error';
      const resolverData: ResolverData<ExpressContext> = {
        context: {
          req: {
            headers: {
              authorization: 'TestToken',
            },
          },
        },
      } as unknown as ResolverData<ExpressContext>;

      validateTokenStub.throws(new Error(errorMessage));

      // Act & Assert
      expect(() => customAuthChecker(resolverData, ['USER'])).to.throw(InvalidTokenError, errorMessage);
    });

    it('should get empty string if authorization header is not provided', async () => {
      // Arrange
      const allowedRoles: string[] = ['USER'];
      const errorMessage: string = 'Validation Error';
      const resolverData: ResolverData<ExpressContext> = {
        context: {
          req: {
            headers: {},
          },
        },
      } as unknown as ResolverData<ExpressContext>;

      validateTokenStub.throws(new Error(errorMessage));

      // Act & Assert
      expect(() => customAuthChecker(resolverData, allowedRoles)).to.throw(InvalidTokenError, errorMessage);
      expect(validateTokenStub).to.be.calledOnceWith('', allowedRoles);
    });
  });
});
