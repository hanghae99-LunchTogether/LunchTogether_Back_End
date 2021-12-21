import dotenv from "dotenv"
dotenv.config();
const config ={
  "development": {
    "username": process.env.DB_USERS||'root',
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME|| 'test',
    "host": process.env.DB_END_POINT||'localhost',
    "dialect": "mysql",
    "logging": false
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}

export default config;