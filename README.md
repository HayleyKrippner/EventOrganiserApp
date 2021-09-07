# EventOrganiserApp

A web application which uses Node.js and MySQL in the backend and Vue.js in the frontend.

## Backend

### Running locally

1. Use `npm install` to populate the `node_modules/` directory with up-to-date packages
2. Create a file called `.env`, following the instructions in the section below
3. Go to https://dbadmin.csse.canterbury.ac.nz and create a database with the name that you set in the `.env` file
2. Run `npm run start` or `npm run debug` to start the server
3. The server will be accessible on `localhost:4941`

### `.env` file
Create a `.env` file in the root directory of this project including the following information (note that you will need to create the database first in phpMyAdmin):

```
SENG365_MYSQL_HOST=db2.csse.canterbury.ac.nz
SENG365_MYSQL_USER={your usercode}
SENG365_MYSQL_PASSWORD={your password}
SENG365_MYSQL_DATABASE={a database starting with your usercode then an underscore}
```

For example:
```
SENG365_MYSQL_HOST=db2.csse.canterbury.ac.nz
SENG365_MYSQL_USER=abc123
SENG365_MYSQL_PASSWORD=password
SENG365_MYSQL_DATABASE=abc123_main
```
### Setting up a database connection in WebStorm

To enable autocomplete for database tables, columns, etc., you can connect WebStorm to the `db2` database by following the instructions at https://www.jetbrains.com/help/idea/connecting-to-a-database.html#connect-to-mysql-database. The details to enter are:

* Host: `db2.csse.canterbury.ac.nz`
* Port: `3306`
* User: (your usercode)
* Password: (your password)
* Database: (your database, as in `.env`)
- - - - - - -

### Running outside of the University of Canterbury's Jack Erskine lab computers

Run npm install
Run the following command and provide your UC password.
```ssh YOURUCUSERNAME@linux.cosc.canterbury.ac.nz -L 3306:db2.csse.canterbury.ac.nz:3306 -N```
Run the following command to start the backend.
```npm run start```

## Frontend

### Running frontend
```npm install```

```npm run serve```
