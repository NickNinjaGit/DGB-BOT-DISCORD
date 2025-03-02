const CardService = require("../../services/CardService");

module.exports = async function checkFirstTurnPlayer(
  cardA,
  cardB,
  turns,
  turnosQty,
  user1,
  user2,
  cardEmbedA,
  cardEmbedB,
  battleButtons,
  thread
) {
  // check if cards have the same speed
  if (cardA.currentSPEED === cardB.currentSPEED) {
    const random = Math.floor(Math.random() * 100);

    // if odd, user1 goes first
    if (random % 2 === 0) {
      const currentAttacker = user1;
      const currentAttackerCard = await CardService.getUserCardByName(
        user1,
        cardA.name
      );
      const currentDefensor = user2;
      const currentDefensorCard = await CardService.getUserCardByName(
        user2,
        cardB.name
      );
      await thread.send({
        embeds: [cardEmbedA],
        components: [battleButtons.actionRow],
      });

      await thread.send({
        content: `# Turno ${turns + 1} de ${turnosQty}, vez de ${user1.name}`,
      });
      await thread.send({
        content: `💨**As cartas ${cardA.name} e ${cardB.name} têm a mesma velocidade. Por decisão do bot, será a vez de ${user1.name}. 💨**`,
      });

      console.log(
        `Turno do usuário: ${currentAttacker.name} (${currentAttacker.discordID})`
      );
      return {
        currentAttacker,
        currentAttackerCard,
        currentDefensor,
        currentDefensorCard,
      };
    }
    // if even, user2 goes first
    else {
      const currentAttacker = user2;
      const currentAttackerCard = await CardService.getUserCardByName(
        user2,
        cardA.name
      );
      const currentDefensor = user1;
      const currentDefensorCard = await CardService.getUserCardByName(
        user1,
        cardB.name
      );
      await thread.send({
        embeds: [cardEmbedB],
        components: [battleButtons.actionRow],
      });

      await thread.send({
        content: `# Turno ${turns + 1} de ${turnosQty}, vez de ${user2.name}`,
      });
      await thread.send({
        content: `💨**As cartas ${cardA.name} e ${cardB.name} têm a mesma velocidade. Por decisão do bot, será a vez de ${user2.name}. 💨**`,
      });

      console.log(
        `Turno do usuário: ${currentAttacker.name} (${currentAttacker.discordID})`
      );
      return {
        currentAttacker,
        currentAttackerCard,
        currentDefensor,
        currentDefensorCard,
      };
    }
  } else {
    const firstPlayer = cardA.currentSPEED > cardB.currentSPEED ? cardA : cardB;
    if (firstPlayer === cardA) {
      const currentAttacker = user1;
      const currentAttackerCard = await CardService.getUserCardByName(
        user1,
        cardA.name
      );
      const currentDefensor = user2;
      const currentDefensorCard = await CardService.getUserCardByName(
        user2,
        cardB.name
      );
      await thread.send({
        embeds: [cardEmbedA],
        components: [battleButtons.actionRow],
      });
      await thread.send({
        content: `💨**${cardA.name} possui maior velocidade.**💨`,
      });
      await thread.send({
        content: `# Turno ${turns + 1} de ${turnosQty} vez de @${user1.name}`,
      });

      return {
        currentAttacker,
        currentAttackerCard,
        currentDefensor,
        currentDefensorCard,
      };
    } else if (firstPlayer === cardB) {
      const currentAttacker = user2;
      const currentAttackerCard = await CardService.getUserCardByName(
        user2,
        cardB.name
      );
      const currentDefensor = user1;
      const currentDefensorCard = await CardService.getUserCardByName(
        user1,
        cardA.name
      );
      await thread.send({
        embeds: [cardEmbedB],
        components: [battleButtons.actionRow],
      });
      await thread.send({
        content: `💨**${user2.name} possui maior velocidade.**💨`,
      });
      await thread.send({
        content: `# Turno ${turns + 1} de ${turnosQty} vez de @${user2.name}`,
      });

      return {
        currentAttacker,
        currentAttackerCard,
        currentDefensor,
        currentDefensorCard,
      };
    }
  }
};
