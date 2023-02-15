import utils from "./utils/index.js";

import User from "./entity/User.js";

const entityList = [User];

utils.dbHelper.startConnection().then(function () {
  utils.dbHelper.createTblFromEntityIfNotExists(entityList).then(function () {
    utils.dbHelper.saveUserData(User);
    // utils.dbHelper.closeConnection();
  });
});
