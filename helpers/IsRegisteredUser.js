const User = require('../models/User');

adm_list = ['nickninjagames']

module.exports = async function isRegisteredUser(discordID, userName) {
    const user = await User.findOne({ where: { discordID: discordID}});
    if (!user)
    {
        await User.create({discordID: discordID, name: userName});
        // Se não houver conta, usa esse false para criar uma mensagem de boas vindas
        return false;
    }
    // faça nada se retornar true
    return true;
}