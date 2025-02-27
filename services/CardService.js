const Card = require("../models/Card");
const { Op, Sequelize } = require("sequelize");
const Skill = require("../models/Skill");
const User = require("../models/User");
const UserCards = require("../models/UserCards");

// helpers
const generateRandomRarity = require("../helpers/generateRandomRarity");

module.exports = class CardController {
  static async checkRarity(rarity) {
    const COMMON = "common";
    const RARE = "rare";
    const EPIC = "epic";
    const LEGENDARY = "legendary";
    const MYTHIC = "mythic";
    return rarity === COMMON
      ? { name: "Comum⠀🔵", color: 0x0f4da3 }
      : rarity === RARE
      ? { name: "Raro⠀🟢", color: 0x32e656 }
      : rarity === EPIC
      ? { name: "Épico⠀🟣", color: 0x8f32e6 }
      : rarity === LEGENDARY
      ? { name: "Lendário⠀🟠", color: 0xed6905 }
      : rarity === MYTHIC
      ? { name: "Mítico⠀🔴", color: 0xd41c1c }
      : "Não definida";
  }

  static async checkStardomTier(userCard)
  {
    const starPoints = userCard.starPoints;
    const stardomTier = userCard.stardomTier;
    if(starPoints >= 10 && starPoints <= 49)
    {
      userCard.stardomTier = "Bronze⠀🧡";
      userCard.save();
    }
    if(starPoints >= 50 && starPoints <= 99)
    {
      userCard.stardomTier = "Prata⠀🤍";
      userCard.save();
    }
    if(starPoints >= 100 && starPoints <= 199)
    {
      userCard.stardomTier = "Ouro⠀💛";
      userCard.save();
    }
    if(starPoints >= 200)
    {
      userCard.stardomTier = "Ascendente⠀💜";
      userCard.save();
    }

    return stardomTier;
  }
  static async ChangeStardomImage(userCard, card, url_changer)
  {
    const startURL = card.image.slice(0, 89);
    const endURL = card.image.slice(90, userCard.currentIMG.length);
    const updatedImage = startURL + url_changer + endURL;
    userCard.currentIMG = updatedImage;
    await userCard.save();
    return updatedImage;
  }
  static async getCardByName(name) {
    const card = await Card.findOne({
      where: { name: { [Op.like]: `%${name}%` } },
    });
    if (!card) return null;

    const skill1 = await Skill.findOne({ where: { id: card.SKILL1 } });
    const skill2 = await Skill.findOne({ where: { id: card.SKILL2 } });

    const rarity_info = await CardController.checkRarity(card.rarity);
    return {
      ...card.dataValues, // Inclui os campos do card no objeto
      rarity: rarity_info,
      skill1: skill1 ? skill1.dataValues : null, // Inclui os campos da skill1 no objeto
      skill2: skill2 ? skill2.dataValues : null, // Inclui os campos da skill2 no objeto
    };
  }
  static async getUserCardByName(user, name)
  {
    const card = await Card.findOne({ where: { name: name } });
    if(!card) return null;
    const userCard = await UserCards.findOne({ where: { userId: user.id, cardId: card.id } });
    if(!userCard) return null;

    const rarity_info = await CardController.checkRarity(card.rarity);
    const skill1 = await Skill.findOne({ where: { id: card.SKILL1 } });
    const skill2 = await Skill.findOne({ where: { id: card.SKILL2 } });

    return {
      name: card.name,
      description: card.description,
      HP: card.HP,
      MANA: card.MANA,
      ...userCard.dataValues, // Inclui os campos do card no objeto
      rarity: rarity_info,
      skill1: skill1 ? skill1.dataValues : null, // Inclui os campos da skill1 no objeto
      skill2: skill2 ? skill2.dataValues : null, // Inclui os campos da skill2 no objeto
    };
  }
  static async saveUserCardChanges(userId, cardId, updatedData)
  {
    const userCard = await UserCards.findOne({ where: { userId, cardId } });

    await userCard.update(updatedData);
    await userCard.save();
  }
  static async getAllCards() {
    const cards = await Card.findAll({
      order: [
        ["id", "ASC"],
        ["name", "ASC"],
      ],
    });

    // Convertendo os resultados para garantir que podemos mapear sobre eles
    const processedCards = await Promise.all(
      cards.map(async (cardInstance) => {
        // cardInstance é o objeto retornado pelo Sequelize, então precisamos acessar o `dataValues`
        const skill1 = await Skill.findOne({
          where: { id: cardInstance.SKILL1 },
        });
        const skill2 = await Skill.findOne({
          where: { id: cardInstance.SKILL2 },
        });
        const rarity_info = await CardController.checkRarity(
          cardInstance.rarity
        );
        return {
          ...cardInstance.dataValues, // Inclui os campos do card no objeto
          rarity: rarity_info,
          skill1: skill1 ? skill1.dataValues : null, // Inclui os campos da skill1 no objeto
          skill2: skill2 ? skill2.dataValues : null, // Inclui os campos da skill2 no objeto
        };
      })
    );

    return processedCards;
  }

  static async getUserCards(user) {
    const userCards = await UserCards.findAll({ where: { userId: user.id } });

    // get complete info
    const cardList = await Promise.all(
      userCards.map(async (userCard) => {
        const card = await Card.findOne({ where: { id: userCard.cardId } });
        const rarity_info = await CardController.checkRarity(card.rarity);
        return {
          ...userCard.dataValues,
          ...card.dataValues, // Inclui os campos do card no objeto
          rarity: rarity_info,
        };
      })
    );
    return cardList;
  }

  static async getUserCardsListed(userId) {
    const user = await User.findOne({ where: { discordID: userId } });
    // compare cards that user has with all cards
    const cards = await Card.findAll({
      order: [
        ["id", "ASC"],
        ["name", "ASC"],
      ],
    });

    const userCards = await UserCards.findAll({ where: { userId: user.id } });

    const cardsQty = userCards.length;

    const lastCard = cards[cards.length - 1].id;

    return { cardsQty, lastCard };
  }

  static async BuyCard(discordID, cardName) {
    const user = await User.findOne({ where: { discordID } });
    const card = await Card.findOne({
      where: { name: { [Op.like]: `%${cardName}%` } },
    });
    const hasCard = await UserCards.findOne({
      where: { userId: user.id, cardId: card.id },
    });

    if (hasCard) {
      hasCard.quantity += 1;
      await hasCard.save();
      return;
    }
    const userCard = await UserCards.create({
      userId: user.id,
      cardId: card.id,
      quantity: 0,
      starPoints: 0,
      stardomTier: "N/A",
      currentIMG: card.image,
      currentHP: card.HP,
      currentMANA: card.MANA,
      currentATK: card.ATK,
      currentDEF: card.DEF,
      currentSPEED: card.SPEED,
    });
    return userCard;
  }
  static async AddCard(x, pkgfilters = []) {
    // defining some variables to generate random cards
    const min = 1;
    const max = 1000;
    const generatedCards = [];
    // for each generated card, generate random rarity and check if rarity is include on pkgfilters
    for (let i = 0; i < x; i++) {
      const RNG = Math.floor(Math.random() * (max - min + 1) + min);
      let rarity = generateRandomRarity(RNG);
      // check if rarity is include on pkgfilters
      if (pkgfilters.includes(rarity)) {
        continue;
      }
      // qyery all cards with the same generated rarity
      let cardList = await Card.findAll({ where: { rarity } });
      if (cardList.length === 0) {
        console.log(`Nenhuma carta encontrada para a raridade ${rarity}`);
        continue; // Pule essa iteração
      }
      // get random card where rarity is the same
      const cardData = await Card.findOne({
        order: [Sequelize.fn("RAND")],
        where: { rarity },
        raw: true,
      });
      // get skill1 and skill2 info to include on card object
      const skill1 = await Skill.findOne({ where: { id: cardData.SKILL1 } });
      const skill2 = await Skill.findOne({ where: { id: cardData.SKILL2 } });
      // rarity info object for include detailed rarity to user
      const rarity_info = await CardController.checkRarity(cardData.rarity);

      // create card object
      const card = {
        id: cardData.id,
        name: cardData.name,
        description: cardData.description,
        image: cardData.image,
        price: cardData.price,
        sellValue: cardData.sellValue,
        rarity: cardData.rarity,
        universe: cardData.universe,
        HP: cardData.HP,
        MANA: cardData.MANA,
        ATK: cardData.ATK,
        DEF: cardData.DEF,
        SPEED: cardData.SPEED,
        rarity: rarity_info,
        skill1: skill1 ? skill1.dataValues : null, // Inclui os campos da skill1 no objeto
        skill2: skill2 ? skill2.dataValues : null, // Inclui os campos da skill2 no objeto
      };

      // push card to generatedCards array
      generatedCards.push(card);
    }
    return generatedCards;
  }

  static async SellCard(discordID, cardName, quantity) {
    const user = await User.findOne({ where: { discordID } });
    const card = await Card.findOne({ where: { name: { [Op.like]: `%${cardName}%` }}, });
    const hasCard = await UserCards.findOne({
      where: { userId: user.id, cardId: card.id },
    });
    for (let i = 0; i < quantity; i++) {
      if (hasCard.quantity > 1) {
        hasCard.quantity -= 1;
        user.inventory = user.inventory - 1;
        user.wallet = user.wallet + card.price;

        await hasCard.save();
      }
    }
    await user.save();
  }
};
