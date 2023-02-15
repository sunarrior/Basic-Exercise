import express from "express";

const router = express.Router();

router.post("/login", function (req, res) {
  // console.log(req.body)
  // Create and save session
  res.render("pages/homepage");
});

router.post("register", function (req, res) {
  // Validate and save data to db
  // Popup notify that user has successfully registered
});

export default router;
