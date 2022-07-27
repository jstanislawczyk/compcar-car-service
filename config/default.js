module.exports = {
    server: {
        port: Number(process.env.SERVER_PORT) || 4000,
    },
    common: {
        isDev: process.env.IS_DEV === 'true' || false,
        environment: process.env.ENVIRONMENT || 'local',
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
        emailConfirmationTimeoutMin: Number(process.env.EMAIL_CONFIRMATION_TIMEOUT_MIN) || 60,
    },
    email: {
        host: process.env.EMAIL_HOST || 'localhost',
        port: Number(process.env.EMAIL_PORT) || 1025,
        secure: process.env.EMAIL_SECURE === 'true' || false,
        auth: {
            user: process.env.EMAIL_USER || 'test_email_user@sometestmail.com',
            password: process.env.EMAIL_PASS || 'pass',
        },
    },
    services: {
      frontend: {
          url: process.env.SERVICE_FRONTEND_URL || 'localhost:8080',
      },
    },
};
