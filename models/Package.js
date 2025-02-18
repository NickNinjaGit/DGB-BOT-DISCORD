const db = require("../db/conn");
const { DataTypes } = require("sequelize");
const User = require("./User");
const { TimestampStyles } = require("discord.js");

const Package = db.define("package", {
    name: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        required: true,
        allowNull: false,
    },

    pkgType: {
        type: DataTypes.STRING,
        allowNull: false,
        isIn: {
            args: [['basic', 'advanced', 'premium', 'onlyCommon', 'onlyRare', 'onlyEpic', 'onlyLegendary', 'onlyMitic']],
        },
    },
    qty: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

User.hasMany(Package, { foreignKey: "userId" });
Package.belongsTo(User, { foreignKey: "userId" });

module.exports = Package;