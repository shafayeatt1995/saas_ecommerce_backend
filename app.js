require("dotenv").config();
const express = require("express");
const app = express();
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const fileUpload = require("express-fileupload");
const mongoMiddleware = require("./middleware/mongoMiddleware");
const port = parseInt(process.env.PORT || "8000", 10);
require("./config/mongo");

app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      ttl: 24 * 60 * 60,
    }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);
app.use(fileUpload({ limits: { fileSize: 10 * 1024 * 1024 } }));

// app.use("/webhooks", mongoMiddleware, require("./routes/webhooks"));
app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "Hello world" });
});
app.use("/", mongoMiddleware, require("./routes"));

app.listen(port, "0.0.0.0", () => {
  console.log(`> Server listening at http://localhost:${port}`);
});
