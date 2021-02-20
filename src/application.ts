import {ConnectionOptions, createConnection, useContainer} from 'typeorm';
import {ApolloServer, ServerInfo} from 'apollo-server';
import {buildSchema} from 'type-graphql';
import {Container} from 'typedi';
import {GraphQLSchema} from 'graphql';
import {DatabaseConfig} from './config/database.config';
import config from 'config';
import {Logger} from './common/logger';

export class Application {

  public server: ApolloServer;
  public serverInfo: ServerInfo;

  public async bootstrap(): Promise<void> {
    const databaseConfig: ConnectionOptions = DatabaseConfig.getDatabaseConnectionConfiguration();

    useContainer(Container);
    await createConnection(databaseConfig);

    const isDev: boolean = config.get('common.isDev');
    const applicationPort: number = config.get('server.port');
    const schema: GraphQLSchema = await buildSchema({
      resolvers: [
        isDev
          ? `${__dirname}/resolvers/**/*.resolver.ts`
          : `${__dirname}/resolvers/**/*.resolver.js`,
      ],
      container: Container,
    });

    this.server = new ApolloServer({ schema });
    this.serverInfo = await this.server.listen(applicationPort);

    Logger.log(`Server has started: ${this.serverInfo.url}`);
  }

  public async close(): Promise<void> {
    Logger.log('Closing server');

    await this.server.stop();

    Logger.log('Server closed');
  }
}
