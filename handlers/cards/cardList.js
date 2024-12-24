const skillList = require('../skills/skillList');
const createCard  = require('./createCard');
async function loadCardCollection() {
    const { fireBlast, taunt } = await skillList();
    const fireDragon = await createCard(
        "Fire Dragon", // Name
        "A fire dragon", // Description
        false, // Is Gif
        "https://static.wikia.nocookie.net/cuphead7697/images/b/be/Grim_match_na_primeira_fase_%27O%27.png/revision/latest?cb=20180106011657&path-prefix=pt-br", // Image
        "common", // Rarity
        150, // Price
        100, // SellValue
        true, // Tradable
        500, // HP
        100, // MANA
        50, // ATK
        200, // DEF
        30, // SPEED
        fireBlast.id, // SKILL1
        taunt.id // SKILL2
    );
    return { fireDragon }
}

module.exports = loadCardCollection;