export default {
    server: {
      port: process.env.SERVER_PORT || 4000,
    },
    common: {
        isDev: Boolean(process.env.IS_DEV) || false,
    },
    mysql: {
        url: process.env.MYSQL_URL || 'localhost',
        port: Number(process.env.MYSQL_PORT) || 3306,
        username: process.env.MYSQL_USERNAME || 'root',
        password: process.env.MYSQL_PASSWORD || 'root',
        database: process.env.MYSQL_DATABASE || 'graphql-training',
        logging: Boolean(process.env.MYSQL_LOGGING) || false,
    },
};
