import utils from "../utils/index.js";

import User from "../model/User.js";

const dataSource = await utils.db.dataSource;
const userDataRepository = dataSource.getRepository(User);

const createUser = async function (userData) {
  try {
    await userDataRepository.save(userData);
  } catch (err) {
    console.log(err);
  }
};

const getAllUsers = async function () {
  try {
    const result = await userDataRepository.find();
    return result;
  } catch (err) {
    console.log(err);
  }
};

const getUserByAttrb = async function (attrb, value) {
  try {
    const data = {};
    data[attrb] = value;
    const result = await userDataRepository.findOneBy(data);
    return result;
  } catch (err) {
    console.log(err);
  }
};

const getUserByEOU = async function (account) {
  let user;
  if (utils.regex.accountType(account)) {
    user = await getUserByAttrb("email", account);
  } else {
    user = await getUserByAttrb("username", account);
  }
  return user;
};

const updateUserByAttrb = async function (username, key, value) {
  try {
    const user = await userDataRepository.findOneBy({ username: username });
    const data = {};
    data[key] = value;
    await userDataRepository.update(user.userid, data);
  } catch (err) {
    console.log(err);
  }
};

export default {
  createUser,
  getAllUsers,
  getUserByAttrb,
  getUserByEOU,
  updateUserByAttrb,
};
