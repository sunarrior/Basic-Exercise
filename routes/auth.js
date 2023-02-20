import express from "express";

import user from "../controllers/auth.js";
import validateDataRegister from "../middleware/validateDataRegister.js";
import cookieChecker from "../middleware/cookieChecker.js";

const router = express.Router();

router.get("/register", cookieChecker, user.getRegisterPage);
router.post("/register", validateDataRegister, user.createUserData);
router.get("/login", cookieChecker, user.getLoginPage);
router.post("/login", user.validateLogin);
router.get("/logout", user.userLogout);

export default router;
