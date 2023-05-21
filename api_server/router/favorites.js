const express = require("express");

const router = express.Router();

// import favorite router
const favoriteRouter = require("../router_handler/favorites");

router.post("/addFavorite", favoriteRouter.addFavorite);

router.get("/getFavorite", favoriteRouter.getFavorite);

router.get("/deleteFavorite", favoriteRouter.deleteFavorite);

router.get("/getAllFavorite", favoriteRouter.getAllFavorite);

module.exports = router;
