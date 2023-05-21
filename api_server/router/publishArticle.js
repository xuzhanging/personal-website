const express = require("express");

const router = express.Router();

const publishRouterHandler = require("../router_handler/publishArticle.js");

router.post("/publish", publishRouterHandler.publishHandler);

// exports router
module.exports = router;
