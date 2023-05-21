const db = require("../db/index.js");

const getCurrentAllHandler = function (req, res) {
  const currentUser = req.user.email;
  const order = req.query.order;
  const str1 = `select * from articles where author=? order by ${order} desc`;
  db.query(str1, currentUser, function (err, results) {
    if (err)
      return res.send({
        status: 1,
        message: err.message,
      });
    return res.send({
      status: 0,
      data: results,
    });
  });
};

const getAllHandler = function (req, res) {
  const str1 = `select * from articles order by hot desc limit 4`;
  db.query(str1, function (err, results) {
    if (err)
      return res.send({
        status: 1,
        message: err.message,
      });
    return res.send({
      status: 0,
      data: results,
    });
  });
};

const getSpecifiedAllHandler = function (req, res) {
  const str1 = `select * from articles where title like ? order by ${req.query.order} desc`;
  db.query(str1, "%" + req.query.title + "%", function (err, results) {
    if (err)
      return res.send({
        status: 1,
        message: err.message,
      });
    return res.send({
      status: 0,
      message: "get search results success",
      data: results,
    });
  });
};

const getSpecifiedOneHandler = function (req, res) {
  const str1 = `select * from articles where articleid = ?`;
  db.query(str1, req.query.articleID, function (err, results) {
    if (err)
      return res.send({
        status: 1,
        message: "获取文章数据失败！",
      });
    return res.send({
      status: 0,
      message: "获取文章数据成功！",
      data: results,
    });
  });
};

module.exports = {
  getCurrentAllHandler,
  getAllHandler,
  getSpecifiedAllHandler,
  getSpecifiedOneHandler,
};
