const Card = require('../models/Card');
const Skill = require('../models/Skill');


module.exports = class CardController {
    static async getCardByName(name)
    {
        const card = await Card.findOne({where: {name}})
        if (!card) return null;
        

        const skill1 = await Skill.findOne({where: {id: card.SKILL1}});
        const skill2 = await Skill.findOne({where: {id: card.SKILL2}});
        
        const rarity_info = await CardController.checkRarity(card.rarity);
        console.log(`Card retornada: ${card}`);
        return {
            ...card.dataValues, // Inclui os campos do card no objeto
            rarity: rarity_info,
            skill1: skill1 ? skill1.dataValues : null, // Inclui os campos da skill1 no objeto
            skill2: skill2 ? skill2.dataValues : null, // Inclui os campos da skill2 no objeto
        };
    }

    static async checkRarity(rarity)
    {
        const COMMON = "common";
        const RARE = "rare";
        const EPIC = "epic";
        const LEGENDARY = "legendary";
        const MYTHIC = "mythic";
        return rarity === COMMON ? {name: "Comum⠀🔵", color: 0x0f4da3} : 
        rarity === RARE ? {name: 'Raro⠀🟢', color: 0x32e656} : 
        rarity === EPIC ? {name: 'Épico⠀🟣', color: 0x8f32e6}: 
        rarity === LEGENDARY ? {name: 'Lendário⠀🟠', color: 0xed6905} : 
        rarity === MYTHIC ? {name: 'Mítico⠀🔴', color: 0xd41c1c} : 
        'Não definida';
    }
    
}