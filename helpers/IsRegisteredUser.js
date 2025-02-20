const User = require('../models/User');
const PackageController = require('../controllers/PackageController');



module.exports = async function isRegisteredUser(discordID, userName, isAFriend = false) {
    const [user, created] = await User.findOrCreate({
        where: { discordID: discordID },
        defaults: { name: userName }
    });
    if(created && !isAFriend) {
        await PackageController.registerPackageSlots(user);
        return false; // Indica que o usuário foi registrado agora
    }
    return true; // Indica que o usuário já estava registrado
    
};
