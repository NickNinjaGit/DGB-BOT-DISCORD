const {Sequelize} = require('sequelize');
require('dotenv').config();
const conn = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    password: '',
    database: 'dgbbot_database',
    logging: false,
    define: {
        timestamps: false
    }
});

module.exports = conn;

