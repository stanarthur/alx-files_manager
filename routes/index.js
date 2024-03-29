#!/usr/bin/env node
/*
Defines routes for different API endpoints.
*/
const AppController = require("../controllers/AppController");
const UsersController = require("../controllers/UsersController");
const AuthController = require("../controllers/AuthController");
const express = require("express");
const router = express.Router();

router.get("/status", AppController.getStatus);
router.get("/stats", AppController.getStats);
router.post("/users", UsersController.postNew);
router.get("/connect", AuthController.getConnect);
router.get("/disconnect", AuthController.getDisconnect);
router.get("/users/me", UsersController.getMe);

module.exports = router;
