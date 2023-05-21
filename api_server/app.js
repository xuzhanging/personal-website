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

// import user login and register router
const userRouter = require("./router/user.js");

// add user login and register router
app.use("/api", userRouter);

// import get user information router
const userInfoRouter = require("./router/userInfo.js");

// add get user information router
app.use("/user", userInfoRouter);

// import publish article router
const publishArticleRouter = require("./router/publishArticle.js");

// add publish article router
app.use("/article", publishArticleRouter);

// import get articles router
const getArticleRouter = require("./router/getArticles.js");

// add get article router
app.use("/article", getArticleRouter);

// import comment router
const commentRouter = require("./router/comments.js");

// add comment router
app.use("/comment", commentRouter);

// import favorite router
const favoriteRouter = require("./router/favorites.js");

// add favorite router
app.use("/favorite", favoriteRouter);

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
