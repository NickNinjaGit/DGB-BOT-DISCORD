const {
  Client,
  Events,
  GatewayIntentBits,
  SlashCommandBuilder,
} = require("discord.js");

// controllers
const EmbedController = require("../controllers/EmbedController");
const ButtonController = require("../controllers/ButtonController");
const CardController = require("../controllers/CardController");
// helpers
const IsRegisteredUser = require("../helpers/IsRegisteredUser");
const { IsAdmin } = require("../helpers/isAdmin");
async function handleInteraction(interaction) {
  const userId = interaction.user.id;
  const userImage = interaction.user.displayAvatarURL();
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

    switch (commandName) {
      case "my-profile":
        const myProfileEmbed = await EmbedController.ShowUserProfile(
          userId,
          userImage
        );
        await interaction.reply({ embeds: [myProfileEmbed] });
        return;
      case "friend-profile":
        // Obtém o usuário selecionado
        const selectedUser = interaction.options.getUser("user");

        // Verifica se o usuário é um bot
        if (selectedUser.bot) {
          await interaction.reply({
            content: "Bots não possuem contas, seu engraçadinho.",
            ephemeral: true,
          });
          break;
        }

        // Verifica se o usuário está registrado
        const friendRegistered = await IsRegisteredUser(
          selectedUser.id,
          selectedUser.username
        );

        if (!friendRegistered) {
          // Se o amigo não tiver conta
          await interaction.reply({
            content: "O usuário selecionado ainda não possui uma conta.",
            ephemeral: true,
          });
        } else {
          // Se o amigo tiver conta, exibe o perfil
          const friendProfileEmbed = await EmbedController.ShowUserProfile(
            selectedUser.id,
            selectedUser.displayAvatarURL()
          );
          await interaction.reply({
            embeds: [friendProfileEmbed],
            ephemeral: true,
          });
        }
        break;
      case "f-card":
        try {
          const cardName = interaction.options.getString("card");
          const card = await CardController.getCardByName(cardName);

          if (!card) {
            await interaction.reply({
              content: "Card não encontrado!",
              ephemeral: true,
            });
            return;
          }
          console.log(card);

          const cardEmbed = await EmbedController.ShowCard(card);
          const SkillDetails = await ButtonController.SkillDetails(card.skill1.name, card.skill2.name);
          await interaction.reply({ embeds: [cardEmbed], components: [SkillDetails] });
        } catch (error) {
          console.error("Erro ao buscar ou exibir o card:", error);
          await interaction.reply({
            content: "Ocorreu um erro ao processar o card.",
            ephemeral: true,
          });
        }
        break;
    }

    // Comandos de Admin (descomentado caso necessário)
    /*
        const isAdminUser = await IsAdmin(interaction.user.id);
        if (isAdminUser && commandName === 'test') {
            await interaction.editReply({ content: "Teste ADM sucesso!" });
            return;
        } else {
            await interaction.editReply({ content: "Você não tem permissão para executar esse comando." });
        }
        */

    // Outras lógicas de comando podem ir aqui...
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
