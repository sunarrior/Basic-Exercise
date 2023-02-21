const getIndexPage = function (req, res) {
  try {
    res.render("pages/index");
  } catch (err) {
    console.log(err);
  }
};

const getRegisterPage = function (req, res) {
  try {
    res.render("pages/register", { warning: "", userData: "" });
  } catch (err) {
    console.log(err);
  }
};

const getLoginPage = function (req, res) {
  try {
    res.render("pages/login", { warning: "", username: "" });
  } catch (err) {
    console.log(err);
  }
};

const getHomepagePage = function (req, res) {
  try {
    res.render("pages/homepage");
  } catch (err) {
    console.log(err);
  }
};

const getCalendarPage = function (req, res) {
  try {
    res.render("pages/calendar");
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
};
