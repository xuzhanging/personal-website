const db = require("../db/index.js");

const addCommentHandler = function (req, res) {
  const comment = req.body;
  const str1 = `insert into comments (commentAuthor, commentTime, belongArticle, commentContent) values (?, ?, ?, ?)`;
  db.query(
    str1,
    [
      comment.commentAuthor,
      comment.commentTime,
      comment.belongArticle,
      comment.commentContent,
    ],
    function (err, results) {
      if (err || results.affectedRows !== 1)
        return res.send({
          status: 1,
          message: "评论数据插入失败！" + err.message,
        });
      if (results.affectedRows === 1) {
        res.send({
          status: 0,
          message: "评论数据插入成功！",
        });
      }
    }
  );
};

const getAllComments = function (req, res) {
  const str1 = `select * from comments where belongArticle = ? order by commentTime ${
    req.query.order === "latest" ? "DESC" : "ASC"
  }`;
  db.query(str1, req.query.articleid, function (err, results) {
    if (err)
      return res.send({
        status: 1,
        message: err.message,
      });
    return res.send({
      status: 0,
      message: "获取评论成功！",
      data: results,
    });
  });
};

module.exports = { addCommentHandler, getAllComments };
