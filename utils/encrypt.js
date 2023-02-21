import bcrypt from "bcrypt";
import util from "util";
const { generatePrime } = await import("node:crypto");

const generatePrimePromise = util.promisify(generatePrime);

const encryptPassword = async function (password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
  } catch (err) {
    console.log(err);
  }
};

const validateEncPassword = async function (password, hashPassword) {
  try {
    const result = await bcrypt.compare(password, hashPassword);
    return result;
  } catch (err) {
    console.log(err);
  }
};

const generateToken = async function (bitLength) {
  try {
    const p = await generatePrimePromise(bitLength, { bigint: true });
    const q = await generatePrimePromise(bitLength, { bigint: true });
    const n = p * q;
    return n.toString(16);
  } catch (err) {
    console.log(err);
  }
};

export default {
  encryptPassword,
  validateEncPassword,
  generateToken,
};
