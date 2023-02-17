import utils from "../utils/index.js  ";

export default (req, res, next) => {
  const regEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  let msg = "";
  if (req.body.nameRegister === undefined) {
    msg = "Please enter your name";
    // eslint-disable-next-line prettier/prettier
  } else if (req.body.usernameRegister === undefined || req.body.usernameRegister.length < 2) {
    msg = "Username must be at least 2 characters";
  } else if (req.body.passwordRegister != req.body.repeatPasswordRegister) {
    msg = "Password does not match repeat password";
    // eslint-disable-next-line prettier/prettier
  } else if (req.body.passwordRegister === undefined || req.body.passwordRegister.length < 6) {
    msg = "Password must be at least 6 characters";
  } else if (!regEx.test(req.body.passwordRegister)) {
    // eslint-disable-next-line prettier/prettier
    msg = "Password must contain at least one uppercase character, one number and one special character";
  }
  if (msg != "") {
    // return next(new Error(msg));
    const warning = utils.render.registerWarning(msg);
    res.render("pages/register", { warning: warning });
  } else {
    next();
  }
};
