FROM node:12

WORKDIR /usr/src/api

COPY package*.json .

RUN npm install

EXPOSE 8080

CMD [ "npm", "start" ]
