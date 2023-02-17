import utils from "../utils/index.js";

import User from "../model/User.js";

const getAllUsersData = async function () {
  try {
    const dataSource = await utils.dbHelper.dataSource;
    const userDataRepository = dataSource.getRepository(User);
    const result = await userDataRepository.find();
    return result;
  } catch (err) {
    console.log(err.message);
  }
};

const getUserByUsername = async function (username) {
  try {
    const dataSource = await utils.dbHelper.dataSource;
    const userDataRepository = dataSource.getRepository(User);
    const result = await userDataRepository.findOneBy({
      username: username,
    });
    return result;
  } catch (err) {
    console.log(err.message);
  }
};

const createUserData = async function (userData) {
  try {
    const dataSource = await utils.dbHelper.dataSource;
    const userDataRepository = dataSource.getRepository(User);
    await userDataRepository.save(userData);
  } catch (err) {
    console.log(err.message);
  }
};

export default {
  getAllUsersData,
  getUserByUsername,
  createUserData,
};
