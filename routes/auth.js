import express from "express";

import user from "../controllers/auth.js";
import validateDataRegister from "../middleware/validateDataRegister.js";

const router = express.Router();

router.post("/register", validateDataRegister, user.createUserData);
router.post("/login", user.validateLogin);
router.get("/logout", user.userLogout);

export default router;
