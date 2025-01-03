const Card = require('../models/Card');
const Skill = require('../models/Skill');
const UserCards = require('../models/UserCards');

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
    static async getAllCards() {
        const cards = await Card.findAll({
            order: [
                ['id', 'ASC'],
                ['name', 'ASC'],
            ],
        });
    
        // Convertendo os resultados para garantir que podemos mapear sobre eles
        const processedCards = await Promise.all(
            cards.map(async (cardInstance) => {
                // cardInstance é o objeto retornado pelo Sequelize, então precisamos acessar o `dataValues`
                const rarity_info = await CardController.checkRarity(cardInstance.rarity);
                return {
                    ...cardInstance.dataValues, // Inclui os campos do card no objeto
                    rarity: rarity_info,
                };
            })
        );
    
        return processedCards;
    }
    
    static async getCardsPerPage(pageId, ItensPerPage, cards) {
        const startIndex = (pageId - 1) * ItensPerPage;
        const endIndex = startIndex + ItensPerPage;
        return cards.slice(startIndex, endIndex); // Retorna um array de itens
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

    static async BuyCard(userId, cardName)
    {
        const card = await Card.findOne({where: {name: cardName}});
        const userCard = await UserCards.create({
            userId: userId,
            cardId: card.id,
            quantity: 1,
            currentHP: card.HP,
            currentATK: card.ATK,
            currentDEF: card.DEF,
            currentSPEED: card.SPEED

        })
        return userCard;

    }
    
}