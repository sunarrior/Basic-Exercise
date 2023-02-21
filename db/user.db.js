import utils from "../utils/index.js";

import User from "../model/User.js";

const dataSource = await utils.dbHelper.dataSource;
const userDataRepository = dataSource.getRepository(User);

const getAllUsersData = async function () {
  try {
    const result = await userDataRepository.find();
    return result;
  } catch (err) {
    console.log(err);
  }
};

const getUserByUsername = async function (username) {
  try {
    const result = await userDataRepository.findOneBy({
      username: username,
    });
    return result;
  } catch (err) {
    console.log(err);
  }
};

const createUserData = async function (userData) {
  try {
    await userDataRepository.save(userData);
  } catch (err) {
    console.log(err);
  }
};

const updateUserData = async function (username, activeStatus) {
  try {
    const user = await userDataRepository.findOneBy({ username: username });
    await userDataRepository.update(user.userid, {
      activeStatus: activeStatus,
    });
  } catch (err) {
    console.log(err);
  }
};

export default {
  getAllUsersData,
  getUserByUsername,
  createUserData,
  updateUserData,
};
