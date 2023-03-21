FROM node:17-alpine3.14

RUN yarn global add nodemon

WORKDIR /opt/
COPY ./package*.json ./
RUN yarn --frozen-lockfile

WORKDIR /opt/project/

COPY . .

EXPOSE 3002
CMD ["yarn", "run", "dev"]

