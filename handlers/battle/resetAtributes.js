const CardService = require("../../services/CardService");

module.exports = function resetAtributes(cardA, cardB) {
    // reseting card A
    const updatedDataA = {
        currentHP: cardA.HP,
        currentMANA: cardA.MANA,
        currentATK: cardA.ATK,
        currentDEF: cardA.DEF,
        currentSPEED: cardA.SPEED,
    };
    CardService.saveUserCardChanges(cardA.userId, cardA.cardId, updatedDataA);
    // reseting card B
    const updatedDataB = {
        currentHP: cardB.HP,
        currentMANA: cardB.MANA,
        currentATK: cardB.ATK,
        currentDEF: cardB.DEF,
        currentSPEED: cardB.SPEED,
    };
    CardService.saveUserCardChanges(cardB.userId, cardB.cardId, updatedDataB);
}