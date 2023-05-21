const db = require("../db/index.js");

const getUserInfoHandler = function (req, res) {
  res.send(req.user);
};

module.exports = { getUserInfoHandler };
