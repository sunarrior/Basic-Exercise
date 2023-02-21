import userDB from "../db/user.db.js";
import utils from "../utils/index.js";

const validateLogin = async function (req, res) {
  try {
    let msg = "";
    const username = req.body.usernameLogin;
    const password = req.body.passwordLogin;
    const user = await userDB.getUserByUsername(username);
    if (!user) {
      msg = "Username is not exists!";
    } else {
      if (!user.activeStatus) {
        msg = `Verify your account to start using services <a href="#">Click here to resend verify link</a>`;
        const warning = utils.render.warningBar(msg);
        return res.render("pages/login", { warning: warning });
      }
      const passwordAttemps = await utils.redisHelper.getPasswordAttempsCache(
        username
      );
      if (passwordAttemps >= 3) {
        msg = "Your account has been blocked for 50 minutes";
        const warning = utils.render.warningBar(msg);
        return res.render("pages/login", { warning: warning });
      }
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
      await utils.redisHelper.setCache(username, { sessionId: "test" }, 3000);
      res.cookie("username", username, { maxAge: 3000000, httpOnly: true });
      res.cookie("sessionId", "test", { maxAge: 3000000, httpOnly: true });
      res.redirect("/homepage");
    }
  } catch (err) {
    console.log(err);
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
    await utils.mailHelper.sendVerifyMail(userData.username, userData.email);
    res.end("Check your mailbox to get verify link");

    // const result = await userDB.getAllUsersData();
    // res.json(result);
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
    console.log(err);
  }
};

const verifyAccount = async function (req, res) {
  try {
    const username = req.params.username;
    const token = req.params.token;
    const result = await utils.redisHelper.checkCacheObjByKey(
      username,
      "token",
      token
    );
    if (result) {
      await userDB.updateUserData(username, result);
      utils.redisHelper.clearCache(username);
      res.render("pages/verifiedAccount");
    } else {
      res.end("something wrong happen ._.");
    }
  } catch (err) {
    console.log(err);
  }
};

const userLogout = function (req, res) {
  try {
    const username = req.cookies.username;
    utils.redisHelper.clearCache(username);
    res.clearCookie("username");
    res.clearCookie("sessionId");
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};

export default {
  validateLogin,
  verifyAccount,
  createUserData,
  userLogout,
};
