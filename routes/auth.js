import express from "express";

import user from "../controllers/auth.controller.js";
import cookieChecker from "../middleware/cookie-checker.js";
import validateRegister from "../middleware/validate-register.js";
import validateRecovery from "../middleware/validate-recovery.js";

const router = express.Router();

router.post("/register", validateRegister, user.createUser);
router.post("/login", user.validateLogin);
router.get("/logout", cookieChecker, user.userLogout);
router.get("/verify/:username/:token", user.verifyAccount);
router.post("/recovery", validateRecovery, user.recoveryRequest);

export default router;
