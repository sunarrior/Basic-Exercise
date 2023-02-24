import express from "express";

import ui from "../controllers/ui.controller.js";
import cookieChecker from "../middleware/cookie-checker.js";

const router = express.Router();

router.get("/register", ui.getRegisterPage);
router.get("/verify", ui.getResendVerifyPage);
router.get("/login", ui.getLoginPage);
router.get("/recovery", ui.getForgotPasswdPage);
router.get("/homepage", ui.getHomepagePage);
router.get("/calendar", ui.getCalendarPage);
router.get("/tasks", ui.getTodoListPage);
router.get("/tasks/:id", ui.getEditTaskPage);
router.get("/", ui.getIndexPage);

export default router;
