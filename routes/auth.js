import express from "express";

import user from "../controllers/auth.js";

const router = express.Router();

router.get("/register", user.getRegisterPage);
router.post("/register", user.createUserData);
router.get("/login", user.getLoginPage);
router.post("/login", user.validateLogin);

export default router;
