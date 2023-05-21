const express = require("express");

const router = express.Router();

const getArticlesRouterHandler = require("../router_handler/getArticles.js");

router.get("/getCurrentAll", getArticlesRouterHandler.getCurrentAllHandler);

router.get("/getAll", getArticlesRouterHandler.getAllHandler);

router.get("/getSpecifiedAll", getArticlesRouterHandler.getSpecifiedAllHandler);

router.get("/getSpecifiedOne", getArticlesRouterHandler.getSpecifiedOneHandler);

// exports router
module.exports = router;
