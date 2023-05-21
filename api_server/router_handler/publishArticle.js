const db = require("../db/index");

const publishHandler = function (req, res) {
  const articleData = {
    author: req.body.author,
    publishTime: req.body.publishTime,
    title: req.body.title,
    content: req.body.content,
  };
  const str1 = `insert into articles set ?`;
  db.query(str1, articleData, function (err, results) {
    if (err) return console.log(err.message);
    if (results.affectedRows !== 1)
      res.send({
        status: 1,
        message: "insert article data failed",
      });
    res.send({
      status: 0,
      message: "发布文章成功！",
    });
  });
};

module.exports = { publishHandler };
