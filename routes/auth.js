import express from "express";

import user from "../controllers/auth.js";
import validateDataRegister from "../middleware/validateDataRegister.js";

const router = express.Router();

router.get("/register", user.getRegisterPage);
router.post("/register", validateDataRegister, user.createUserData);
router.get("/login", user.getLoginPage);
router.post("/login", user.validateLogin);

export default router;
