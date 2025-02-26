const ButtonController = require("../controllers/ButtonController");

async function BattleAttackerCollector(thread, currentAttacker) {
  return new Promise((resolve, reject) => {
    const collector = thread.createMessageComponentCollector({
      filter: (i) => i.user.id === currentAttacker.discordID,
      time: 600000, // 10 min para responder
    });

    collector.on("collect", async (interaction) => {
      console.log("Ação do Atacante: " + interaction.customId);
      const choosedAction = interaction.customId;

      if (choosedAction === "attack") {
        await interaction.update({
          content: "# Teste ataque",
          components: [],
          ephemeral: true, // Torna a resposta visível apenas para o usuário
        });
        await interaction.deleteReply();
        resolve(choosedAction);
        collector.stop();
      }
    });

    collector.on("end", (collected, reason) => {
      if (reason === "time") {
        console.log(`⏳ Tempo esgotado para ${currentAttacker.name}`);
        thread.send({
          content: `⚠️ ${currentAttacker.name} não respondeu a tempo!`,
        });
        resolve(null);
      }
    });
  });
}

async function BattleDefenderCollector(thread, currentDefender, user1, cardEmbedA, cardEmbedB) {
  let defensorEmbed = undefined;
  currentDefender === user1 ? defensorEmbed = cardEmbedA : defensorEmbed = cardEmbedB;
  battleButtons = await ButtonController.BattleButtons();
  await thread.send({
    embeds: [defensorEmbed],
    components: [battleButtons],
  });
  await thread.send({
    content: `# Vez de ${currentDefender.name}`,
  });
  return new Promise((resolve, reject) => {
    const collector = thread.createMessageComponentCollector({
      filter: (i) => i.user.id === currentDefender.discordID,
      time: 600000, // 10 min para responder
    });

    

    collector.on("collect", async (interaction) => {
      console.log(`Ação do Defensor: ${interaction.customId}`);
      const choosedAction = interaction.customId;

      if (choosedAction === "attack") {
        await interaction.update({
          content: `# Teste ataque`,
          components: [],
          ephemeral: true,
        });
        await interaction.deleteReply();
        resolve(choosedAction);
        collector.stop();
      }
    });

    collector.on("end", (collected, reason) => {
      if (reason === "time") {
        console.log(`⏳ Tempo esgotado para ${currentDefender.name}`);
        thread.send({
          content: `⚠️ ${currentDefender.name} não respondeu a tempo!`,
        });
        resolve(null); // Isso garante que a Promise sempre será resolvida
      }
    });
  });
}

module.exports = { BattleAttackerCollector, BattleDefenderCollector };
