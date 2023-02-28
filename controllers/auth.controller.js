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

    // check if user already exists
    const user = await userDB.getUserByEOU(userData.username);
    const userEmail = await userDB.getUserByEOU(userData.email);
    if (user || userEmail) {
      const msg = "Username or Email has already existed!";
      const warning = utils.render.warningBar(msg);
      delete userData.passwd;
      return res.render("pages/Register", {
        warning: warning,
        userData: userData,
      });
    }

    // Hash passwd and save user to db
    const hashPasswd = await utils.crypto.encryptPasswd(userData.passwd);
    userData.passwd = hashPasswd;
    await userDB.createUser(userData);

    // Generate token and send mail to user
    const token = await utils.crypto.generateToken(64);
    const keyB64 = utils.crypto.base64Encode(
      userData.username + "-verify-token"
    );
    await utils.redisCache.setCache(keyB64, token, 300);
    utils.mail.sendVerifyMail(userData.username, userData.email, token);
    const msg = "Check your mailbox to get verify link";
    res.render("pages/Notification", { msg: msg });
  } catch (err) {
    console.log(err);
  }
};

const reSendVerifyCode = async function (req, res) {
  try {
    const account = req.body.account;
    const user = await userDB.getUserByEOU(account);

    // Check if user exists
    if (!user) {
      const msg = "Username is not exists!";
      const warning = utils.render.warningBar(msg);
      return res.render("pages/ResendVerify", { warning: warning });
    }

    // Check if user already verified
    if (user.active_status) {
      const msg = "Username has already verified!";
      return res.render("pages/Notification", { msg: msg });
    }

    // Generate token and send mail to user
    const token = await utils.crypto.generateToken(64);
    const keyB64 = utils.crypto.base64Encode(user.username + "-verify-token");
    await utils.redisCache.setCache(keyB64, token, 300);
    utils.mail.sendVerifyMail(user.username, user.email, token);
    const msg = "Check your mailbox to get verify link";
    res.render("pages/Notification", { msg: msg });
  } catch (err) {
    console.log(err);
  }
};

const verifyAccount = async function (req, res) {
  try {
    let msg = "";
    const username = req.params.username;
    const token = req.params.token;
    const user = await userDB.getUserByEOU(username);

    // Check if user exists
    if (!user) {
      msg = "Username is not exists!";
      return res.render("pages/Notification", { msg: msg });
    }

    // Check if user has verify token
    const keyB64 = utils.crypto.base64Encode(user.username + "-verify-token");
    const result = await utils.redisCache.getCache(keyB64);
    if (result != token) {
      msg = `Verify link has been expired! <a href="/verify">Click here to resend verify link</a>`;
      return res.render("pages/Notification", { msg: msg });
    }

    // update active status
    await userDB.updateUserByAttrb(user.id, { active_status: 1 });
    utils.redisCache.clearCache(keyB64);
    msg = "Your account has been verified";
    res.render("pages/Notification", { msg: msg });
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

    // Check if user exists
    if (!user) {
      msg = "Username is not exists!";
      const warning = utils.render.warningBar(msg);
      return res.render("pages/Login", {
        warning: warning,
        account: account,
      });
    }

    // Check if user has already verified
    if (!user.active_status) {
      msg = `Verify your account to start using services <a href="/verify">Click here to resend verify link</a>`;
      const warning = utils.render.warningBar(msg);
      return res.render("pages/Login", {
        warning: warning,
        account: account,
      });
    }

    // redis
    const keyB64 = utils.crypto.base64Encode(user.username + "-login-attemps");
    // Check password attemps to prevent spam login
    let passwdAttemps = await utils.redisCache.getCache(keyB64);
    passwdAttemps = isNaN(passwdAttemps) ? 0 : passwdAttemps;
    if (passwdAttemps >= 3) {
      msg = "Your account has been blocked for 50 minutes";
      // set time in redis cache
      const warning = utils.render.warningBar(msg);
      return res.render("pages/Login", {
        warning: warning,
        account: account,
      });
    }

    // Validation password login
    const compareResult = await utils.crypto.validatePasswd(
      passwd,
      user.passwd
    );
    if (!compareResult) {
      msg = "Username or password is incorrect!";
      await utils.redisCache.setCache(keyB64, ++passwdAttemps, 3000);
      const warning = utils.render.warningBar(msg);
      return res.render("pages/Login", {
        warning: warning,
        account: account,
      });
    }

    // process login
    utils.redisCache.clearCache(keyB64);
    req.session.username = user.username;
    req.session.userip = req.ip;
    req.session.useragent = req.get("User-Agent");
    res.redirect("/homepage");
  } catch (err) {
    console.log(err);
  }
};

const recoveryRequest = async function (req, res) {
  try {
    // Get user info if exist
    const account = req.body.account;
    const user = await userDB.getUserByEOU(account);

    // find account request
    if (req.query.findaccount) {
      // check if user exists
      if (!user) {
        const msg = "User not found";
        const warning = utils.render.warningBar(msg);
        return res.render("pages/ForgotPassword", { warning: warning });
      }

      // generate recovery code, save to redis cache
      // and send to user mail
      const code = await utils.crypto.generateRecoveryCode();
      const keyB64 = utils.crypto.base64Encode(
        user.username + "-recovery-code"
      );
      await utils.redisCache.setCache(keyB64, code, 300);
      utils.mail.sendRecoveryCode(user.username, user.email, code);
      res.render("pages/RecoveryPasswd", { warning: "", account: account });
    }

    // Verify change password request
    if (req.query.verify) {
      // check if user exists
      if (!user) {
        const msg = "User not found";
        return res.render("pages/Notification", { msg: msg });
      }

      // check if code is valid
      const recoveryCode = req.body.code;
      const newPasswd = req.body.passwd;
      const keyB64 = utils.crypto.base64Encode(
        user.username + "-recovery-code"
      );
      const result = await utils.redisCache.getCache(keyB64);
      if (result != recoveryCode) {
        const msg = "Wrong code";
        const warning = utils.render.warningBar(msg);
        return res.render("pages/RecoveryPasswd", {
          warning: warning,
          account: account,
        });
      }

      // process change password
      const hashPasswd = await utils.crypto.encryptPasswd(newPasswd);
      await userDB.updateUserByAttrb(user.id, { passwd: hashPasswd });
      utils.redisCache.clearCache(keyB64);
      res.redirect("/login");
    }
  } catch (err) {
    console.log(err);
  }
};

const userLogout = function (req, res) {
  try {
    req.session.destroy((err) => {
      if (err) {
        return console.log(err);
      }
      res.clearCookie("connect.sid");
      res.redirect("/");
    });
  } catch (err) {
    console.log(err);
  }
};

export default {
  createUser,
  reSendVerifyCode,
  verifyAccount,
  validateLogin,
  recoveryRequest,
  userLogout,
};
