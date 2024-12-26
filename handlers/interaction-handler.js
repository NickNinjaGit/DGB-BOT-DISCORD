const {Client, Events, GatewayIntentBits, SlashCommandBuilder, Message } = require("discord.js");

// controllers
const EmbedController = require("../controllers/EmbedController");
const ButtonController = require("../controllers/ButtonController");
const CardController = require("../controllers/CardController");
// helpers
const IsRegisteredUser = require("../helpers/IsRegisteredUser");
const { IsAdmin } = require("../helpers/isAdmin");

// interaction list
const interactionList = require("../handlers/interaction/interactionList");
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
      return;
    }

    // Slash commands interactions
    switch (commandName) {
      // my-profile command
      case "my-profile":
        await interactionList.myProfile(interaction);
        break;
      // friend-profile command
      case "friend-profile":
        await interactionList.friendProfile(interaction);
        break;
      case "f-card":
      await interactionList.findCard(interaction);
        break;
      case "test":
      await interactionList.testAdmin(interaction);
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
