import bcrypt from "bcrypt";

const encryptPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
};

const validateEncPassword = async function (password, hashPassword) {
  const result = await bcrypt.compare(password, hashPassword);
  return result;
};

export default {
  encryptPassword,
  validateEncPassword,
};
