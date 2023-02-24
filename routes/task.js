import express from "express";

import task from "../controllers/task.controller.js";

import cookieChecker from "../middleware/cookie-checker.js";

const router = express.Router();

router.post("/", task.createTask);
router.post("/:id/update", task.updateTask);
router.get("/:id/delete", task.deleteTaskById);

export default router;
