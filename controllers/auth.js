import userDB from "../db/user.db.js";
import utils from "../utils/index.js";

const getRegisterPage = function (req, res) {
  const warning = "";
  res.render("pages/register", { warning: warning });
};

const getLoginPage = function (req, res) {
  const warning = "";
  res.render("pages/login", { warning: warning });
};

const validateLogin = async function (req, res) {
  // console.log(req.body);
  const username = req.body.usernameLogin;
  const password = req.body.passwordLogin;
  const user = await userDB.getUserByUsername(username);
  // if (utils.encrypt.validateEncPassword(password, user.password)) {
  //   console.log("wrong password");
  // }
  res.render("pages/homepage");
};

const getAllUsersData = async function (req, res) {
  // const result = await userDB.getAllUsersData();
  // res.json(result);
  res.render("pages/register");
};

const validateUserData = function (userData) {
  const regEx = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  let msg = "";
  if (userData.name === undefined) {
    msg = "Please enter your name";
  } else if (userData.username === undefined || userData.username.length < 6) {
    msg = "Username must be at least 6 characters";
  } else if (userData.password != userData.repeatPassword) {
    msg = "Password does not match repeat password";
  } else if (userData.password === undefined || userData.password.length < 8) {
    msg = "Password must be at least 8 characters";
  } else if (!regEx.test(userData.password)) {
    msg =
      "Password must contain at least \
     one character, one number and one special character";
  }
  return msg;
};

const createUserData = async function (req, res) {
  try {
    const userData = {
      name: req.body.nameRegister,
      username: req.body.usernameRegister,
      email: req.body.emailRegister,
      password: req.body.passwordRegister,
      repeatPassword: req.body.repeatPasswordRegister,
    };
    const validateMsg = validateUserData(userData);
    if (validateMsg != "") {
      throw new Error(validateMsg);
    }
    delete userData.repeatPassword;
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
    } else {
      msg = err;
    }
    const warning = `<div class="alert alert-warning" role="alert"> ${msg} </div>`;
    res.render("pages/register", { warning: warning });
    // console.log(err.message);
  }
};

export default {
  getRegisterPage,
  getLoginPage,
  validateLogin,
  getAllUsersData,
  createUserData,
};
