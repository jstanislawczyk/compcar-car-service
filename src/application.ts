import {Connection, ConnectionOptions, createConnection, useContainer} from 'typeorm';
import {ApolloServer, ServerInfo} from 'apollo-server';
import {buildSchema} from 'type-graphql';
import {GraphQLSchema} from 'graphql';
import {DatabaseConfig} from './config/database.config';
import {Logger} from './common/logger';
import {ApolloServerLoaderPlugin} from 'type-graphql-dataloader';
import {authenticationChecker} from './common/auth-checker';
import {ExpressContext} from 'apollo-server-express/dist/ApolloServer';
import config from 'config';
import {Container} from 'typeorm-typedi-extensions';

export class Application {

  public server: ApolloServer;
  public serverInfo: ServerInfo;

  public async bootstrap(): Promise<void> {
    const databaseConfig: ConnectionOptions = DatabaseConfig.getDatabaseConnectionConfiguration();

    useContainer(Container);

    const databaseConnection: Connection = await createConnection(databaseConfig);
    const isDev: boolean = config.get('common.isDev');
    const applicationPort: number = config.get('server.port');
    const schema: GraphQLSchema = await buildSchema({
      resolvers: [
        isDev
          ? `${__dirname}/resolvers/**/*.resolver.ts`
          : `${__dirname}/resolvers/**/*.resolver.js`,
      ],
      container: Container,
      authChecker: authenticationChecker,
    });

    this.server = new ApolloServer({
      schema,
      plugins: [
        ApolloServerLoaderPlugin({
          typeormGetConnection: () => databaseConnection,
        }),
      ],
      context: (context: ExpressContext) => context,
    });
    this.serverInfo = await this.server.listen(applicationPort);

    Logger.log(`Server has started: ${this.serverInfo.url}`);
  }

  public async close(): Promise<void> {
    Logger.log('Closing server');

    await this.server.stop();

    Logger.log('Server closed');
  }
}
