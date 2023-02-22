const getIndexPage = function (req, res) {
  try {
    res.render("pages/index");
  } catch (err) {
    console.log(err);
  }
};

const getRegisterPage = function (req, res) {
  try {
    res.render("pages/Register", { warning: "", userData: "" });
  } catch (err) {
    console.log(err);
  }
};

const getLoginPage = function (req, res) {
  try {
    res.render("pages/Login", { warning: "", account: "" });
  } catch (err) {
    console.log(err);
  }
};

const getForgotPasswdPage = function (req, res) {
  try {
    res.render("pages/ForgotPasswd", { warning: "" });
  } catch (err) {
    console.log(err);
  }
};

const getHomepagePage = function (req, res) {
  try {
    res.render("pages/Homepage");
  } catch (err) {
    console.log(err);
  }
};

const getCalendarPage = function (req, res) {
  try {
    res.render("pages/Calendar");
  } catch (err) {
    console.log(err);
  }
};

export default {
  getIndexPage,
  getRegisterPage,
  getLoginPage,
  getHomepagePage,
  getCalendarPage,
  getForgotPasswdPage,
};
