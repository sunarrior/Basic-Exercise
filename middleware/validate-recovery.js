import utils from "../utils/index.js  ";

const MESSAGE = {
  PASSWD_REPEAT_NOT_MATCH: "Password does not match repeat password",
  PASSWD_LEAST: "Password must be at least 8 characters",
  PASSWD_CONTAIN:
    "Password must contain at least one uppercase character, one number and one special character",
};

export default (req, res, next) => {
  try {
    if (req.query.verify) {
      let msg = "";
      if (req.body.passwd != req.body.repeatPasswd) {
        msg = MESSAGE.PASSWD_REPEAT_NOT_MATCH;
      } else if (req.body.passwd === undefined || req.body.passwd.length < 8) {
        msg = MESSAGE.PASSWD_LEAST;
      } else if (!utils.regex.passwdRegister(req.body.passwd)) {
        msg = MESSAGE.PASSWD_CONTAIN;
      }
      if (msg != "") {
        const warning = utils.render.warningBar(msg);
        const account = req.body.account;
        res.render("pages/RecoveryPasswd", {
          warning: warning,
          account: account,
        });
      } else {
        next();
      }
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};
