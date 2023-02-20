import bcrypt from "bcrypt";

const encryptPassword = async function (password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
  } catch (err) {
    console.log(err.message);
  }
};

const validateEncPassword = async function (password, hashPassword) {
  try {
    const result = await bcrypt.compare(password, hashPassword);
    return result;
  } catch (err) {
    console.log(err.message);
  }
};

export default {
  encryptPassword,
  validateEncPassword,
};
