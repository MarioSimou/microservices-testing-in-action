FROM node:14.10.1-alpine3.10

WORKDIR /app

EXPOSE 8080
CMD [ "npm", "run", "start:dev" ]