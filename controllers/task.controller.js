import taskDB from "../db/task.db.js";
import userDB from "../db/user.db.js";

import utils from "../utils/index.js";

const createTask = async function (req, res) {
  try {
    const user = await userDB.getUserByEOU(req.cookies.username);
    const createdAt = utils.format.getTodayStringDB();
    const dueDate = utils.format.getDayStringDB(req.body.dueDate);
    const task = {
      content: req.body.content,
      created_at: createdAt,
      due_date: dueDate,
      user: user,
    };
    // console.log(task);
    await taskDB.createTask(task);
    res.redirect("/tasks");
  } catch (err) {
    console.log(err);
  }
};

const updateTask = async function (req, res) {
  try {
    const taskid = req.params.id;
    const task = {
      content: req.body.content,
      due_date: req.body.dueDate,
    };
    await taskDB.updateTask(taskid, task);
    res.redirect("/tasks");
  } catch (err) {
    console.log(err);
  }
};

const deleteTaskById = async function (req, res) {
  try {
    const taskid = req.params.id;
    await taskDB.deleteTaskById(taskid);
    res.redirect("/tasks");
  } catch (err) {
    console.log(err);
  }
};

export default {
  createTask,
  updateTask,
  deleteTaskById,
};
