import cron from "node-cron";

cron.schedule("*/120 * * * * *", function () {
  console.log("haha");
});
