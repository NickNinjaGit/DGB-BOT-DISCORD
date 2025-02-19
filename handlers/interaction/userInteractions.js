// Controllers
const BattleController = require("../../controllers/BattleController");
const EmbedController = require("../../controllers/EmbedController");
const CollectorController = require("../../controllers/CollectorController");
const CardController = require("../../controllers/CardController");
const ButtonController = require("../../controllers/ButtonController");
const PackageController = require("../../controllers/PackageController");

// Models
const User = require("../../models/User");
// helpers
const IsRegisteredUser = require("../../helpers/IsRegisteredUser");
const checkActiveInteractions = require("../../helpers/checkActiveInteractions");
const checkCooldownTimer = require("../../helpers/checkCooldownTimer");
const Pagination = require("../../helpers/pagination");
const wait = require("util").promisify(setTimeout);

// gif exibition
const path = require("path");
img_folder = path.resolve(__dirname, "../../images/");
const { AttachmentBuilder } = require("discord.js");

/* User Relational interactions */
async function myProfile(interaction, activeInteractions) {
  const discordID = interaction.user.id;
  const userImage = interaction.user.displayAvatarURL();

  const isActiveInteractions = await checkActiveInteractions(
    discordID,
    interaction,
    activeInteractions
  );

  if (isActiveInteractions === true) {
    return;
  }

  const myProfileEmbed = await EmbedController.ShowUserProfile(
    discordID,
    userImage
  );
  const profileButtons = await ButtonController.ProfileButtons();
  await interaction.deferReply();
  await interaction.editReply({
    embeds: [myProfileEmbed],
    components: [profileButtons],
    fetchReply: true,
  });
  activeInteractions.add(discordID);
  CollectorController.ProfileCollector(
    interaction,
    discordID,
    myProfileEmbed,
    profileButtons,
    activeInteractions
  );
}

async function friendProfile(interaction) {
  // Obtém o usuário selecionado
  const selectedUser = interaction.options.getUser("user");

  // Verifica se o usuário é um bot
  if (selectedUser.bot) {
    await interaction.reply({
      content: "Bots não possuem contas, seu engraçadinho.",
    });
    await wait(1000);
    await interaction.deleteReply();
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
    });
    await wait(1000);
    await interaction.deleteReply();
    return;
  } else {
    // Se o amigo tiver conta, exibe o perfil
    const friendProfileEmbed = await EmbedController.ShowUserProfile(
      selectedUser.id,
      selectedUser.displayAvatarURL()
    );
    await interaction.reply({
      embeds: [friendProfileEmbed],
    });
    await wait(3000);
    await interaction.deleteReply();
  }
}

const Work_cooldown = new Map(); // Mapa para rastrear os cooldowns de trabalhos
async function Work(interaction) {
  const discordID = interaction.user.id;
  const work_gif = new AttachmentBuilder(`${img_folder}/work.gif`); // Certifique-se de que o caminho está correto
  const minMoney = 10;
  const maxMoney = 100;
  const cooldownTime = 3 * 60 * 60 * 1000; // 3 horas em milissegundos

  // Verifica se o usuário está em cooldown
  const isInCooldown = await checkCooldownTimer(
    discordID,
    interaction,
    Work_cooldown
  );

  if (isInCooldown) {
    return;
  }
  // Calcula a quantidade de dinheiro ganho
  const moneyQty = Math.random() * (maxMoney - minMoney) + minMoney;
  // Define o cooldown mapeando o usuário com o tempo de cooldown
  Work_cooldown.set(discordID, Date.now() + cooldownTime);

  // Aumenta o dinheiro do usuário
  const user = await User.findOne({ where: { discordID } });
  user.wallet += moneyQty;
  await user.save();

  // Responde o usuário com o dinheiro ganho
  await interaction.deferReply({ ephemeral: true });
  await interaction.editReply({
    content: `Você ganhou ${moneyQty.toFixed(
      0
    )} 💸! Volte daqui 3 horas para trabalhar de novo!`,
    files: [work_gif],
    ephemeral: true,
  });
  await wait(3000);
  await interaction.deleteReply();

  // Envia DM ao usuário após o cooldown
  await wait(cooldownTime);
  interaction.user.send({
    content: `Agora é hora de trabalhar, ${interaction.user.username}!`,
  });
  Work_cooldown.delete(discordID);
}

const Daily_cooldown = new Map(); // Mapa para rastrear os cooldowns de dinheiro diario
async function Daily(interaction) {
  const discordID = interaction.user.id;
  const daily_gif = new AttachmentBuilder(`${img_folder}/daily.gif`); // Certifique-se de que o caminho está correto
  minMoney = 50;
  maxMoney = 250;
  const cooldownTime = 24 * 60 * 60 * 1000; // 24 horas em milissegundos

  // Calcula a quantidade de dinheiro ganho
  const moneyQty = Math.random() * (maxMoney - minMoney) + minMoney;

  // Verifica se o usuário está em cooldown
  const isInCooldown = await checkCooldownTimer(
    discordID,
    interaction,
    Daily_cooldown
  );

  if (isInCooldown) {
    return;
  }

  // Atualiza os dados do usuário no banco
  const user = await User.findOne({ where: { discordID } });
  user.wallet += moneyQty;
  await user.save();

  // Define o cooldown
  Daily_cooldown.set(discordID, Date.now() + cooldownTime);

  // Responde ao comando
  await interaction.deferReply({ ephemeral: true });
  await interaction.editReply({
    content: `**Você ganhou ${moneyQty.toFixed(
      0
    )} 💸! Volte amanhã para coletar seu daily de novo!**`,
    files: [daily_gif],
  });
  await wait(3000);
  await interaction.deleteReply();

  // Envia DM ao usuário após o cooldown
  await wait(cooldownTime);
  interaction.user.send({
    content: `Você já pode resgatar seu daily novamente!`,
  });
  Daily_cooldown.delete(discordID); // Remove o usuário do cooldown após 3 horas
}

async function Shop(interaction, activeInteractions) {
  const discordID = interaction.user.id;
  const user = await User.findOne({ where: { discordID } });

  const isActiveInteractions = await checkActiveInteractions(
    discordID,
    interaction,
    activeInteractions
  );

  if (isActiveInteractions === true) {
    return;
  }

  //get all cards from collection
  const cardList = await CardController.getAllCards();
  const packageList = await PackageController.getAllPackages(user);

  // setting cards pagination to shop
  let pageId = 1;

  const ItensPerPage = 3;

  // Faz um calculo de total de páginas considerando as páginas quebradiças
  const totalPages = Math.ceil(cardList.length / ItensPerPage);

  let cardsPerPage = await Pagination(pageId, ItensPerPage, cardList);

  let packagesPerPage = await Pagination(pageId, ItensPerPage, packageList);

  // setting embed & buttons
  let shopEmbed = await EmbedController.ShowShop(
    cardsPerPage,
    packagesPerPage,
    pageId,
    totalPages
  );
  const shopButtons = await ButtonController.NavButtons();
  await interaction.reply({
    embeds: [shopEmbed],
    components: [shopButtons],
  });
  activeInteractions.add(discordID);
  CollectorController.ShopCollector(
    interaction,
    discordID,
    shopEmbed,
    shopButtons,
    cardList,
    packageList,
    pageId,
    totalPages,
    ItensPerPage,
    cardsPerPage,
    packagesPerPage,
    activeInteractions
  );
}
async function Leaderboards(interaction) {
  //get all users
  const users = await User.findAll({
    order: [["BattlesWon", "DESC"]],
    raw: true,
  });
  // setting up embed
  const leaderboardEmbed = await EmbedController.ShowLeaderboard(users);

  await interaction.reply({
    embeds: [leaderboardEmbed],
    ephemeral: true,
  });
}
async function StartBattle(interaction, activeInteractions) {
  const discordID = interaction.user.id;
  const challengedUser = interaction.options.getUser("user");
  const turnosQty = interaction.options.getInteger("turnos");

  if(challengedUser.id === discordID) {
    await interaction.reply({
      content: "**Você não pode se desafiar a si mesmo!**",
    });
    await wait(2000);
    await interaction.deleteReply();
    return;
  }
  if(challengedUser.bot) {
    await interaction.reply({
      content: "**Bots não podem ser desafiados!**",
    });
    await wait(2000);
    await interaction.deleteReply();
    return;
  }

  // check if user active interactions
  const isActiveInteractions = await checkActiveInteractions(
    discordID,
    interaction,
    activeInteractions
  );

  if (isActiveInteractions === true) {
    return;
  }
  // check if the user is in a battle
  const userOnBattle = await User.findOne({ where: { discordID } });
  if (userOnBattle.IsInBattle === true) {
    await interaction.reply({
      content: "**Impossível desafiar agora, Você ja está em uma batalha!**",
    });
    await wait(2000);
    await interaction.deleteReply();
    return;
  }
  // check if challenged user is already in a battle
  const challengedUserOnBattle = await User.findOne({
    where: { discordID: challengedUser.id },
  });

  if (challengedUserOnBattle.IsInBattle === true) {
    await interaction.reply({
      content: "**O usuário selecionado já esta em uma batalha!**",
    });
    await wait(2000);
    await interaction.deleteReply();
    return;
  }

  const challenge = await interaction.reply({
    content: `<@${interaction.user.id}> está desafiando <@${challengedUser.id}> para uma batalha de ${turnosQty} turnos...`,
    fetchReply: true,
  });

  await challenge.react("👍");
  await challenge.react("👎");
  await challenge.react("❌");

  activeInteractions.add(discordID);

  const BattleRequest = (reaction, user) => {
    return (
      reaction.emoji.name === "👍" ||
      (reaction.emoji.name === "👎" && user.id === challengedUser.id)
    );
  };
  const BattleCancel = (reaction, user) => {
    return reaction.emoji.name === "❌" && user.id === discordID;
  };
  const collector = challenge.createReactionCollector({
    filters: [BattleRequest, BattleCancel],
    time: 300000, //5 minutos
  });

  collector.on("collect", async (reaction) => {
    if (reaction.emoji.name === "👍") {
      await interaction.editReply({
        content: `<@${challengedUser.id}> aceitou o desafio!`,
      });

      // defina que os usuários estão em batalha
      const user1 = await User.findOne({ where: { discordID: discordID } });
      const user2 = await User.findOne({
        where: { discordID: challengedUser.id },
      });
      user1.IsInBattle = true;
      user2.IsInBattle = true;
      await user1.save();
      await user2.save();

      const message = await interaction.fetchReply();

      // Criar a thread a partir da mensagem de resposta
      const thread = await message.startThread({
          name: `${interaction.user.username} vs ${challengedUser.username}`,
          autoArchiveDuration: 1440, // 24 horas (1440 minutos)
          reason: "Tópico para separar as batalhas",
      });

      console.log(`${thread.name} criado com sucesso!`);

      // inicie o setup da batalha
      //await BattleController.BattleSetup(user1, user2, thread, turnosQty);

      activeInteractions.delete(discordID);
      await wait(30000);
      return;
    } else if (reaction.emoji.name === "👎") {
      await interaction.editReply({
        content: `<@${challengedUser.id}> recusou o desafio!`,
      });
      activeInteractions.delete(discordID);
      collector.stop();
      return;
    } else if (reaction.emoji.name === "❌") {
      await interaction.editReply({
        content: `<@${interaction.user.id}> cancelou o desafio!`,
      });
      activeInteractions.delete(discordID);
      collector.stop();
    }
  });
  collector.on("end", async () => {
    await wait(2000);
    await interaction.deleteReply();
  });
}

module.exports = {
  myProfile,
  friendProfile,
  Work,
  Daily,
  Shop,
  Leaderboards,
  StartBattle,
};
