#!/usr/bin/env node
/*
First API
*/
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const router = require("./routes/index");

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(router);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
