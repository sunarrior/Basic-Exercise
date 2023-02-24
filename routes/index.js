import express from "express";
import auth from "./auth.js";
import task from "./task.js";

const router = express.Router();

router.use("/auth", auth);
router.use("/task", task);

export default router;
