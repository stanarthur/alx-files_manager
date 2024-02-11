#!/usr/bin/env node
const dbClient = require("../utils/db");
/*
Contains the new endpoint `users`
*/
class UsersController {
    static async postNew(req, res) {
        const { email, password } = req.body;
        if (!email) {
            res.status(400).json({"error": "Missing email"});
        }
        if (!password) {
            res.status(400).json({"error": "Missing password"});
        }
        const exists = await dbClient.userExists(email);
        if (exists) {
            res.status(400).json({"error": "Already exist"});
        }
        const data = await dbClient.createUser(email, password);
        res.status(201).json(data);
    }
}
module.exports = UsersController;
