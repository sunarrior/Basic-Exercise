import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import typeorm from "typeorm";

const dataSource = new typeorm.DataSource({
  name: "basic-exercise",
  type: process.env.DATABASE_TYPE,
  host: "localhost",
  port: 3306,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
});

const startConnection = async function () {
  await dataSource.initialize();
  console.log("Started connection");
};

const closeConnection = async function () {
  await dataSource.destroy();
  console.log("closed connection");
};

const createDBIfNotExists = async function (databaseName) {
  dataSource.query(`CREATE DB IF NOT EXISTS ${databaseName}`);
};

const createTblFromEntityIfNotExists = async function (entities) {
  const entityDataSource = new typeorm.DataSource({
    name: "basic-exercise",
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    entities: entities,
    synchronize: true,
  });
  await entityDataSource.initialize();
  console.log("Initialized entities");
  await entityDataSource.destroy();
  console.log("Closed connection for creating entities");
};

const saveUserData = async function (User) {
  const dataRepository = dataSource.getRepository(User);
  const user = {
    userid: 1,
    name: "test",
    username: "test",
    email: "test",
    password: "test",
  };
  await dataRepository.save(user);
  // const userData = await dataRepository.find();
  // console.log(userData);
};

const utils = {
  startConnection: startConnection,
  closeConnection: closeConnection,
  createDBIfNotExists: createDBIfNotExists,
  createTblFromEntityIfNotExists: createTblFromEntityIfNotExists,
  saveUserData: saveUserData,
};
export default utils;
