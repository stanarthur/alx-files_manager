#!/usr/bin/env node

const { createHash } = require('node:crypto');

const passwordHasher = function(password) {
    // Creates and returns a hashed value with `sha1` hash algorithm
    const hash = createHash("sha1");
    const hashedPwd = hash.update(password).digest("base64");
    return hashedPwd;
}

module.exports = passwordHasher;
