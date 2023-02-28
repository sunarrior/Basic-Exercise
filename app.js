import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import session from "express-session";
import connectRedis from "connect-redis";
const RedisStore = connectRedis(session);

import utils from "./utils/index.js";
import sendMails from "./cronjobs/sendMails.js";

import routes from "./routes/index.js";
import routesUI from "./routes/ui.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    store: new RedisStore({ client: utils.redisCache.getRedisClient() }),
    secret: process.env.SESSION_SECRET,
    name: "_lsid",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: false,
      sameSite: false,
      maxAge: 50 * 60 * 1000,
    },
  })
);

app.use("/api/v1", routes);
app.use("/", routesUI);

// sendMails.notifyDueDate();

export default app;
