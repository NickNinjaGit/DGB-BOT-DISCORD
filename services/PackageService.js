const Package = require("../models/Package");
const { Op } = require("sequelize");
const CardService = require("./CardService");
const UserCards = require("../models/UserCards");

module.exports = class PackageController {
  static async getPackagesQty(userId) {
    const BasicPacks = await Package.findOne({
      where: { userId: userId, pkgType: "basic" },
    });
    const BasicPackQty = BasicPacks.qty;

    const AdvancedPacks = await Package.findOne({
      where: { userId: userId, pkgType: "advanced" },
    });
    const AdvancedPackQty = AdvancedPacks.qty;

    const PremiumPacks = await Package.findOne({
      where: { userId: userId, pkgType: "premium" },
    });
    const PremiumPackQty = PremiumPacks.qty;

    const onlyCommon = await Package.findOne({
      where: { userId: userId, pkgType: "onlyCommon" },
    });
    const onlyCommonQty = onlyCommon.qty;
    console.log(onlyCommonQty);

    const onlyRare = await Package.findOne({
      where: { userId: userId, pkgType: "onlyRare" },
    });
    const onlyRareQty = onlyRare.qty;

    const onlyEpic = await Package.findOne({
      where: { userId: userId, pkgType: "onlyEpic" },
    });
    const onlyEpicQty = onlyEpic.qty;

    const onlyLegendary = await Package.findOne({
      where: { userId: userId, pkgType: "onlyLegendary" },
    });
    const onlyLegendaryQty = onlyLegendary.qty;

    const onlyMitic = await Package.findOne({
      where: { userId: userId, pkgType: "onlyMitic" },
    });
    const onlyMiticQty = onlyMitic.qty;

    return {
      BasicPackQty,
      AdvancedPackQty,
      PremiumPackQty,
      onlyCommonQty,
      onlyRareQty,
      onlyEpicQty,
      onlyLegendaryQty,
      onlyMiticQty,
    };
  }

  static async getAllPackages(user) {
    const packs = await Package.findAll({ where: { userId: user.id } });
    return packs;
  }

  static async getPackageByName(name) {
    const pack = Package.findOne({
      where: { name: { [Op.like]: `%${name}%` } },
    });
    return pack;
  }
  static async getUserPackages(user, packName) {
    const pack = await Package.findOne({
      where: { userId: user.id, name: { [Op.like]: `%${packName}%` } },
    });
    return pack;
  }
  static async BuyPackage(user, pack, quantity) {
    pack.qty += quantity;
    await pack.save();
    user.wallet -= pack.price * quantity;
    await user.save();
  }

  static async OpenPack(user, packName) {
    const pack = await Package.findOne({
      where: { name: { [Op.like]: `%${packName}%` } },
    });
    if (!pack) {
      throw new Error(`Package with name '${packName}' not found`);
    }
    //give card to user
    const settings = {
      quantityOutput: 0,
      inventoryDelimiter: 0,
      rarityFilters: [],
    };
    if (pack.pkgType === "basic") {
      settings.quantityOutput = 3;
      settings.inventoryDelimiter = 3;
      settings.rarityFilters = ["legendary", "mitic"];
    } else if (pack.pkgType === "advanced") {
      settings.quantityOutput = 5;
      settings.inventoryDelimiter = 5;
      settings.rarityFilters = ["mitic"];
    }
    else if (pack.pkgType === "premium") {
      settings.quantityOutput = 10;
      settings.inventoryDelimiter = 10;
      settings.rarityFilters = [];
    }
    else if (pack.pkgType === "onlyCommon") {
      settings.quantityOutput = 8;
      settings.inventoryDelimiter = 8;
      settings.rarityFilters = ["rare", "epic", "legendary", "mitic"];
    } else if (pack.pkgType === "onlyRare") {
      settings.quantityOutput = 6;
      settings.inventoryDelimiter = 6;
      settings.rarityFilters = ["common", "epic", "legendary", "mitic"];
    } else if (pack.pkgType === "onlyEpic") {
      settings.quantityOutput = 4;
      settings.inventoryDelimiter = 4;
      settings.rarityFilters = ["common", "rare", "legendary", "mitic"];
    } else if (pack.pkgType === "onlyLegendary") {
      settings.quantityOutput = 2;
      settings.inventoryDelimiter = 2;
      settings.rarityFilters = ["common", "rare", "epic", "mitic"];
    } else if (pack.pkgType === "onlyMitic") {
      settings.quantityOutput = 1;
      settings.inventoryDelimiter = 1;
      settings.rarityFilters = ["common", "rare", "epic", "legendary"];
    }

    //  check user can recive cards (example: 12 > 15 - 8, 12 > 7, so true, user cant open this pack)
    if(user.inventory > user.inventoryLimit - settings.inventoryDelimiter) {
      return true;
    }
    pack.qty -= 1;
    await pack.save();
    const generatedCards = await CardService.AddCard(settings.quantityOutput, settings.rarityFilters);
    //for each generated card, give it to user
    for (let i = 0; i < generatedCards.length; i++) {
      // check if user has card in inventory
      const hasCard = await UserCards.findOne({
        where: { userId: user.id, cardId: generatedCards[i].id },
      });
      if (hasCard) {
        hasCard.quantity += 1;
        user.inventory += 1;
        await hasCard.save();
        await user.save();
        continue;
      }
      // if not, associate user with current card data
      await UserCards.create({
        userId: user.id,
        cardId: generatedCards[i].id,
        quantity: 0,
        currentIMG: generatedCards[i].image,
        currentHP: generatedCards[i].HP,
        currentMANA: generatedCards[i].MANA,
        currentATK: generatedCards[i].ATK,
        currentDEF: generatedCards[i].DEF,
        currentSPEED: generatedCards[i].SPEED,
      });
    }
    user.inventory += 1;
    await user.save();
    return generatedCards;
  }

  static async registerPackageSlots(user) {
    await Package.create({
      userId: user.id,
      name: "🏷️📦 Básico",
      price: 50,
      pkgType: "basic",
      qty: 5,
    }); // quantidade de pacotes iniciais
    await Package.create({
      userId: user.id,
      name: "📛📦 Avançado",
      price: 100,
      pkgType: "advanced",
      qty: 1,
    });
    await Package.create({
      userId: user.id,
      name: "💎📦 Premium",
      price: 500,
      pkgType: "premium",
      qty: 0,
    });
    await Package.create({
      userId: user.id,
      name: "🔵📦 Comum",
      price: 1000,
      pkgType: "onlyCommon",
      qty: 0,
    });
    await Package.create({
      userId: user.id,
      name: "🟢📦 Raro",
      price: 2000,
      pkgType: "onlyRare",
      qty: 0,
    });
    await Package.create({
      userId: user.id,
      name: "🟣📦 Épico",
      price: 5000,
      pkgType: "onlyEpic",
      qty: 0,
    });
    await Package.create({
      userId: user.id,
      name: "🟠📦 Lendário",
      price: 7500,
      pkgType: "onlyLegendary",
      qty: 0,
    });
    await Package.create({
      userId: user.id,
      name: "🔴📦 Mítico",
      price: 10000,
      pkgType: "onlyMitic",
      qty: 0,
    });
  }
};
