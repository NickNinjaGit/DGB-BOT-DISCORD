const {Sequelize} = require('sequelize');
require('dotenv').config();
const conn = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    password: process.env.DBPASSWORD,
    database: 'dgbbot_database',
});

module.exports = conn;

