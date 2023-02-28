import express from "express";

import user from "../controllers/auth.controller.js";
import authenRequire from "../middleware/authen-require.js";
import hasSession from "../middleware/has-session.js";
import validateRegister from "../middleware/validate-register.js";
import validateRecovery from "../middleware/validate-recovery.js";

const router = express.Router();

router.post("/register", [hasSession, validateRegister], user.createUser);
router.post("/login", hasSession, user.validateLogin);
router.get("/logout", authenRequire, user.userLogout);
router.post("/verify", hasSession, user.reSendVerifyCode);
router.get("/verify/:username/:token", hasSession, user.verifyAccount);
router.post("/recovery", [hasSession, validateRecovery], user.recoveryRequest);

export default router;
