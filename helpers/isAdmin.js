const User = require('../models/User');


module.exports = async function isAdmin(discordID) {
    const user = await User.findOne({ where: { discordID: discordID, isAdmin: true}});

    if(!user)
    {
        console.log("Não é admin");
        return false;
    }
    else{
        console.log("é admin");
        return true;
    }

    
}