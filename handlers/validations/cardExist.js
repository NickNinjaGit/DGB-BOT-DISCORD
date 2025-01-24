const wait = require("node:timers/promises").setTimeout;

module.exports = async function cardExist(card, interaction) {
    if (!card) {
        await interaction.reply({
          content: "Card não encontrado!",
        });
        await wait(1000);
        interaction.deleteReply();

        return true;
    }
}