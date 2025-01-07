module.exports = async function cardExist(card, activeInteractions={}, interaction, userId) {
    if (!card) {
        await interaction.reply({
          content: "Card não encontrado!",
        });
        await wait(1000);
        interaction.deleteReply();
        if(activeInteractions !== null)
        {
          activeInteractions.delete(userId);
        }
        return;
    }
}