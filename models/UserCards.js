const User = require("./User");
const Card = require("./Card");
const { DataTypes } = require("sequelize");
const db = require("../db/conn");

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
        defaultValue: Card.HP,
    },
    currentATK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: Card.ATK,
    },
    currentDEF: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: Card.DEF,
    },
    currentSPEED: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: Card.SPEED,
    },
});

User.belongsToMany(Card, { through: UserCards });
Card.belongsToMany(User, { through: UserCards });

module.exports = UserCards;