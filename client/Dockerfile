FROM node:12

WORKDIR /usr/src/client

COPY package*.json .

RUN npm install

EXPOSE 3003

CMD [ "npm", "start" ]
