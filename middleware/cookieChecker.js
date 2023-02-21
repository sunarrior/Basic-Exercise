import utils from "../utils/index.js";

export default async (req, res, next) => {
  try {
    const username = req.cookies.username;
    const sessionId = req.cookies.sessionId;
    const url = req.url || "/homepage";
    if (username != undefined && sessionId != undefined) {
      const result = await utils.redisHelper.checkCacheObjByKey(
        username,
        sessionId
      );
      if (result) {
        if (url === "/" || url === "/login" || url === "/register") {
          return res.render("pages/homepage");
        } else {
          return res.render("pages" + url);
        }
      }
    } else {
      if (url != "/" && url != "/login" && url != "/register") {
        return res.render("pages/index");
      }
    }
    next();
  } catch (err) {
    console.log(err.message);
  }
};
