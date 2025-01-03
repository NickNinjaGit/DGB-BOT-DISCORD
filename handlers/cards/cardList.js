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
    const luffy = await createCard(
        "Luffy", // Name
        "Luffy from One Piece", // Description
        false, // Is Gif
        "https://static.wikia.nocookie.net/onepiece/images/6/6d/Monkey_D._Luffy_Anime_Post_Timeskip_Infobox.png/revision/latest?cb=20190303115209&path-prefix=pt", // Image
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
    )
    const zoro = await createCard(
        "Zoro", // Name
        "Zoro from One Piece", // Description
        false, // Is Gif
        "https://uploads.jovemnerd.com.br/wp-content/uploads/2024/02/zoro_one_piece__122h6r.jpg?ims=filters:quality(75)", // Image
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
    )
    const nami = await createCard(
        "Nami", // Name
        "Nami from One Piece", // Description
        false, // Is Gif
        "https://sm.ign.com/t/ign_br/screenshot/default/blob_z8c5.1080.jpg", // Image
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
    )
    const usopp = await createCard(
        "Usopp", // Name
        "Usopp from One Piece", // Description
        false, // Is Gif
        "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSf35B11hVkGdkjRUmeXYqlbr0ZqjLWgDZJJ5HBVuuHFsy9Q98kMEY8Qmi4RLEyMKRXrKNXhpap5ql6VKWl_OrbMIuhpw4DNoMmsM03hg", // Image
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
    )
    const franky = await createCard(
        "Franky", // Name
        "Franky from One Piece", // Description
        false, // Is Gif
        "https://static.wikia.nocookie.net/one-piece-br/images/2/2a/Franky2.jpg/revision/latest?cb=20140329175611&path-prefix=pt", // Image
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
    )
    return { fireDragon, luffy, zoro, nami, usopp, franky };
}

module.exports = loadCardCollection;