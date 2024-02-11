#!/usr/bin/env node
/*
Contains definitions for routes.
*/
const redisClient = require("../utils/redis");
const dbClient = require("../utils/db");

class AppController {
    static getStatus(req, res) {
        if (redisClient.isAlive() && dbClient.isAlive()) {
            const data = { "redis": true, "db": true };
            return res.status(200).json(data);
        }
    }
    static async getStats(req, res) {
        const numUsers = await dbClient.nbUsers;
        const numFiles = await dbClient.nbFiles;
        const data = { "users": numUsers, "files": numFiles };
        return res.status(200).json(data);
    }
}

module.exports = AppController;
