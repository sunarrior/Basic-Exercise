import utils from "../utils/index.js";

export default async (req, res, next) => {
  try {
    const username = req.cookies.username;
    const sessionId = req.cookies.sessionId;
    const url = req.url;
    if (username != undefined && sessionId != undefined) {
      const result = await utils.redisCache.checkObjByKey(
        username,
        "sessionId",
        sessionId
      );
      if (result) {
        if (
          url === "/" ||
          url === "/login" ||
          url === "/register" ||
          url === "/recovery"
        ) {
          return res.redirect("/homepage");
        } else {
          next();
        }
      } else {
        res.redirect("/login");
      }
    } else {
      if (
        url != "/" &&
        url != "/login" &&
        url != "/register" &&
        url != "/recovery"
      ) {
        res.redirect("/login");
      } else {
        next();
      }
    }
  } catch (err) {
    console.log(err.message);
  }
};
