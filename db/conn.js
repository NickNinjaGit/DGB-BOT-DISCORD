const {Sequelize} = require('sequelize');

const conn = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    password: '',
    database: 'dgbbot_database',
});

module.exports = conn;

