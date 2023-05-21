const db = require("../db/index");

const addFavorite = function (req, res) {
  const str1 = `insert into favorites (user, articleid, favoritetime) values (?, ?, ?)`;
  db.query(
    str1,
    [req.body.user, req.body.articleID, req.body.favoriteTime],
    function (err, results) {
      if (err || results.affectedRows !== 1)
        return res.send({
          status: 1,
          message: err.message,
        });
      if (results.affectedRows === 1)
        return res.send({
          status: 0,
          message: "收藏文章成功！",
        });
    }
  );
};

const getFavorite = function (req, res) {
  const str1 = `select * from favorites where articleid = ? and user = ?`;
  db.query(
    str1,
    [req.query.articleid, req.query.user],
    function (err, results) {
      if (err)
        return res.send({
          status: 1,
          message: err.message,
        });
      res.send({
        status: 0,
        message: "查询成功！",
        data: results,
      });
    }
  );
};

const deleteFavorite = function (req, res) {
  const str1 = `delete from favorites where user=? and articleid=?`;
  db.query(
    str1,
    [req.query.user, req.query.articleid],
    function (err, results) {
      if (err)
        return res.send({
          status: 1,
          message: err.message,
        });
      if (results.affectedRows === 1)
        return res.send({
          status: 0,
          message: "取消收藏成功！",
        });
    }
  );
};

const getAllFavorite = function (req, res) {
  const str1 = `select * from favorites where user=?`;
  db.query(str1, req.query.user, function (err, results) {
    if (err)
      return res.send({
        status: 1,
        message: err.message,
      });
    res.send({
      status: 0,
      message: "获取收藏文章成功！",
      data: results,
    });
  });
};

module.exports = { addFavorite, getFavorite, deleteFavorite, getAllFavorite };
