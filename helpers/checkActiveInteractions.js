module.exports = async function checkActiveInteractions(discordID, interaction, activeInteractions) {
    if (activeInteractions.has(discordID)) {
        await interaction.deferReply({ ephemeral: true });
        await interaction.editReply({
          content: "Você já possui uma interação ativa! Aguarde ou finalize antes de executar novamente.",
        });
        await interaction.deleteReply();
        return true;
    }
}