import {AuthChecker, ResolverData} from 'type-graphql';
import {ExpressContext} from 'apollo-server-express/dist/ApolloServer';
import {InvalidTokenError} from '../models/errors/invalid-token.error';
import {Container} from 'typedi';
import {TokenService} from '../services/token.service';

export const authenticationChecker: AuthChecker<ExpressContext> = (
  resolverData: ResolverData,
  roles: string[],
): boolean => {
  const context: ExpressContext = resolverData.context as ExpressContext;
  const jwtToken: string = context.req.headers.authorization || '';

  try {
    const tokenService: TokenService = Container.get(TokenService);

    return tokenService.isTokenValid(jwtToken, roles);
  } catch (error: any) {
    const message: string = error.message;

    throw new InvalidTokenError(message);
  }
};
