const express = require("express");
const config = require("./config");
const expressJWT = require("express-jwt");

const app = express();

// cors
const cors = require("cors");
app.use(cors());

// analysis form data (json and urlencoded)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// transform token to json
app.use(
  expressJWT({ secret: config.JWT_SECRET_KEY }).unless({ path: [/^\/api\//] })
);

const userRouter = require("./router/user.js");

// add user router
app.use("/api", userRouter);

// err middleware
app.use(function (err, req, res, next) {
  // catch err which identity fail
  if (err.name === "UnauthorizedError")
    return res.send({
      status: 1,
      message: "身份认证失败",
    });
  next();
});

// listen 3007 port which running server
app.listen(3007, () => console.log("express server running at 127.0.0.1:3007"));
