const getDayStringDB = function (dayString) {
  const day = new Date(dayString);
  const localDate = day.getDate() < 10 ? "0" + day.getDate() : day.getDate();
  const localMonth =
    day.getMonth() < 9 ? "0" + (day.getMonth() + 1) : day.getMonth() + 1;
  const localYear = day.getFullYear() < 1970 ? 1970 : day.getFullYear();
  const localTime = day.toLocaleTimeString("en-GB");
  const dayStringDB =
    localYear + "-" + localMonth + "-" + localDate + " " + localTime;
  return dayStringDB;
};

const getTodayStringDB = function () {
  const day = new Date();
  const localDate = day.getDate() < 10 ? "0" + day.getDate() : day.getDate();
  const localMonth =
    day.getMonth() < 9 ? "0" + (day.getMonth() + 1) : day.getMonth() + 1;
  const localYear = day.getFullYear() < 1970 ? 1970 : day.getFullYear();
  const localTime = day.toLocaleTimeString("en-GB");
  const dayStringDB =
    localYear + "-" + localMonth + "-" + localDate + " " + localTime;
  return dayStringDB;
};

const getLocalDayString = function (dayString) {
  const day = new Date(dayString);
  return day.toLocaleString("en-GB");
};

const getDatePickerString = function (dayString) {
  const day = new Date(dayString);
  const localDate = day.getDate();
  const localMonth = "0" + (day.getMonth() + 1);
  const localYear = day.getFullYear();
  const localTime = day.toLocaleTimeString("en-GB").substring(0, 5);
  const dayStringDB =
    localYear + "-" + localMonth + "-" + localDate + "T" + localTime;
  return dayStringDB;
};

export default {
  getDayStringDB,
  getTodayStringDB,
  getLocalDayString,
  getDatePickerString,
};
