# Clash Of Worlds

> Clash of Words is an application allowing you to manage challenges between teams, called planets.

## Stack

- Docker
- [Apollo Server](https://github.com/apollographql/apollo-server)
- [Sequelize](https://github.com/sequelize/sequelize) as ORM
- Postgres database

## Install project

- Install dependencies in `/api`  
  `yarn install`
  or
  `npm install`

- In the root directory  
  `docker-compose build` then `docker-compose up`

- Load initial data thanks to `sequeliae-cli`. In the `/api` folder:  
  `npx sequelize-cli db:seed:all`

#### Access to Graphql playground

`http://localhost:8080/`

#### Access to Adminer

`http://localhost:8801/`
