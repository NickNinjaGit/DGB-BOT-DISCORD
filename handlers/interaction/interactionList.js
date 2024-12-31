const EmbedController = require("../../controllers/EmbedController");
const CardController = require("../../controllers/CardController");
const ButtonController = require("../../controllers/ButtonController");
// helpers
const IsRegisteredUser = require("../../helpers/IsRegisteredUser");
const isAdmin = require("../../helpers/isAdmin");
const wait = require("node:timers/promises").setTimeout;
const path = require("path");
img_folder = path.resolve(__dirname, "../../images/");

// models
const User = require("../../models/User");

/* User Relational interactions */
async function myProfile(interaction) {
  const userId = interaction.user.id;
  const userImage = interaction.user.displayAvatarURL();
  const myProfileEmbed = await EmbedController.ShowUserProfile(
    userId,
    userImage
  );
  await interaction.reply({ embeds: [myProfileEmbed] });
  await wait(10000);
  interaction.deleteReply();
}

async function friendProfile(interaction) {
  // Obtém o usuário selecionado
  const selectedUser = interaction.options.getUser("user");

  // Verifica se o usuário é um bot
  if (selectedUser.bot) {
    await interaction.reply({
      content: "Bots não possuem contas, seu engraçadinho.",
      ephemeral: true,
    });
    return;
  }

  // Verifica se o usuário está registrado
  const friendRegistered = await IsRegisteredUser(
    selectedUser.id,
    selectedUser.username,
    true // true para impedir que o usuário tenha uma conta criada contra sua vontade
  );

  if (friendRegistered === false) {
    // Se o amigo não tiver conta
    await interaction.reply({
      content: "O usuário selecionado ainda não possui uma conta.",
      ephemeral: true,
    });
    interaction.deleteReply();
    return;
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
    interaction.deleteReply();
  }
}

async function Work(interaction) {
  const userId = interaction.user.id;
  const moneyQty = Math.random() * (100 - 10) + 10;

  alreadyWorked = userId.alreadyWorked;
  if (alreadyWorked) {
    interaction.reply({
      content: `Seu expediente acabou! Volte mais tarde!`,
      ephemeral: true,
    });
    await wait(3000);
    interaction.deleteReply();
    return;
  }
  const user = await User.findOne({ where: { discordID: userId } });
  user.wallet += moneyQty;
  user.alreadyWorked = true;
  await user.save();
  await interaction.reply({
    content: `Voce ganhou ${moneyQty.toFixed(
      0
    )} 💸, volte daqui 3 horas para trabalhar de novo!`,
    file: `${img_folder}/work.gif`,
    ephemeral: true,
  });
  await wait(3000);
  interaction.deleteReply();
  await wait(10000); // 3 horas 10800000
  user.alreadyWorked = false;
  await user.save();
  // send dm to user who used command
  interaction.user.send({
    content: `Você já pode trabalhar de novo vabagundo!`,
  });
}

/* Card Relational interactions */
async function findCard(interaction) {
  const userId = interaction.user.id;
  //get card name input and finding card in database
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
  const SkillDetails = await ButtonController.SkillDetails(
    card.skill1.name,
    card.skill2.name
  );
  await interaction.reply({
    embeds: [cardEmbed],
    components: [SkillDetails.skillRow],
    fetchReply: true,
    ephemeral: true,
  });

  //
  const collector = interaction.channel.createMessageComponentCollector({
    filter: (i) => i.user.id === userId,
    time: 600000, // 10 minuto
  });

  // Configurar o coletor para ouvir interações nos botões
  collector.on("collect", async (i) => {
    if (i.customId === "skill1Details") {
      const skill1Embed = await EmbedController.ShowSkill(card.skill1);
      await i.update({
        embeds: [skill1Embed],
        components: [SkillDetails.backRow], // Mostrar botão de "voltar"
        fetchReply: true,
        ephemeral: true,
      });
    } else if (i.customId === "skill2Details") {
      const skill2Embed = await EmbedController.ShowSkill(card.skill2);
      await i.update({
        embeds: [skill2Embed],
        components: [SkillDetails.backRow], // Mostrar botão de "voltar"
        fetchReply: true,
        ephemeral: true,
      });
    } else if (i.customId === "back") {
      await i.update({
        embeds: [cardEmbed],
        components: [SkillDetails.skillRow], // Retornar ao conjunto de habilidades
        fetchReply: true,
        ephemeral: true,
      });
    } else if (i.customId === "quit") {
      await i.update({
        content: "Saída realizada com sucesso.",
        embeds: [],
        components: [],
        ephemeral: true,
      });
      await wait(1000);
      await i.deleteReply();
    }
  });

  collector.on("end", async () => {
    //remove message
    await interaction.editReply({
      embeds: [],
      content: "**Tempo limite excedido, interação cancelada.**",
      components: [],
      ephemeral: true,
    });
  });
}

/* Admin Relational interactions */
async function testAdmin(interaction) {
  // se retornar falso para este id, barra o usuário.
  const userId = interaction.user.id;
  const Isadmin = await isAdmin(userId);
  if (Isadmin === false) {
    interaction.reply({
      content: "Voce não tem permissao para executar esse comando",
      ephemeral: true,
    });
    return;
  }
  interaction.reply("Teste de admin executado com sucesso!", {
    ephemeral: true,
  });
}

module.exports = { myProfile, friendProfile, Work, findCard, testAdmin };
