export default {
    server: {
        port: process.env.SERVER_PORT || 4000,
    },
    common: {
        isDev: process.env.IS_DEV === 'true' || false,
    },
    mysql: {
        url: process.env.MYSQL_URL || 'localhost',
        port: Number(process.env.MYSQL_PORT) || 3306,
        username: process.env.MYSQL_USERNAME || 'root',
        password: process.env.MYSQL_PASSWORD || 'root',
        database: process.env.MYSQL_DATABASE || 'compcar',
        logging: process.env.MYSQL_LOGGING === 'true' || false,
    },
    security: {
        jwt: {
            secret: process.env.JWT_SECRET || 'jwtSecret',
            ttlSeconds: Number(process.env.JWT_TTL_SECONDS) || 3600,
        },
        bcrypt: {
            rounds: Number(process.env.BCRYPT_ROUNDS) || 10,
        },
    },
};
