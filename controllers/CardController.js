const Card = require('../models/Card');
const {Op} = require("sequelize");
const Skill = require('../models/Skill');
const User = require('../models/User'); 
const UserCards = require('../models/UserCards');

module.exports = class CardController {
    static async getCardByName(name)
    {
        const card = await Card.findOne({where: {name: {[Op.like]: `%${name}%`}}});
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

    static async getUserCards(user) {
        const userCards = await UserCards.findAll({where: {userId: user.id}});

        // get complete info
        const cardList = await Promise.all(
            userCards.map(async (cardInstance) => {
                const card = await Card.findOne({where: {id: cardInstance.cardId}});
                const rarity_info = await CardController.checkRarity(card.rarity);
                let i = 0;
                return {
                    ...userCards[i++].dataValues,
                    ...card.dataValues, // Inclui os campos do card no objeto
                    rarity: rarity_info,
                };
            })
        )
        return cardList;

    }
    static async getCardCollection(userId)
    {
        const user = await User.findOne({where: {discordID: userId}});
        // compare cards that user has with all cards
        const cards = await Card.findAll({
            order: [
                ['id', 'ASC'],
                ['name', 'ASC'],
            ],
        }) 

        const userCards = await UserCards.findAll({where: {userId: user.id}});

        const cardsQty = userCards.length;

        const lastCard = cards[cards.length - 1].id;

        return {cardsQty, lastCard};
        
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

    static async AddCard(discordID, cardName)
    {
        const user = await User.findOne({where: {discordID}});
        const card = await Card.findOne({where: {name: {[Op.like]: `%${cardName}%`}}});
        const hasCard = await UserCards.findOne({where: {userId: user.id, cardId: card.id}});
   
        if(hasCard)
        {
            hasCard.quantity += 1;
            await hasCard.save();
            return;
        }
        const userCard = await UserCards.create({
            userId: user.id,
            cardId: card.id,
            quantity: 1,
            starPoints: 0,
            currentIMG: card.image,
            currentHP: card.HP,
            currentMANA: card.MANA,
            currentATK: card.ATK,
            currentDEF: card.DEF,
            currentSPEED: card.SPEED

        })
        return userCard;

    }
    
}