import utils from "../utils/index.js";
import userDB from "../db/user.db.js";
import taskDB from "../db/task.db.js";

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

const getTodoListPage = async function (req, res) {
  try {
    const username = req.cookies.usernames;
    const user = await userDB.getUserByEOU(username);
    const tasksList = await userDB.getAllTasksOfUser(user.id);
    const todolist = tasksList.reduce((result, task) => {
      const taskUI = utils.render.taskUI(
        task.id,
        task.content,
        utils.format.getLocalDayString(task.created_at),
        utils.format.getLocalDayString(task.due_date),
        task.is_complete
      );
      return result + taskUI;
    }, "");
    res.render("pages/TodoList", { todolist: todolist });
  } catch (err) {
    console.log(err);
  }
};

const getEditTaskPage = async function (req, res) {
  try {
    const taskid = req.params.id;
    const task = await taskDB.getTaskById(taskid);
    res.render("pages/UpdateTask", {
      task: {
        id: task.id,
        content: task.content,
        due_date: utils.format.getDatePickerString(task.due_date),
      },
    });
  } catch (err) {
    console.log(err);
  }
};

export default {
  getIndexPage,
  getRegisterPage,
  getLoginPage,
  getForgotPasswdPage,
  getHomepagePage,
  getCalendarPage,
  getTodoListPage,
  getEditTaskPage,
};
