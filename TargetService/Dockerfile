FROM node:17-alpine3.14

RUN yarn global add nodemon

WORKDIR /opt/project

COPY ./package*.json ./

RUN yarn

COPY . .

EXPOSE 3001
CMD ["yarn", "run", "dev"]

