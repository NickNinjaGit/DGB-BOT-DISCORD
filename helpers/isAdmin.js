const User = require('../models/User');


module.exports = async function isAdmin(discordID) {
    const user = await User.findOne({ where: { discordID: discordID, isAdmin: true}});
    !user ? false : true
}