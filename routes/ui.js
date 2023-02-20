import express from "express";

import ui from "../controllers/ui.js";
import cookieChecker from "../middleware/cookieChecker.js";

const router = express.Router();

router.get("/register", cookieChecker, ui.getRegisterPage);
router.get("/login", cookieChecker, ui.getLoginPage);
router.get("/homepage", cookieChecker, ui.getHomepagePage);
router.get("/calendar", cookieChecker, ui.getCalendarPage);
router.get("/", cookieChecker, ui.getIndexPage);

export default router;
