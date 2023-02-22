import utils from "../utils/index.js  ";

const MESSAGE = {
  NAME_EMPTY: "Please enter your name",
  USERNAME_LEAST: "Username must be at least 6 characters",
  USERNAME_CONTAIN: "Username must contain both number and letters only",
  PASSWD_REPEAT_NOT_MATCH: "Password does not match repeat password",
  PASSWD_LEAST: "Password must be at least 8 characters",
  PASSWD_CONTAIN:
    "Password must contain at least one uppercase character, one number and one special character",
};

export default (req, res, next) => {
  try {
    let msg = "";
    if (req.body.name === undefined) {
      msg = MESSAGE.NAME_EMPTY;
      // eslint-disable-next-line prettier/prettier
    } else if (req.body.username === undefined || req.body.username.length < 6) {
      msg = MESSAGE.USERNAME_LEAST;
    } else if (!utils.regex.usernameRegister(req.body.username)) {
      msg = MESSAGE.USERNAME_CONTAIN;
    } else if (req.body.passwd != req.body.repeatPasswd) {
      msg = MESSAGE.PASSWD_REPEAT_NOT_MATCH;
    } else if (req.body.passwd === undefined || req.body.passwd.length < 8) {
      msg = MESSAGE.PASSWD_LEAST;
    } else if (!utils.regex.passwdRegister(req.body.passwd)) {
      msg = MESSAGE.PASSWD_CONTAIN;
    }
    if (msg != "") {
      const warning = utils.render.warningBar(msg);
      const userData = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
      };
      res.render("pages/Register", { warning: warning, userData: userData });
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};
