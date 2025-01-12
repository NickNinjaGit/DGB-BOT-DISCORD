const Package = require("../models/Package");
const { Op } = require("sequelize");
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
  static async BuyPackage(user, pack, quantity) {
    pack.qty += quantity;
    await pack.save();
    user.wallet -= pack.price * quantity;
    await user.save();
  }

  static async registerPackageSlots(user) {
    await Package.create({
      userId: user.id,
      name: "🏷️📦 Básico",
      price: 100,
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
      price: 100,
      pkgType: "premium",
      qty: 0,
    });
    await Package.create({
      userId: user.id,
      name: "🔵📦 Comum",
      price: 100,
      pkgType: "onlyCommon",
      qty: 0,
    });
    await Package.create({
      userId: user.id,
      name: "🟢📦 Raro",
      price: 100,
      pkgType: "onlyRare",
      qty: 0,
    });
    await Package.create({
      userId: user.id,
      name: "🟣📦 Épico",
      price: 100,
      pkgType: "onlyEpic",
      qty: 0,
    });
    await Package.create({
      userId: user.id,
      name: "🟠📦 Lendário",
      price: 100,
      pkgType: "onlyLegendary",
      qty: 0,
    });
    await Package.create({
      userId: user.id,
      name: "🔴📦 Mítico",
      price: 100,
      pkgType: "onlyMitic",
      qty: 0,
    });
  }
};
