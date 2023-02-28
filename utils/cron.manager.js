import cron from "node-cron";

class CronManager {
  constructor() {
    this._jobs = {};
  }

  exists(name) {
    return this._jobs[name];
  }

  async add(name, cronObj) {
    if (this.exists(name)) {
      throw new Error("Job name has already been exists");
    }
    this._jobs[name] = cron.schedule(
      cronObj.periodText,
      cronObj.cb,
      cronObj.flag
    );
  }

  async start(name) {
    if (this.exists(name)) {
      this._jobs[name].start();
    } else {
      throw new Error("Job is not exists");
    }
  }

  async stop(name) {
    if (this.exists(name)) {
      this._jobs[name].stop();
    } else {
      throw new Error("Job is not exists");
    }
  }

  delete(name) {
    if (this.exists(name)) {
      delete this._jobs[name];
    } else {
      throw new Error("Job is not exists");
    }
  }
}

export default { CronManager };
