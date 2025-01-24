const db = require("../db/conn");
const { DataTypes } = require("sequelize");

const User = db.define("user", {
  discordID: {
    type: DataTypes.STRING,
    required: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    required: true,
    allowNull: false,
  },
  wallet: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
  },
  inventory: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  inventoryLimit: {
    type: DataTypes.INTEGER,
    defaultValue: 15,
  },
  BattlesWon: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  BattlesLost: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  BattlesGiveUp: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  IsInBattle: {
    type: DataTypes.BOOLEAN,
    required: true,
    defaultValue: false,
  },
  IsAdmin: {
    type: DataTypes.BOOLEAN,
    required: true,
    defaultValue: false,
  },
});



module.exports = User;
