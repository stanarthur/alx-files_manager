#!/usr/bin/env node
/*
Redis utils
*/
import { createClient } from "redis";
const util = require("util");

class RedisClient{
    constructor() {
        this.client = createClient();
        this.client
        .on("error", err => {
            // For debugging redis connection
            // console.log(`Redis connection error: ${err}`);
            this.client.connected = false;
        })
        .on("connect", () => {
            // For debugging redis connection
            // console.log("Connected to redis server");
            this.client.connected = true;
        });
    }

    isAlive() {
        // Checks if connection to redis server is alive
        if (this.client.connected) {
            return true;
        }
        return false;
    }

    async get(key) {
        // Gets a value associated with a `key` from redis storage/server
        const asyncGet = util.promisify(this.client.get).bind(this.client);
        const retVal = await asyncGet(key);
        return retVal;
    }

    async set(key, value, duration) {
        // Sets a `value` to a `key` for time `duration` on redis storage
        const asyncSet = util.promisify(this.client.set).bind(this.client);
        await asyncSet(key, value, "EX", duration);
    }

    async del(key) {
        // Deletes an existing key from redis server
        const asyncDel = util.promisify(this.client.del).bind(this.client);
        await asyncDel(key);
    }
}

const redisClient = new RedisClient();
module.exports = redisClient;
