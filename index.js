import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import utils from "./utils/index.js";

utils.dbHelper
  .createDBIfNotExists(process.env.DATABASE_NAME)
  .then(function (entities) {
    utils.dbHelper.createTblFromEntityIfNotExists(entities);
  });

app.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
