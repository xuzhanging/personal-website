const express = require("express");

const router = express.Router();

const userRouterHandler = require("../router_handler/user.js");

// register router
router.post("/register", userRouterHandler.registerHandler);

// login router
router.post("/login", userRouterHandler.loginHandler);

module.exports = router;
