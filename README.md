# CarService
Service for handling cars, their data and comments 

## Technologies used
* Node 14
* ApolloServer
* Typescript
* TypeGraphQL
* TypeORM
* ClassValidator
* Mocha + Sinon + Chai
* SuperTest
* ESLint
* Config
* Winston
* Nodemon
* TSNode
* NPM
* Nodemailer

## Prerequisites
* Installed Node 14
* Installed NPM
* Configured local or remote MySQL Server

## Setup
1. Install Node 14
2. Go to package.json and install dependencies `npm i`
3. Configuration

    Configuration (server, database, mail etc.) uses default values and they can be
    changed using environment variables (check `config/default.js` file)
4. Go to docker compose file and run images used for local development
   * Run all images: `docker compose up -d`
   * Run specified images: `docker compose up nodemailer -d`
5. Run unit tests
   * Linux/Mac: `npm run test:unit`
   * Windows: `npm run test:unit:windows`
6. Run component tests
    * Linux/Mac: `npm run test:component`
    * Windows: `npm run test:component:windows`
7. Run integration tests (they require local environment images started with Docker)
    * Linux/Mac: `npm run test:integration`
    * Windows: `npm run test:integration:windows`
8. Start local server
    * Linux/Mac: `npm run start:dev`
    * Windows: `npm run start:dev:windows`
    * Server starts at `http://localhost:4000/`
    * Default GraphQL endpoint is `POST` `http://localhost:4000/graphql`
