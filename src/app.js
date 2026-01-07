const express = require('express');
const cors = require('cors');

const app = express();
const sequelize = require('./config/db');

app.use(cors());
app.use(express.json());

// routes
const routes = require('./routes');
console.log(typeof routes);   // should be "function"

app.use('/api', routes);

module.exports = app;   // 🔥 VERY IMPORTANT
