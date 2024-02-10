#!/usr/bin/node
/*
MongoDB utils
*/
const { MongoClient } = require('mongodb');
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
        if (this.client.connected) {
            return true;
        }
        else {
            return false;
        }
    }
    async nbUsers() {
        await this.client.connect();
        const db = this.client.db(this.database);
        const users = db.collection(USERS);
        const numUsers = await users.countDocuments();
        return numUsers;
    }
    async nbFiles() {
        await this.client.connect();
        const db = this.client.db(this.database);
        const files = db.collection(FILES);
        const numfiles = await files.countDocuments();
        return numfiles;
}
}
const dbClient = new DBClient();
module.exports = dbClient;
