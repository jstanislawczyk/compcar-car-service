import {AuthChecker, ResolverData} from 'type-graphql';
import {ExpressContext} from 'apollo-server-express/src/ApolloServer';
import {JwtToken} from '../models/common/jwt-token';
import {UserRole} from '../enums/user-role';
import {InvalidTokenError} from '../models/errors/invalid-token.error';
import config from 'config';
import jwt from 'jsonwebtoken';

export const customAuthChecker: AuthChecker<ExpressContext> = (
  resolverData: ResolverData,
  roles: string[],
) => {
  const context: ExpressContext = resolverData.context as ExpressContext;
  const jwtSecret: string = config.get('security.jwt.secret');
  const jwtToken: string = context.req.header('Authorization') || context.req.header('authorization') || '';

  try {
    const decodedToken: JwtToken = jwt.verify(jwtToken, jwtSecret) as JwtToken;
    const isExistingRole : boolean = Object.values(UserRole).includes(decodedToken.role as UserRole);

    if (!isExistingRole) {
      throw new InvalidTokenError(`Given role "${decodedToken.role}" is not supported`);
    }

    if (roles.length > 0 && !roles.includes(decodedToken.role)) {
      throw new InvalidTokenError('User is not required to perform this action');
    }
  } catch (error) {
    const message: string = error.message;

    throw new InvalidTokenError(message);
  }

  return true;
};
