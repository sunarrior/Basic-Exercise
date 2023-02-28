export default async (req, res, next) => {
  try {
    if (
      req.session &&
      req.session.username &&
      req.session.userip &&
      req.session.useragent
    ) {
      if (
        req.session.userip === req.ip &&
        req.session.useragent === req.get("User-Agent")
      ) {
        return next();
      }
    }
    res.redirect("/login");
  } catch (err) {
    console.log(err);
  }
};
