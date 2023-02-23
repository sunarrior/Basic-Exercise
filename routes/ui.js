import express from "express";

import ui from "../controllers/ui.controller.js";
import cookieChecker from "../middleware/cookie-checker.js";

const router = express.Router();

router.get("/register", cookieChecker, ui.getRegisterPage);
router.get("/login", cookieChecker, ui.getLoginPage);
router.get("/recovery", cookieChecker, ui.getForgotPasswdPage);
router.get("/homepage", cookieChecker, ui.getHomepagePage);
router.get("/calendar", cookieChecker, ui.getCalendarPage);
router.get("/tasks", cookieChecker, ui.getTodoListPage);
router.get("/tasks/:id", cookieChecker, ui.getEditTaskPage);
router.get("/", cookieChecker, ui.getIndexPage);

export default router;
