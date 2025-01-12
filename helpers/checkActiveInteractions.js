const wait = require("node:timers/promises").setTimeout;
module.exports = async function checkActiveInteractions(discordID, interaction, activeInteractions) {
    if (activeInteractions.has(discordID)) {
        await interaction.reply({
            content: "Você já possui uma interação ativa! Aguarde ou finalize antes de executar novamente.",
        });
        await wait(1000);
        interaction.deleteReply();
        return true;
    } else {
        activeInteractions.add(discordID);
        return false;
    }

  
}