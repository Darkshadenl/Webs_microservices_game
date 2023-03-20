FROM node:17-alpine3.14

RUN yarn global add nodemon

WORKDIR /opt/
COPY ./package*.json ./

RUN yarn --frozen-lockfile
ENV PATH=/opt/node_modules/.bin:$PATH

WORKDIR /opt/project/

COPY . .

EXPOSE 3001
CMD ["yarn", "run", "dev"]

