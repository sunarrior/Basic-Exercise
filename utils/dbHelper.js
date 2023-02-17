import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import typeorm from "typeorm";

import UserSchema from "../entity/UserSchema.js";

const DATASOURCE_CONFIG = {
  name: "basic-exercise",
  type: process.env.DATABASE_TYPE,
  host: "localhost",
  port: 3306,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
};

const createDBIfNotExists = async function (databaseName) {
  const dataSource = new typeorm.DataSource(DATASOURCE_CONFIG);
  await dataSource.initialize();
  await dataSource.query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`);
  await dataSource.destroy();

  return [UserSchema];
};

const createCustomDS = function (entities) {
  const customDSC = { ...DATASOURCE_CONFIG };
  customDSC.database = process.env.DATABASE_NAME;
  customDSC.entities = entities;
  customDSC.synchronize = true;
  const customDS = new typeorm.DataSource(customDSC);
  return customDS;
};

const createTblFromEntityIfNotExists = async function (entities) {
  const entityDataSource = createCustomDS(entities);
  await entityDataSource.initialize();
  console.log("Initialized entities");
  await entityDataSource.destroy();
  console.log("Closed connection for creating entities");
};

const utils = {
  createDBIfNotExists: createDBIfNotExists,
  createCustomDS: createCustomDS,
  createTblFromEntityIfNotExists: createTblFromEntityIfNotExists,
};
export default utils;
