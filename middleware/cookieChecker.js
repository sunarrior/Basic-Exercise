import utils from "../utils/index.js";

export default async (req, res, next) => {
  try {
    const username = req.cookies.username;
    const sessionId = req.cookies.sessionId;
    if (username != undefined && sessionId != undefined) {
      const result = await utils.redisHelper.checkSessionCache(
        username,
        sessionId
      );
      if (result) {
        return res.render("pages/homepage");
      }
    }
    next();
  } catch (err) {
    console.log(err.message);
  }
};
