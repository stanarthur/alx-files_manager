#!/usr/bin/env node
/*
Defines routes for different API endpoints.
*/
const AppController = require("../controllers/AppController");
const UsersController = require("../controllers/UsersController");
const express = require("express");
const router = express.Router();

router.get("/status", AppController.getStatus);
router.get("/stats", AppController.getStats);
router.post("/users", UsersController.postNew);

module.exports = router;
