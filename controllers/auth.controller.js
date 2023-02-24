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
    const user = await userDB.getUserByAttrb({
      username: userData.username,
      email: userData.email,
    });
    if (user) {
      const msg = "Username has already existed!";
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
    await utils.redisCache.setObjByKey(userData.username, "token", token, 300);
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
    await utils.redisCache.setObjByKey(user.username, "token", token, 300);
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
    const result = await utils.redisCache.checkObjByKey(
      username,
      "token",
      token
    );
    if (!result) {
      msg = `Verify code has been expired! <a href="/verify">Click here to resend verify link</a>`;
      return res.render("pages/Notification", { msg: msg });
    }

    // update active status
    await userDB.updateUserByAttrb(user.id, { active_status: result });
    utils.redisCache.clearCache(username);
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

    // Check password attemps to prevent spam login
    const passwdAttemps = await utils.redisCache.getPasswdAttemps(
      user.username
    );
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
      await utils.redisCache.setObjByKey(
        user.username,
        "passwdAttemps",
        passwdAttemps + 1,
        3000
      );
      const warning = utils.render.warningBar(msg);
      return res.render("pages/Login", {
        warning: warning,
        account: account,
      });
    }

    // generate sessionid
    const sessionId = await utils.crypto.generateToken(32);

    // process login
    await utils.redisCache.setObjByKey(
      user.username,
      "sessionId",
      sessionId,
      3000
    );
    res.cookie("username", user.username, {
      maxAge: 3000000,
      httpOnly: true,
    });
    res.cookie("sessionId", sessionId, { maxAge: 3000000, httpOnly: true });
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
      await utils.redisCache.setObjByKey(
        user.username,
        "recoveryCode",
        code,
        300
      );
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
      const result = await utils.redisCache.checkObjByKey(
        user.username,
        "recoveryCode",
        recoveryCode
      );
      if (!result) {
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
      res.redirect("/login");
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
  createUser,
  reSendVerifyCode,
  verifyAccount,
  validateLogin,
  recoveryRequest,
  userLogout,
};
