const loadSkills = require('../skills/skill-handler');
const fs = require('fs');
const path = require('path');
const createCard  = require('./createCard');

// Skill model
const Skill = require('../../models/Skill');

async function loadCards() {
    
    const file = fs.readFileSync(path.resolve(__dirname, "./cards.json"));
    const cardsData = JSON.parse(file);
    const cards = [];
    await loadSkills();
    for (const cardData of cardsData) {
        const SKILL1 = await Skill.findOne({ where: { name: cardData.SKILL1 } });
        const SKILL2 = await Skill.findOne({ where: { name: cardData.SKILL2 } });
        const card = await createCard(
            cardData.name,
            cardData.description,
            cardData.universe,
            cardData.isGif,
            cardData.image,
            cardData.rarity,
            cardData.price,
            cardData.sellValue,
            cardData.tradable,
            cardData.HP,
            cardData.MANA,
            cardData.ATK,
            cardData.DEF,
            cardData.SPEED,
            SKILL1.id,
            SKILL2.id
        );
        cards.push(card);
    }

    return cards;
   
}

module.exports = loadCards;