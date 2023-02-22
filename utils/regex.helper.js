const usernameRegister = function (username) {
  const regex = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
  return regex.test(username);
};

const passwdRegister = function (passwd) {
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  return regex.test(passwd);
};

const accountType = function (account) {
  const regex = /@/;
  return regex.test(account);
};

export default {
  usernameRegister,
  passwdRegister,
  accountType,
};
