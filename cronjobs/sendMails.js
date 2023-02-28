import utils from "../utils/index.js";

import taskDB from "../db/task.db.js";

const cronManager = new utils.cron.CronManager();

const notifyDueDate = async function () {
  try {
    await cronManager.add("notify-due-date", {
      periodText: "*/2 * * * *",
      cb: async function () {
        console.log("start-cronjob-sendmail");
        const today = new Date();
        const tasksList = await taskDB.getAllTaskWithUser();
        let queue = [];
        for (let [idx, task] of tasksList.entries()) {
          const dueDate = new Date(task.due_date);
          const dueDateString = utils.format.getLocalDayString(task.due_date);
          const mailData = {
            email: task.user.email,
            subject: "",
            content: "",
          };
          const duration = dueDate - today;
          if (duration <= 3 * 84600 * 1000) {
            if (duration < 0) {
              mailData.subject = `task has been overdue`;
              mailData.content = `Task <i>${task.content}</i> has been overdue at ${dueDateString}`;
            }
            if (duration > 0) {
              const durationString = utils.format.getDHMSFromMilis(duration);
              mailData.subject = `task due in ${durationString}`;
              mailData.content = `Task <i>${task.content}</i> is going to due at ${dueDateString}`;
            }
            queue.push(utils.mail.sendNotifyDueDate(mailData));
            if (queue.length === 2 || idx === tasksList.length - 1) {
              Promise.all(queue);
              queue = [];
            }
          }
        }
      },
      flag: {
        scheduled: false,
      },
    });
    cronManager.start("notify-due-date");
  } catch (err) {
    console.log(err);
  }
};

export default {
  notifyDueDate,
};
