module.exports = function generateRandomRarity(RNG) {
    // generate random rarity
    let rarity;
    if (RNG > 0 && RNG <= 600) {
      rarity = "common";
    } else if (RNG > 600 && RNG <= 820) {
      rarity = "rare";
    } else if (RNG > 820 && RNG <= 940) {
      rarity = "epic";
    } else if (RNG > 940 && RNG <= 970) {
      rarity = "legendary";
    } else if (RNG > 970 && RNG <= 1000) {
      rarity = "mitic";
    } else {
      rarity = "Valor inválido";
    }
    return rarity;
}