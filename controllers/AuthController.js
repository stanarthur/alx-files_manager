#!/usr/bin/env node
/*
Authenticate a user
*/
const dbClient = require("../utils/db");
const redisClient = require("../utils/redis");
const uuid = require("uuid");
const passwordHasher = require("../utils/passwordHasher");

class AuthController {
    static async getConnect(req, res) {
        // Connects an existing user thereby creating token valid
        // for 24hours on redis storage as user identity
        const Authorization = req.headers.authorization;
        try {
            const basic = Authorization.split(" ")[0];
            if (basic == "Basic") {
                const authHeader = Authorization.split(" ")[1];
                const credentials = Buffer.from(authHeader, "base64").toString("utf8");
                const [email, password] = credentials.split(":");
                const hashedPwd = passwordHasher(password);
                const user = await dbClient.userExists(email, hashedPwd);
                if (!user) {
                    res.status(401).json({"error":"Unauthorized"});
                }
                else {
                    const token = uuid.v4();
                    const key = `auth_${token}`;
                    const userId = user._id.toString();
                    if (userId) {
                        redisClient.set(key, userId, 24*60*60);
                    }
                    res.status(200).json({ "token": token });
                }
            }
        }
        catch(err) {
            res.status(401).json({"error":"Unauthorized"});
        }
    }

    static async getDisconnect(req, res) {
        // Manually Logs-out or deletes a users token from redis
        // storage/server
        const xToken = req.header("X-Token");
        if (xToken) {
            const key = `auth_${xToken}`;
            const userId = await redisClient.get(key);
            if (!userId) {
                res.status(201).json({"error": "Unauthorized"});
            }
            else {
                redisClient.del(key);
                res.status(204).json({});
            }
        }
    }
}

module.exports = AuthController;
