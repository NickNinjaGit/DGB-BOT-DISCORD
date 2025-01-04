const User = require('../models/User');

// helpers
const registerPackageSlots = require('./registerPackages');

module.exports = async function isRegisteredUser(discordID, userName, isAFriend = false) {
    const user = await User.findOne({ where: { discordID: discordID } });
    if (!user) {
        if (!isAFriend) {
            const user = await User.create({ discordID: discordID, name: userName });
            await registerPackageSlots(user);
            return false; // Indica que o usuário foi registrado agora
        }
        return false; // Indica que o amigo não tem conta e não deve ser registrado
    }
    return true; // Indica que o usuário já possui conta
};
