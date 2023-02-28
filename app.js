import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cookieParser from "cookie-parser";

import cookieChecker from "./middleware/cookie-checker.js";

import routes from "./routes/index.js";
import routesUI from "./routes/ui.js";

import sendMails from "./cronjobs/sendMails.js";
// sendMails.notifyDueDate();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cookieChecker);

app.use("/api/v1", routes);
app.use("/", routesUI);

export default app;
