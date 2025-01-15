// interaction list
const adminInteractions = require("./adminInteractions");
const userInteractions = require("./userInteractions");
const cardInteractions = require("./cardInteractions");
// helpers
const IsRegisteredUser = require("../../helpers/IsRegisteredUser");
const wait = require("node:timers/promises").setTimeout;

//active interactions
const activeInteractions = new Set();
async function handleInteraction(interaction) {

  const commandName = interaction.commandName;

  if (!interaction.isChatInputCommand()) return;

  try {
    // Verificar se o usuário está registrado
    const userRegistered = await IsRegisteredUser(
      interaction.user.id,
      interaction.user.username
    );
    if (!userRegistered) {
      // Defer reply para evitar timeout
      await interaction.deferReply({ ephemeral: true });
      await interaction.editReply({
        content:
          "Boas-vindas ao Gacha Battle Bot! Sua conta foi criada com sucesso!",
      });
      await wait(1000);
      await interaction.deleteReply();
      return;
    }

    // Slash commands interactions
    switch (commandName) {
      // user relational commands
      case "my-profile":
        await userInteractions.myProfile(interaction, activeInteractions);
        break;
      case "friend-profile":
        await userInteractions.friendProfile(interaction);
        break;
      case "work":
        await userInteractions.Work(interaction);
        break;
      case "daily":
        await userInteractions.Daily(interaction);
        break;
      case "shop":
        await userInteractions.Shop(interaction, activeInteractions);
        break;
      case "b-card":
        await cardInteractions.BuyCard(interaction);
        break;
      case "s-card":
        await cardInteractions.SellCard(interaction);
        break;
      case "b-pack":
        await cardInteractions.BuyPack(interaction);
        break;
      
      // card relational commands
      case "f-card":
      await cardInteractions.findCard(interaction, activeInteractions);
        break;
      case "my-cards":
      await cardInteractions.MyCards(interaction, activeInteractions);
        break;
      case "o-pack":
      await cardInteractions.OpenPack(interaction);
        break;
      case 'collection':
      await cardInteractions.Collection(interaction, activeInteractions);
        break;
      // admin relational commands
      case "add-cash":
      await adminInteractions.addCash(interaction);
        break;
      case "remove-cash":
        await adminInteractions.removeCash(interaction);
        break;
    } 
  } catch (error) {
    console.error("Erro ao processar a interação:", error);

    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({
        content: "Ocorreu um erro ao processar sua interação.",
        ephemeral: true,
      });
    }
  }
}

module.exports = handleInteraction;
