#!/usr/bin/env node
/*
Contains the new endpoint `users`
*/
const dbClient = require("../utils/db");
const redisClient = require("../utils/redis");
const passwordHasher = require("../utils/passwordHasher");

class UsersController {
    static async postNew(req, res) {
        // Creates a new user and converts password to a hash
        // value for storage on Mongodb
        const { email, password } = req.body;
        if (!email) {
            res.status(400).json({"error": "Missing email"});
        }
        if (!password) {
            res.status(400).json({"error": "Missing password"});
        }
        const hashedPwd = passwordHasher(password);
        const exists = await dbClient.userExists(email, hashedPwd);
        if (exists) {
            res.status(400).json({"error": "Already exist"});
        }
        else {
            const data = await dbClient.createUser(email, hashedPwd);
            res.status(201).json(data);
        }
    }

    static async getMe(req, res) {
        // Gets a user from `X-Token` header and returns the
        // user.id and user.email
        const xToken = req.header("X-Token");
        if (xToken) {
            const key = `auth_${xToken}`;
            const userId = await redisClient.get(key);
            if (userId) {
                const user = await dbClient.getUserById(userId);
                res.json(user);
            }
            else {
                res.status(401).json({"error":"Unauthorized"});
            }    
        }
        else {
            res.status(401).json({"error":"Unauthorized"});
        }    
    }
}

module.exports = UsersController;
