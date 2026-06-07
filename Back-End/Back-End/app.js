const express = require("express");
const cors = require("cors");

const morgan = require("morgan");
const path = require("path");

const ErrorController = require("./Controller/errorController");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const authentic = require("./Routes/authRouter");
const Announcement = require("./Routes/AnnouncementRoute")
const Qms = require("./Routes/QmsRoute")

let app = express();

const logger = function (req, res, next) {
  console.log("Middleware Called");
  next();
};

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.set("trust proxy", true);
app.use(
  session({
    secret: process.env.SECRET_STR,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.CONN_STR,
      ttl: 12 * 60 * 60, // 12 hours in seconds
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "none",
      maxAge: 12 * 60 * 60 * 1000,
    },
    rolling: true,
  }),
);
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  }),
);

app.use(logger);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//importante ito para pag view ng picture sa table .etcc..
const uploadsDir = path.join(__dirname, "..", "uploads");
app.use("/api/v1/announcement", Announcement);
app.use("/api/v1/qms", Qms);
app.use("/api/v1/authentication", authentic);






app.use(ErrorController);

module.exports = app;
