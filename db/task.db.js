import utils from "../utils/index.js";

const dataSource = await utils.db.dataSource;
const taskDataRepository = dataSource.getRepository("Task");

const createTask = async function (task) {
  try {
    await taskDataRepository.save(task);
  } catch (err) {
    console.log(err);
  }
};

const getAllTasks = async function () {
  try {
    const result = await taskDataRepository.find({
      relations: {
        user: true,
      },
    });
    return result;
  } catch (err) {
    console.log(err);
  }
};

const getTaskById = async function (taskid) {
  try {
    const result = await taskDataRepository.findOneBy({ id: taskid });
    return result;
  } catch (err) {
    console.log(err);
  }
};

const updateTask = async function (taskid, task) {
  try {
    await taskDataRepository.update(taskid, task);
  } catch (err) {
    console.log(err);
  }
};

const deleteTaskById = async function (taskid) {
  await taskDataRepository.delete({ id: taskid });
};

export default {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTaskById,
};
