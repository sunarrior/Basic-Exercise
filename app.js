import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import bodyParser from "body-parser";

import routes from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/v1", routes);
app.get("/", (req, res) => {
  res.render("pages/index");
});

export default app;
