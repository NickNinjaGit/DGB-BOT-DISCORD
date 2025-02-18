const {Sequelize} = require('sequelize');
require('dotenv').config();
const conn = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    password: process.env.DB_PASSWORD,
    database: 'dgbbot_database',
    logging: false
});

module.exports = conn;

