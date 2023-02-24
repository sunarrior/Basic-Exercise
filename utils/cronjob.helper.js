import cron from "node-cron";

import utils from "./index.js";

const notifyDueDateComing = function (email, task) {
  try {
    const dueDate = new Date(task.due_date);
    const cronNotify = cron.schedule("0 0 * * *", function () {
      const today = new Date();
      const duration = dueDate.getDate() - today.getDate();

      const mailData = {
        to: email,
        subject: ``,
        htmlContent: `<b>
          Task: ${task.content} is going to due 
          at ${utils.format.getLocalDayString(task.due_date)}
        </b>`,
      };

      if (duration === 0) {
        //
      }
    });
    cronNotify.start();
    setTimeout(() => {
      cronNotify.stop();
    }, 0 * 1000);
  } catch (err) {
    console.log(err);
  }
};

export default {
  notifyDueDateComing,
};
