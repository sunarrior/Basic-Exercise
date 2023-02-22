import userDB from "../db/user.db.js";
import utils from "../utils/index.js";

const createUser = async function (req, res) {
  try {
    const userData = {
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      passwd: req.body.passwd,
    };
    // Hash passwd and save user to db
    const hashPasswd = await utils.crypto.encryptPasswd(userData.passwd);
    userData.passwd = hashPasswd;
    await userDB.createUser(userData);

    // Generate token and send mail to user
    const token = await utils.crypto.generateToken(64);
    await utils.redisCache.setObjByKey(userData.username, "token", token, 300);
    await utils.mail.sendVerifyMail(userData.username, userData.email, token);
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
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
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
    const result = await utils.redisCache.checkObjByKey(
      username,
      "token",
      token
    );
    if (result) {
      await userDB.updateUserByAttrb(username, "active_status", result);
      utils.redisCache.clearCache(username);
      res.render("pages/VerifiedAccount");
    } else {
      res.end("something wrong happen ._.");
    }
  } catch (err) {
    console.log(err);
  }
};

const validateLogin = async function (req, res) {
  try {
    const account = req.body.account;
    const passwd = req.body.passwd;
    let msg = "";
    const user = await userDB.getUserByEOU(account);
    if (!user) {
      msg = "Username is not exists!";
    } else {
      if (!user.active_status) {
        msg = `Verify your account to start using services <a href="#">Click here to resend verify link</a>`;
        const warning = utils.render.warningBar(msg);
        return res.render("pages/login", {
          warning: warning,
          account: account,
        });
      }
      const passwdAttemps = await utils.redisCache.getPasswdAttemps(
        user.username
      );
      if (passwdAttemps >= 3) {
        msg = "Your account has been blocked for 50 minutes";
        // set time in redis cache
        const warning = utils.render.warningBar(msg);
        return res.render("pages/login", {
          warning: warning,
          account: account,
        });
      }
      const compareResult = await utils.crypto.validatePasswd(
        passwd,
        user.passwd
      );
      if (!compareResult) {
        msg = "Username or password is incorrect!";
        await utils.redisCache.setObjByKey(
          user.username,
          "passwdAttemps",
          passwdAttemps + 1,
          3000
        );
      }
    }
    if (msg != "") {
      const warning = utils.render.warningBar(msg);
      res.render("pages/login", { warning: warning, account: account });
    } else {
      await utils.redisCache.setObjByKey(
        user.username,
        "sessionId",
        "test",
        3000
      );
      res.cookie("username", user.username, {
        maxAge: 3000000,
        httpOnly: true,
      });
      res.cookie("sessionId", "test", { maxAge: 3000000, httpOnly: true });
      res.redirect("/homepage");
    }
  } catch (err) {
    console.log(err);
  }
};

const recoveryRequest = async function (req, res) {
  try {
    // Get user info if exist
    const account = req.body.account;
    const user = await userDB.getUserByEOU(account);
    if (req.query.findaccount) {
      if (!user) {
        const msg = "User not found";
        const warning = utils.render.warningBar(msg);
        res.render("pages/ForgotPassword", { warning: warning });
      } else {
        const code = await utils.crypto.generateRecoveryCode();
        await utils.redisCache.setObjByKey(
          user.username,
          "recoveryCode",
          code,
          300
        );
        await utils.mail.sendRecoveryCode(user.username, user.email, code);
        res.render("pages/RecoveryPasswd", { warning: "", account: account });
      }
    } else if (req.query.verify) {
      const recoveryCode = req.body.code;
      const newPasswd = req.body.passwd;
      const result = await utils.redisCache.checkObjByKey(
        user.username,
        "recoveryCode",
        recoveryCode
      );
      if (!result) {
        const msg = "Wrong code";
        const warning = utils.render.warningBar(msg);
        res.render("pages/RecoveryPasswd", {
          warning: warning,
          account: account,
        });
      } else {
        const hashPasswd = await utils.crypto.encryptPasswd(newPasswd);
        await userDB.updateUserByAttrb(user.username, "passwd", hashPasswd);
        res.redirect("/login");
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const userLogout = function (req, res) {
  try {
    const username = req.cookies.username;
    utils.redisCache.clearCache(username);
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
  createUser,
  recoveryRequest,
  userLogout,
};
