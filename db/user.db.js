import utils from "../utils/index.js";

const dataSource = await utils.db.dataSource;
const userDataRepository = dataSource.getRepository("User");

const createUser = async function (userData) {
  try {
    await userDataRepository.save(userData);
  } catch (err) {
    console.log(err);
  }
};

const getUserByAttrb = async function (data) {
  try {
    const result = await userDataRepository.findOneBy(data);
    return result;
  } catch (err) {
    console.log(err);
  }
};

const getUserByEOU = async function (account) {
  try {
    let user;
    if (utils.regex.accountType(account)) {
      user = await getUserByAttrb({ email: account });
    } else {
      user = await getUserByAttrb({ username: account });
    }
    return user;
  } catch (err) {
    console.log(err);
  }
};

const getAllTasksOfUser = async function (userid) {
  try {
    const result = await userDataRepository.findOne({
      where: {
        id: 1,
      },
      relations: {
        tasks: true,
      },
    });
    return result.tasks;
  } catch (err) {
    console.log(err);
  }
};

const updateUserByAttrb = async function (userid, data) {
  try {
    await userDataRepository.update(userid, data);
  } catch (err) {
    console.log(err);
  }
};

export default {
  createUser,
  getUserByAttrb,
  getUserByEOU,
  getAllTasksOfUser,
  updateUserByAttrb,
};
