#!/usr/bin/env node
/*
MongoDB utils
*/
const { MongoClient } = require('mongodb');
const { createHash } = require('crypto');
const USERS  = "users";
const FILES = "files";

class DBClient{
    constructor() {
        const host = process.env.DB_HOST || "localhost";
        const port = process.env.DB_PORT || 27017;
        this.database = process.env.DB_DATABASE || "files_manager";
        const url = `mongodb://${host}:${port}`;
        this.client = new MongoClient(url);
        this.client.connect()
        .then(() => {
            this.db = this.client.db(this.database);
            // For debugging connection to db
            // console.log(`Connected to database -> ${this.database}`);
            this.client.connected = true;
        })
        .catch(err => {
            // For debugging connection to db
            // console.log(`Error not connected  to database ->${this.database} (${err})`);
            this.client.connected = false;
        });
    }
    isAlive() {
        // Checks connection status if alive or not
        if (this.client.connected) {
            return true;
        }
        else {
            return false;
        }
    }
    async nbUsers() {
        // Async function that returns the number of users
        await this.client.connect();
        const db = this.client.db(this.database);
        const users = db.collection(USERS);
        const numUsers = await users.countDocuments();
        return numUsers;
    }
    async nbFiles() {
        // Async function that returns the number of files
        await this.client.connect();
        const db = this.client.db(this.database);
        const files = db.collection(FILES);
        const numfiles = await files.countDocuments();
        return numfiles;
    }
    async userExists(email) {
        // Checks if a user by `email` exists
        await this.client.connect();
        const db = this.client.db(this.database);
        const users = db.collection(USERS);
        const user = await users.findOne({ email });
        if (!user) {
            return false;
        }
        return true;
    }
    async createUser(email, password) {
        // Creates a user by `email` and `password`
        const hashedpwd = createHash("sha1").update(password).digest("hex");
        await this.client.connect();
        const db = this.client.db(this.database);
        const users = db.collection(USERS);
        const data = {email: email, password: hashedpwd};
        const user = await users.insertOne(data);
        return { email, id: user.insertedId };
    }
}

const dbClient = new DBClient();
module.exports = dbClient;
