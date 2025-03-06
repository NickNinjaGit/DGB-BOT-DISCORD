const ButtonView = require("../../views/ButtonView");
const collectorTimer = 600000;
async function BattleAttackerCollector(
  thread,
  currentAttacker,
  defensorName,
  user1,
  cardEmbedA,
  cardEmbedB
) {
  // calculate what embed need to show when user cancel action
  let attackerEmbed = undefined;

  currentAttacker === user1
    ? (attackerEmbed = cardEmbedA)
    : (attackerEmbed = cardEmbedB);

  return new Promise((resolve) => {
    const collector = thread.createMessageComponentCollector({
      filter: (i) => i.user.id === currentAttacker.discordID,
      time: collectorTimer, // 10 min para responder
    });
    let choosedAction = null;
    let alreadyCanceled = false;
    let confirmed = false;
    collector.on("collect", async (interaction) => {
      if (
        !interaction.customId.startsWith("confirm") &&
        !interaction.customId.startsWith("cancel")
      ) {
        // Se for um botão de ação (ataque, defesa, etc.), armazena a escolha no estado do coletor
        choosedAction = interaction.customId;
      }
      if (interaction.customId === "forfeit") {
        resolve(defensorName);
        return;
      }
      const battleButtons = await ButtonView.BattleButtons();
      const confirmButton = battleButtons.confirmActionRow;
      const cancelButton = battleButtons.cancelActionRow;
      //chamar botão de confimação
      if (confirmed) {
        await interaction.update({
          content: `# Ação confirmada!`,
          embeds: [attackerEmbed],
          components: [],
        });
        return;
      }
      if (alreadyCanceled) {
        await interaction.update({
          content: `# Deseja confimar ação?`,
          embeds: [attackerEmbed],
          components: [confirmButton],
        });
      } else {
        await interaction.update({
          content: `# Deseja confimar ação?`,
          embeds: [attackerEmbed],
          components: [confirmButton, cancelButton],
        });
      }
      let interactionID = interaction.message.id;
      // criar uma função para lidar com a confirmação
      const confirmCollector = thread.createMessageComponentCollector({
        filter: (i) => i.user.id === currentAttacker.discordID,
        time: collectorTimer, // 10 min para responder
      });

      confirmCollector.on("collect", async (i) => {
        if (i.customId === "confirm") {
          resolve(choosedAction);
          confirmCollector.stop();
          collector.stop();
          alreadyCanceled = false;
          confirmed = true;
        } else if (i.customId === "cancel") {
          console.log(interaction);
          // get interaction by id
          await thread.messages
            .fetch(interactionID, { force: true })
            .then((msg) => msg.delete())
            .catch(console.error);
          await interaction.followUp({
            content: `# Ação cancelada!`,
            embeds: [attackerEmbed],
            components: [battleButtons.actionRow],
          });
          alreadyCanceled = true;
          confirmed = false;
          confirmCollector.stop();
        }
      });
    });

    collector.on("end", (collected, reason) => {
      if (reason === "time") {
        resolve("AfkAttacker");
      }
    });
  });
}

async function BattleDefensorCollector(
  thread,
  currentDefender,
  attackerName,
  user1,
  cardEmbedA,
  cardEmbedB
) {
  let defensorEmbed = undefined;
  currentDefender === user1
    ? (defensorEmbed = cardEmbedA)
    : (defensorEmbed = cardEmbedB);
  battleButtons = await ButtonView.BattleButtons();
  await thread.send({
    content: `---------------------------------------`,
  });
  await thread.send({
    content: `---------------------------------------`,
  });
  await thread.send({
    embeds: [defensorEmbed],
    components: [battleButtons.actionRow],
  });
  await thread.send({
    content: `# Vez de ${currentDefender.name}`,
  });
  return new Promise((resolve) => {
    const collector = thread.createMessageComponentCollector({
      filter: (i) => i.user.id === currentDefender.discordID,
      time: collectorTimer, // 10 min para responder
    });

    let choosedAction = null;
    let alreadyCanceled = false;
    let confirmed = false;
    collector.on("collect", async (interaction) => {
      if (
        !interaction.customId.startsWith("confirm") &&
        !interaction.customId.startsWith("cancel")
      ) {
        // Se for um botão de ação (ataque, defesa, etc.), armazena a escolha no estado do coletor
        choosedAction = interaction.customId;
      }
      if (interaction.customId === "forfeit") {
        resolve(attackerName);
        return;
      }
      const battleButtons = await ButtonView.BattleButtons();
      const confirmButton = battleButtons.confirmActionRow;
      const cancelButton = battleButtons.cancelActionRow;
      //chamar botão de confimação
      if (confirmed) {
        await interaction.update({
          content: `# Ação confirmada!`,
          embeds: [defensorEmbed],
          components: [],
        });
        await thread.send({
          content: `---------------------------------------`,
        });
        await thread.send({
          content: `---------------------------------------`,
        });
        resolve(choosedAction);
        return;
      }
      if (alreadyCanceled) {
        await interaction.update({
          content: `# Deseja confimar ação?`,
          embeds: [defensorEmbed],
          components: [confirmButton],
        });
        return;
      } else {
        await interaction.update({
          content: `# Deseja confimar ação?`,
          embeds: [defensorEmbed],
          components: [confirmButton, cancelButton],
        });
      }
      let interactionID = interaction.message.id;
      // criar uma função para lidar com a confirmação
      const confirmCollector = thread.createMessageComponentCollector({
        filter: (i) => i.user.id === currentDefender.discordID,
        time: collectorTimer, // 10 min para responder
      });

      confirmCollector.on("collect", async (i) => {
        if (i.customId === "confirm") {
          confirmCollector.stop();
          collector.stop();
          confirmed = true;
          alreadyCanceled = false;
        }
        if (i.customId === "cancel") {
          await thread.messages
            .fetch(interactionID, { force: true })
            .then((msg) => msg.delete())
            .catch(console.error);
          await interaction.followUp({
            content: `# Ação cancelada!`,
            embeds: [defensorEmbed],
            components: [battleButtons.actionRow],
          });
          confirmed = false;
          alreadyCanceled = true;
          confirmCollector.stop();
        }
      });
    });

    collector.on("end", (collected, reason) => {
      if (reason === "time") {
        resolve("AfkDefensor");
      }
    });
  });
}

module.exports = { BattleAttackerCollector, BattleDefensorCollector };
