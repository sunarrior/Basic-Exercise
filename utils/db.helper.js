import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import typeorm from "typeorm";

import UserSchema from "../entity/UserSchema.js";

const DATASOURCE_CONFIG = {
  type: process.env.DATABASE_TYPE,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWD,
  database: process.env.DATABASE_NAME,
  entities: [UserSchema],
  synchronize: true,
};

const createDBIfNotExists = async function (databaseName) {
  try {
    const customDataSourceConfig = { ...DATASOURCE_CONFIG };
    delete customDataSourceConfig.database;
    delete customDataSourceConfig.entities;
    delete customDataSourceConfig.synchronize;
    const tmpDataSource = new typeorm.DataSource(customDataSourceConfig);
    await tmpDataSource.initialize();
    await tmpDataSource.query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`);
    await tmpDataSource.destroy();
  } catch (err) {
    console.log(err.message);
  }
};

const startConnection = async function () {
  const dataSource = new typeorm.DataSource(DATASOURCE_CONFIG);
  try {
    await dataSource.initialize();
    return dataSource;
  } catch (err) {
    if (err.errno === 1049) {
      createDBIfNotExists(process.env.DATABASE_NAME);
      await dataSource.initialize();
      return dataSource;
    }
    console.log(err.message);
  }
};

const dataSource = startConnection();

export default {
  dataSource,
};
