import {AuthChecker, ResolverData} from 'type-graphql';
import {ExpressContext} from 'apollo-server-express/src/ApolloServer';
import {InvalidTokenError} from '../models/errors/invalid-token.error';
import {Container} from 'typedi';
import {TokenService} from '../services/token.service';

export const customAuthChecker: AuthChecker<ExpressContext> = (
  resolverData: ResolverData,
  roles: string[],
) => {
  const context: ExpressContext = resolverData.context as ExpressContext;
  const jwtToken: string = context.req.header('Authorization') || context.req.header('authorization') || '';

  try {
    const tokenService: TokenService = Container.get(TokenService);

    tokenService.validateToken(jwtToken, roles);
  } catch (error) {
    const message: string = error.message;

    throw new InvalidTokenError(message);
  }

  return true;
};
