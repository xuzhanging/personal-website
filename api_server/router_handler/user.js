const db = require("../db/index");
const jwt = require("jsonwebtoken");
const config = require("../config");

// register router handler
const registerHandler = function (req, res) {
  // get form data which from client
  const userinfo = req.body;
  // judge data whether legal
  if (!userinfo.email || !userinfo.password) {
    return res.send({
      status: 1,
      message: "user email or password should not null!",
    });
  }
  const sql1 = `select * from users where email=?`;
  db.query(sql1, [userinfo.email], function (err, results) {
    // if excute sql1 fail
    if (err) {
      return res.send({ status: 1, message: err.message });
    }
    // user email has been used
    if (results.length > 0) {
      return res.send({
        status: 1,
        message: "user email has been used, please try another email!",
      });
    }
    // if user email could use, then try add to database and register success
    const sql2 = "insert into users set ?";
    db.query(
      sql2,
      { email: userinfo.email, password: userinfo.password },
      function (err, results) {
        // if excute sql2 fail
        if (err) return res.send({ status: 1, message: err.message });
        // if excute sql2 success, but affected rows not equal to 1
        if (results.affectedRows !== 1) {
          return res.send({
            status: 1,
            message: "register user failed, please try again!",
          });
        }
        // register success
        return res.send({ status: 0, message: "register success" });
      }
    );
  });
};

// login router handler
const loginHandler = function (req, res) {
  // get data which from client
  const userinfo = req.body;
  // search user who has this email from database
  const sql = `select * from users where email=?`;
  db.query(sql, userinfo.email, function (err, results) {
    // excute sql fail
    if (err)
      return res.send({
        status: 1,
        message: "login failed!",
      });
    // if excute sql success, but the search results not equal to 1
    if (results.length !== 1)
      return res.send({
        status: 1,
        message: "login failed!",
      });
    // if input password equal to user password which storage in database, then send token to client and login success
    if (results[0].password !== userinfo.password) {
      return res.send({
        status: 1,
        message: "password err!",
      });
    }
    const user = { email: results[0].email };
    // generate token
    const tokenStr = jwt.sign(user, config.JWT_SECRET_KEY, {
      expiresIn: "10h", // set token valid time to 10 hours
    });
    return res.send({
      status: 0,
      message: "login success!",
      // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
      token: "Bearer " + tokenStr,
    });
  });
};

module.exports = { registerHandler, loginHandler };
