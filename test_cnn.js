// import bcrypt from "bcrypt";

// const password = "haha";
// const password2 = "haha2";

// async function check() {
//   const salt = await bcrypt.genSalt(10);
//   console.log(salt);
//   const hashPassword = await bcrypt.hash(password, 10);
//   const hashPassword2 = await bcrypt.hash(password2, salt);
//   console.log(hashPassword);
//   console.log(hashPassword2);
//   const result = await bcrypt.compare(password, hashPassword2);
//   console.log(result);
// }

// check();

import dbHelper from "./utils/dbHelper.js";

import User from "./model/User.js";

async function test() {
  const dataSource = await dbHelper.dataSource;
  const dataRepository = dataSource.getRepository(User);
  const result = await dataRepository.find();
  // console.log(result);
}

test();
