import express from "express";

import ui from "../controllers/ui.controller.js";
import authenRequire from "../middleware/authen-require.js";
import hasSession from "../middleware/has-session.js";

const router = express.Router();

router.get("/register", hasSession, ui.getRegisterPage);
router.get("/verify", hasSession, ui.getResendVerifyPage);
router.get("/login", hasSession, ui.getLoginPage);
router.get("/recovery", hasSession, ui.getForgotPasswdPage);
router.get("/homepage", authenRequire, ui.getHomepagePage);
router.get("/calendar", authenRequire, ui.getCalendarPage);
router.get("/tasks", authenRequire, ui.getTodoListPage);
router.get("/tasks/:id", authenRequire, ui.getEditTaskPage);
router.get("/", hasSession, ui.getIndexPage);

export default router;
