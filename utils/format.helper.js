const getDayStringDB = function (dayString) {
  try {
    if (dayString === undefined) {
      dayString = new Date();
    } else if (dayString.substring(0, 5)[4] != "-") {
      dayString = new Date();
    }
    const day = new Date(dayString);
    const localDate = day.getDate() < 10 ? "0" + day.getDate() : day.getDate();
    const localMonth =
      day.getMonth() < 9 ? "0" + (day.getMonth() + 1) : day.getMonth() + 1;
    const localYear = day.getFullYear() < 1970 ? 1970 : day.getFullYear();
    const localTime = day.toLocaleTimeString("en-GB");
    const dayStringDB =
      localYear + "-" + localMonth + "-" + localDate + " " + localTime;
    return dayStringDB;
  } catch (err) {
    console.log(err);
  }
};

const getLocalDayString = function (dayString) {
  try {
    const day = new Date(dayString);
    return day.toLocaleString("en-GB");
  } catch (err) {
    console.log(err);
  }
};

const getDatePickerString = function (dayString) {
  try {
    const day = new Date(dayString);
    const localDate = day.getDate() < 10 ? "0" + day.getDate() : day.getDate();
    const localMonth =
      day.getMonth() < 9 ? "0" + (day.getMonth() + 1) : day.getMonth() + 1;
    const localYear = day.getFullYear() < 1970 ? 1970 : day.getFullYear();
    const localTime = day.toLocaleTimeString("en-GB").substring(0, 5);
    const dayStringDB =
      localYear + "-" + localMonth + "-" + localDate + "T" + localTime;
    return dayStringDB;
  } catch (err) {
    console.log(err);
  }
};

const getDHMSFromMilis = function (milis) {
  try {
    const day = Math.floor(milis / (24 * 60 * 60 * 1000));
    milis = milis % (24 * 60 * 60 * 1000);
    const hour = Math.floor(milis / (60 * 60 * 1000));
    milis = milis % (60 * 60 * 1000);
    const minute = Math.floor(milis / (60 * 1000));
    milis = milis % (60 * 1000);
    const second = Math.floor(milis / 1000);
    return day + "d:" + hour + "h:" + minute + "m:" + second + "s";
  } catch (err) {
    console.log(err);
  }
};

export default {
  getDayStringDB,
  getLocalDayString,
  getDatePickerString,
  getDHMSFromMilis,
};
