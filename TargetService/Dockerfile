FROM node:18-alpine3.14

RUN yarn global add nodemon

WORKDIR /opt/
COPY ./package*.json ./

RUN yarn --frozen-lockfile

WORKDIR /opt/project/

COPY . .

CMD ["yarn", "run", "dev"]


