const Package = require("../models/Package");
const User = require("../models/User");
const {Op} = require("sequelize");
module.exports = class PackageController {

    static async getPackagesQty(userId)
    {
        const BasicPacks = await Package.findOne({where: {userId: userId, pkgType: 'basic'}});
        const BasicPackQty = BasicPacks.qty;

        const AdvancedPacks = await Package.findOne({where: {userId: userId, pkgType: 'advanced'}});
        const AdvancedPackQty = AdvancedPacks.qty;

        const PremiumPacks = await Package.findOne({where: {userId: userId, pkgType: 'premium'}});
        const PremiumPackQty = PremiumPacks.qty;

        const onlyCommon = await Package.findOne({where: {userId: userId, pkgType: 'onlyCommon'}});
        const onlyCommonQty = onlyCommon.qty;
        console.log(onlyCommonQty);

        const onlyRare = await Package.findOne({where: {userId: userId, pkgType: 'onlyRare'}});
        const onlyRareQty = onlyRare.qty;

        const onlyEpic = await Package.findOne({where: {userId: userId, pkgType: 'onlyEpic'}});
        const onlyEpicQty = onlyEpic.qty;

        const onlyLegendary = await Package.findOne({where: {userId: userId, pkgType: 'onlyLegendary'}});
        const onlyLegendaryQty = onlyLegendary.qty;

        const onlyMitic = await Package.findOne({where: {userId: userId, pkgType: 'onlyMitic'}});
        const onlyMiticQty = onlyMitic.qty;
       
        return  {BasicPackQty, AdvancedPackQty, PremiumPackQty, onlyCommonQty, onlyRareQty, onlyEpicQty, onlyLegendaryQty, onlyMiticQty};
    }
    static async getAllPackages(discordID)
    {
        const user = await User.findOne({where: {discordID}});
        const packs = await Package.findAll({where: {userId: user.id}}); 
        return packs;
    }
    static async getPackageByName(name)
    {
        const packageList = Package.findOne({where: {name: {[Op.like]: `%${name}%`}}});
        return packageList;
    }
    static async BuyPackage(user, pack, quantity)
    {
        pack.qty += quantity;
        await pack.save();
        user.wallet -= pack.price * quantity;
        await user.save();
    }
 }
