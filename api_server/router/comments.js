const express = require("express");

const router = express.Router();

// import comment router handler
const commentRouterHandler = require("../router_handler/comments.js");

// add comment router
router.post("/addComment", commentRouterHandler.addCommentHandler);

// get comment router
router.get("/getAllComment", commentRouterHandler.getAllComments);

// exports router
module.exports = router;
