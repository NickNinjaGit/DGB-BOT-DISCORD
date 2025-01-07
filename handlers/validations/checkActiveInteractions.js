module.exports = async function checkActiveInteractions(userId, activeInteractions) {
    if (activeInteractions.has(userId)) {
        await interaction.reply({
          content: "Você já possui uma interação ativa! Aguarde ou finalize antes de executar novamente.",
        });
        await wait(1000);
        interaction.deleteReply();
        return;
      }
    }