import userDB from "../db/user.db.js";
import utils from "../utils/index.js";

const getRegisterPage = function (req, res) {
  try {
    const warning = "";
    res.render("pages/register", { warning: warning });
  } catch (err) {
    console.log(err.message);
  }
};

const getLoginPage = function (req, res) {
  try {
    const warning = "";
    res.render("pages/login", { warning: warning });
  } catch (err) {
    console.log(err.message);
  }
};

const validateLogin = async function (req, res) {
  try {
    const username = req.body.usernameLogin;
    const password = req.body.passwordLogin;
    const user = await userDB.getUserByUsername(username);
    if (utils.encrypt.validateEncPassword(password, user.password)) {
      console.log("wrong password");
    }
    res.render("pages/homepage");
  } catch (err) {
    console.log(err.message);
  }
};

const getAllUsersData = async function (req, res) {
  try {
    // const result = await userDB.getAllUsersData();
    // res.json(result);
    res.render("pages/register");
  } catch (err) {
    console.log(err.message);
  }
};

const createUserData = async function (req, res) {
  try {
    const userData = {
      name: req.body.nameRegister,
      username: req.body.usernameRegister,
      email: req.body.emailRegister,
      password: req.body.passwordRegister,
    };
    const hashPassword = await utils.encrypt.encryptPassword(userData.password);
    userData.password = hashPassword;
    await userDB.createUserData(userData);
    const result = await userDB.getAllUsersData();
    res.json(result);
  } catch (err) {
    let msg = "";
    if (err.errno === 1062) {
      console.log("duplicate user");
      msg = "Username has already existed!";
    }
    const warning = utils.render.registerWarning(msg);
    res.render("pages/register", { warning: warning });
    console.log(err.message);
  }
};

export default {
  getRegisterPage,
  getLoginPage,
  validateLogin,
  getAllUsersData,
  createUserData,
};
