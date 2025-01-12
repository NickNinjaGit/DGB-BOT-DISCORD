module.exports = async function checkActiveInteractions(discordID, interaction, activeInteractions) {
    if (activeInteractions.has(discordID)) {
        await interaction.reply({
          content: "Você já possui uma interação ativa! Aguarde ou finalize antes de executar novamente.",
        });
        await wait(1000);
        await interaction.deleteReply();
        return true;
    }
}