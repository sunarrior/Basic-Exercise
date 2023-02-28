import bcrypt from "bcrypt";
import util from "util";
const { generatePrime, randomBytes } = await import("node:crypto");

const generatePrimePromise = util.promisify(generatePrime);
const randomBytesPromise = util.promisify(randomBytes);

const base64Encode = function (text) {
  const b64String = Buffer.from(text).toString("base64");
  return b64String;
};

const base64Decode = function (enc) {
  const text = Buffer.from(enc).toString("ascii");
  return text;
};

const encryptPasswd = async function (passwd) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPasswd = await bcrypt.hash(passwd, salt);
    return hashPasswd;
  } catch (err) {
    console.log(err);
  }
};

const validatePasswd = async function (passwd, hashPasswd) {
  try {
    const result = await bcrypt.compare(passwd, hashPasswd);
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

const generateRecoveryCode = async function () {
  const recoveryCodeFull = await randomBytesPromise(20);
  const recoveryCode = recoveryCodeFull.toString("hex").substring(10, 16);
  return recoveryCode;
};

export default {
  base64Encode,
  base64Decode,
  encryptPasswd,
  validatePasswd,
  generateToken,
  generateRecoveryCode,
};
