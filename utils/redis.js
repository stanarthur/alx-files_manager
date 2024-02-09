/*
Redis utils
*/
import { createClient } from "redis";
const util = require("util");

class RedisClient{
    constructor() {
        this.client = createClient();
        this.client.on("error", err => console.log(`Redis connection error: ${err}`))
    }
    isAlive() {
        return this.client.connected;
    }
    async get(key) {
        const asyncGet = util.promisify(this.client.get).bind(this.client);
        const retVal = await asyncGet(key);
        return retVal;
    }
    async set(key, value, duration) {
        const asyncSet = util.promisify(this.client.set).bind(this.client);
        await asyncSet(key, value, "EX", duration);
    }
    async del(key) {
        const asyncDel = util.promisify(this.client.del).bind(this.client);
        await asyncDel(key);
    }
}

const redisClient = new RedisClient();
module.exports = redisClient;
