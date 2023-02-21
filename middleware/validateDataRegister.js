import utils from "../utils/index.js  ";

export default (req, res, next) => {
  const regExUsername = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
  const regExPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  let msg = "";
  if (req.body.nameRegister === undefined) {
    msg = "Please enter your name";
    // eslint-disable-next-line prettier/prettier
  } else if (req.body.usernameRegister === undefined || req.body.usernameRegister.length < 6) {
    msg = "Username must be at least 6 characters";
  } else if (!regExUsername.test(req.body.usernameRegister)) {
    msg = "Username must contain both number and letters only";
  } else if (req.body.passwordRegister != req.body.repeatPasswordRegister) {
    msg = "Password does not match repeat password";
    // eslint-disable-next-line prettier/prettier
  } else if (req.body.passwordRegister === undefined || req.body.passwordRegister.length < 8) {
    msg = "Password must be at least 8 characters";
  } else if (!regExPassword.test(req.body.passwordRegister)) {
    // eslint-disable-next-line prettier/prettier
    msg = "Password must contain at least one uppercase character, one number and one special character";
  }
  if (msg != "") {
    // return next(new Error(msg));
    const warning = utils.render.warningBar(msg);
    const userData = {
      name: req.body.nameRegister,
      username: req.body.usernameRegister,
      email: req.body.emailRegister,
    };
    res.render("pages/register", { warning: warning, userData: userData });
  } else {
    next();
  }
};
