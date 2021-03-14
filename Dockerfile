FROM node:14.8.0-alpine

# Environment variables
ENV NODE_ENV production

# Create Directory for the Container
WORKDIR /usr/src/app

# Install nad build
COPY package*.json .
RUN npm ci --also=dev

# Build app
ADD . /usr/src/app
RUN find . -name "*.spec.ts" -type f -delete
RUN rm -r test
RUN npm run build:prod

# Expose app
EXPOSE 4000
CMD npm run start:prod
