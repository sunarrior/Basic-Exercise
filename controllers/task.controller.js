import taskDB from "../db/task.db.js";
import userDB from "../db/user.db.js";

import utils from "../utils/index.js";

const createTask = async function (req, res) {
  try {
    const user = await userDB.getUserByEOU(req.cookies.username);
    const createdAt = utils.format.getDayStringDB();
    const dueDate = utils.format.getDayStringDB(req.body.dueDate);
    const task = {
      content: req.body.content,
      created_at: createdAt,
      due_date: dueDate,
      user: user,
    };
    await taskDB.createTask(task);
    res.redirect("/tasks");
  } catch (err) {
    console.log(err);
  }
};

const updateTask = async function (req, res) {
  try {
    const taskid = req.params.id;

    // check if task exists
    const task = await taskDB.getTaskById(taskid);
    if (!task) {
      return res.redirect("/tasks");
    }

    // Check to set data from body or db
    let isComplete = req.body.isComplete;
    if (isComplete === undefined) {
      isComplete = task.is_complete;
    }
    let content = req.body.content;
    if (content === undefined) {
      content = task.content;
    }
    let dueDate = req.body.dueDate;
    if (dueDate === undefined) {
      dueDate = task.dueDate;
    }
    const taskData = {
      content: content,
      due_date: dueDate,
      is_complete: isComplete,
    };

    await taskDB.updateTask(taskid, taskData);
    res.redirect("/tasks");
  } catch (err) {
    console.log(err);
  }
};

const deleteTaskById = async function (req, res) {
  try {
    const taskid = req.params.id;

    // check if task exists
    const task = await taskDB.getTaskById(taskid);
    if (!task) {
      return res.redirect("/tasks");
    }

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
