const express = require("express");

const router = express.Router();

const userInfoRouterHandler = require("../router_handler/userInfo.js");

// get user information router
router.get("/getInfo", userInfoRouterHandler.getUserInfoHandler);

module.exports = router;
