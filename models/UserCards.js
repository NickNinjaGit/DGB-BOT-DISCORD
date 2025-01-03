const User = require("./User");
const { DataTypes } = require("sequelize");
const db = require("../db/conn");
const Card = require("./Card");

const UserCards = db.define("usercards", {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id",
        }
    },
    cardId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Card,
            key: "id",
        },
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    currentHP: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    currentATK: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    currentDEF: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    currentSPEED: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

User.belongsToMany(Card, { through: UserCards });
Card.belongsToMany(User, { through: UserCards });

module.exports = UserCards;