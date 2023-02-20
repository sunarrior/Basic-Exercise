import userDB from "../db/user.db.js";
import utils from "../utils/index.js";

const getRegisterPage = function (req, res) {
  try {
    res.render("pages/register", { warning: "", userData: "" });
  } catch (err) {
    console.log(err.message);
  }
};

const getLoginPage = function (req, res) {
  try {
    res.render("pages/login", { warning: "", username: "" });
  } catch (err) {
    console.log(err.message);
  }
};

const validateLogin = async function (req, res) {
  try {
    let msg = "";
    const username = req.body.usernameLogin;
    const password = req.body.passwordLogin;
    const passwordAttemps = await utils.redisHelper.getPasswordAttempsCache(
      username
    );
    if (passwordAttemps >= 3) {
      msg = "Your account has been blocked for 50 minutes";
      const warning = utils.render.warningBar(msg);
      return res.render("pages/login", { warning: warning });
    }
    const user = await userDB.getUserByUsername(username);
    if (!user) {
      msg = "Username is not exists!";
    } else {
      const compareResult = await utils.encrypt.validateEncPassword(
        password,
        user.password
      );
      if (!compareResult) {
        msg = "Username or password is incorrect!";
        await utils.redisHelper.setCacheObjByKey(
          username,
          "passwordAttemps",
          passwordAttemps + 1,
          3000
        );
      }
    }
    if (msg != "") {
      const warning = utils.render.warningBar(msg);
      res.render("pages/login", { warning: warning, username: username });
    } else {
      await utils.redisHelper.setCache(username, { sessionId: "test" }, 120);
      res.cookie("username", username, { maxAge: 120000, httpOnly: true });
      res.cookie("sessionId", "test", { maxAge: 120000, httpOnly: true });
      res.render("pages/homepage", { warning: msg });
    }
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
    const userData = {
      name: req.body.nameRegister,
      username: req.body.usernameRegister,
      email: req.body.emailRegister,
    };
    const warning = utils.render.warningBar(msg);
    res.render("pages/register", { warning: warning, userData: userData });
    console.log(err.message);
  }
};

const userLogout = function (req, res) {
  const username = req.cookies.username;
  utils.redisHelper.clearCache(username);
  res.clearCookie("username");
  res.clearCookie("sessionId");
  res.render("pages/index");
};

export default {
  userLogout,
  getRegisterPage,
  getLoginPage,
  validateLogin,
  createUserData,
};
