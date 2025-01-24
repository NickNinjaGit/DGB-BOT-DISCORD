module.exports = async function userHasCards(cardList, interaction, activeInteractions, discordID) {
    if (cardList.length === 0) {
        await interaction.reply({
          content:
            "Parece que você não possui nenhuma carta... **Abra pacotes ou use /b-card para comprar alguma!**",
        });
        await wait(3000);
        interaction.deleteReply();
        activeInteractions.delete(discordID);
        return;
    }
}