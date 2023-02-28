import express from "express";
import auth from "./auth.js";
import task from "./task.js";

import authenRequire from "../middleware/authen-require.js";

const router = express.Router();

router.use("/auth", auth);
router.use("/task", authenRequire, task);

export default router;
