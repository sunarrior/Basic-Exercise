import utils from "../utils/index.js";

import UserSchema from "../entity/UserSchema.js";
import User from "../model/User.js";

const getAllUsersData = async function () {
  const userDataSource = utils.dbHelper.createCustomDS([UserSchema]);
  await userDataSource.initialize();
  const userDataRepository = userDataSource.getRepository(User);
  const result = await userDataRepository.find();
  await userDataSource.destroy();
  return result;
};

const getUserByUsername = async function (username) {
  const userDataSource = utils.dbHelper.createCustomDS([UserSchema]);
  await userDataSource.initialize();
  const userDataRepository = userDataSource.getRepository(User);
  const result = await userDataRepository.findOneBy({
    username: username,
  });
  await userDataSource.destroy();
  return result;
};

const createUserData = async function (userData) {
  const userDataSource = utils.dbHelper.createCustomDS([UserSchema]);
  await userDataSource.initialize();
  const userDataRepository = userDataSource.getRepository(User);
  await userDataRepository.save(userData);
  await userDataSource.destroy();
};

export default {
  getAllUsersData,
  getUserByUsername,
  createUserData,
};
