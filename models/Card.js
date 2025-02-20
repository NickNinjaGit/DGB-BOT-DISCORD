const db = require("../db/conn");
const { DataTypes } = require("sequelize");
const Skill = require("./Skill");

const Card = db.define("card", {
  name: {
    type: DataTypes.STRING(100),
    required: true,
    allowNull: false,
    unique: "card_name_index",
  },
  description: {
    type: DataTypes.TEXT("medium"),
    required: true,
    allowNull: false,
  },
  universe: {
    type: DataTypes.STRING(100),
    required: true,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING(512),
    required: true,
    allowNull: false,
  },
  imageHash: {
    type: DataTypes.STRING(64),
    required: true,
    allowNull: false,
    unique: "card_image_index",
  },
  rarity: {
    type: DataTypes.STRING,
    allowNull: false,
    isIn: {
      args: [['common', 'rare', 'epic', 'legendary', 'mitic']],
      msg: 'Rarity must be one of: common, rare, epic, legendary, mitic',
    },
    required: true,
  },
  price: {
    type: DataTypes.FLOAT,
    required: true,
    allowNull: false,
  },
  sellValue: {
    type: DataTypes.FLOAT,
    required: true,
    allowNull: false,
  },
  tradable: {
    type: DataTypes.BOOLEAN,
    required: true,
    allowNull: false,
  },
  HP: {
    type: DataTypes.INTEGER,
    required: true,
    allowNull: false,
  },
  MANA: {
    type: DataTypes.INTEGER,
    required: true,
    allowNull: false,
  },
  ATK: {
    type: DataTypes.INTEGER,
    required: true,
    allowNull: false,
  },
  DEF: {
    type: DataTypes.INTEGER,
    required: true,
    allowNull: false,
  },
  SPEED: {
    type: DataTypes.INTEGER,
    required: true,
    allowNull: false,
  },
  SKILL1: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Skill, // Nome do modelo referenciado
      key: "id", // Chave referenciada
    },
  },
  SKILL2: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Skill,
      key: "id",
    },
  },
});

module.exports = Card;
