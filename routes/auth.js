import express from "express";

import user from "../controllers/auth.js";
import validateDataRegister from "../middleware/validateDataRegister.js";

const router = express.Router();

router.post("/register", validateDataRegister, user.createUserData);
router.post("/login", user.validateLogin);
router.get("/logout", user.userLogout);
// router.get("/verify/:username", user.verifyAccount);
router.get("/verify/:username/:token", user.verifyAccount);

export default router;
