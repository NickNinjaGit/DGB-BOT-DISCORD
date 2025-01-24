const db = require('../db/conn');
const {DataTypes} = require('sequelize');

const Skill = db.define('skill', {
    name: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
        unique: "skill_name_index",
    },
    description: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
    },
    imageHash: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
        unique: "skill_image_index",
    },
    cost: {
        type: DataTypes.INTEGER,
        required: true,
        allowNull: false,
    },
    SkillType: {
        type: DataTypes.STRING,
        allowNull: false,
        isIn: {
            args: [['DAMAGE', 'HEAL', 'BUFF', 'DEBUFF']],
            msg: 'SkillType must be DAMAGE or HEAL'
        }
    },
    SkillValue: {
        type: DataTypes.INTEGER, // Usado para SkillType DAMAGE e HEAL
        defaultValue: 0,
    },
    StatusChangeType: {
        type: DataTypes.STRING,
        defaultValue: '',
        isIn: {
            args: [['ATK', 'DEF', 'SPEED']], // Usado para SkillType BUFF e DEBUFF
        },
        allowNull: false
    },
    SkillMultiplier: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    acurracy: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    hitTimes: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
});

module.exports = Skill;