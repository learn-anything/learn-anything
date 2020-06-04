# api

## Instructions

### Run Hasura GraphQL engine & Postgres

Start the local Docker container:

```sh
$ docker-compose up -d
```

Check if the containers are running:

```sh
$ docker ps
```

Now you have a local Hasura client running on your computer. Head to `http://localhost:8080/console` to open the Hasura console. You should have something like:

<img width="1313" alt="Screenshot 2020-06-04 at 10 52 47" src="https://user-images.githubusercontent.com/62398724/83742693-a3452180-a651-11ea-81e1-e77f56b9c343.png">

### Move data to Hasura DB

Install the CLI tool:

```sh
$ npm install -g json2graphql
```

Transfer the data:

```sh
$ json2graphql http://localhost:8080 --db=db.json
```

Awesome, the data has now been transfered and you can now run queries:

<img width="1313" alt="Screenshot 2020-06-04 at 11 02 18" src="https://user-images.githubusercontent.com/62398724/83743676-f4a1e080-a652-11ea-86b3-f2615d6fcf8a.png">
