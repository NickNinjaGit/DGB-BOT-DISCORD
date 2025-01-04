// Controllers
const EmbedController = require("../../controllers/EmbedController");
const CardController = require("../../controllers/CardController");
const ButtonController = require("../../controllers/ButtonController");

// Models
const User = require("../../models/User");
// helpers
const IsRegisteredUser = require("../../helpers/IsRegisteredUser");
const checkActiveInteractions = require("../../helpers/checkActiveInteractions");
const wait = require("util").promisify(setTimeout);

// gif exibition
const path = require("path");
img_folder = path.resolve(__dirname, "../../images/");
const { AttachmentBuilder } = require("discord.js");

/* User Relational interactions */
async function myProfile(interaction, activeInteractions) {
  const userId = interaction.user.id;
  const userImage = interaction.user.displayAvatarURL();

  const currentInteractions = await checkActiveInteractions(
    userId,
    activeInteractions
  );

  if (currentInteractions) {
    const msg = await interaction.channel.send(
      "Você possui uma interação ativa! Por favor, aguarde ou finalize a interação antes de executar o comando."
    );
    await wait(3000); // Aguarda 3 segundos
    msg.delete(); // Deleta a mensagem
    return;
  }

  
  const myProfileEmbed = await EmbedController.ShowUserProfile(
    userId,
    userImage
  );
  const profileButtons = await ButtonController.ProfileButtons();
  await interaction.reply({ embeds: [myProfileEmbed], components: [profileButtons], fetchReply: true,  });

  const collector = interaction.channel.createMessageComponentCollector({
    filter: (i) => i.user.id === userId,
    time: 600000, // 10 minuto
  });

  // Configurar o coletor para ouvir interações nos botões
  collector.on("collect", async (i) => {
    const ShowPackageInfo = await EmbedController.ShowPackageInfo(userId);
    if (i.customId === "pack-info") {
      await i.update({
        embeds: [ShowPackageInfo],
        components: [profileButtons],
        fetchReply: true,
      });
    } else if (i.customId === "user-info") {
      await i.update({
        embeds: [myProfileEmbed],
        components: [profileButtons],
        fetchReply: true,
      });
    } else if (i.customId === "quit") {
      activeInteractions.delete(userId);
      collector.stop();
      await i.update({
        content: "Interação finalizada.",
        components: [],
        fetchReply: true,
      });
      
      await i.deleteReply();
    }
  });
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
    interaction.deleteReply();
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
    });
    await wait(3000);
    interaction.deleteReply();
  }
}

const Work_cooldown = new Map(); // Mapa para rastrear os cooldowns de trabalhos
async function Work(interaction) {
  const userId = interaction.user.id;
  const work_gif = new AttachmentBuilder(`${img_folder}/work.gif`); // Certifique-se de que o caminho está correto
  const minMoney = 10;
  const maxMoney = 100;
  const cooldownTime = 3 * 60 * 60 * 1000; // 3 horas em milissegundos

  // Verifica se o usuário está em cooldown
  if (Work_cooldown.has(userId)) {
    const remainingTime = Work_cooldown.get(userId) - Date.now();
    if (remainingTime > 0) {
      const hours = Math.floor(remainingTime / 1000 / 3600);
      const minutes = Math.floor(remainingTime / 1000 / 60);
      const seconds = Math.floor((remainingTime / 1000) % 60);
      interaction.reply({
        content: `Você já trabalhou! Volte em **${hours} horas, ${minutes} minutos e ${seconds} segundos.**`,
      });
      await wait(3000);
      interaction.deleteReply();
      return;
    }
  }

  const moneyQty = Math.random() * (maxMoney - minMoney) + minMoney;

  // Atualiza os dados do usuário no banco
  const user = await User.findOne({ where: { discordID: userId } });
  user.wallet += moneyQty;
  await user.save();

  // Define o cooldown
  Work_cooldown.set(userId, Date.now() + cooldownTime);

  // Responde ao comando
  await interaction.reply({
    content: `Você ganhou ${moneyQty.toFixed(
      0
    )} 💸! Volte daqui 3 horas para trabalhar de novo!`,
    files: [work_gif],
    ephemeral: true,
  });
  await wait(3000);
  interaction.deleteReply();

  // Envia DM ao usuário após o cooldown
  setTimeout(() => {
    interaction.user.send({
      content: `Você já pode trabalhar de novo, vagabundo!`,
    });
    Work_cooldown.delete(userId); // Remove o usuário do cooldown após 3 horas
  }, cooldownTime);
}

const Daily_cooldown = new Map(); // Mapa para rastrear os cooldowns de dinheiro diario
async function Daily(interaction) {
  const userId = interaction.user.id;
  const daily_gif = new AttachmentBuilder(`${img_folder}/daily.gif`); // Certifique-se de que o caminho está correto
  minMoney = 50;
  maxMoney = 250;
  const moneyQty = Math.random() * (maxMoney - minMoney) + minMoney;
  const cooldownTime = 24 * 60 * 60 * 1000; // 24 horas em milissegundos

  // Verifica se o usuário está em cooldown
  if (Daily_cooldown.has(userId)) {
    const remainingTime = Daily_cooldown.get(userId) - Date.now();
    if (remainingTime > 0) {
      const hours = Math.floor(remainingTime / 1000 / 3600);
      const minutes = Math.floor(remainingTime / 1000 / 60);
      const seconds = Math.floor((remainingTime / 1000) % 60);
      interaction.reply({
        content: `Você já coletou seu Daily! Volte em **${hours} horas, ${minutes} minutos e ${seconds} segundos.**`,
      });
      await wait(3000);
      interaction.deleteReply();
      return;
    }
  }
  // Atualiza os dados do usuário no banco
  const user = await User.findOne({ where: { discordID: userId } });
  user.wallet += moneyQty;
  await user.save();

  // Define o cooldown
  Daily_cooldown.set(userId, Date.now() + cooldownTime);

  // Responde ao comando
  await interaction.reply({
    content: `**Você ganhou ${moneyQty.toFixed(
      0
    )} 💸! Volte amanhã para coletar seu daily de novo!**`,
    files: [daily_gif],
  });
  await wait(3000);
  interaction.deleteReply();

  // Envia DM ao usuário após o cooldown
  setTimeout(() => {
    interaction.user.send({
      content: `Você já pode resgatar seu daily novamente!`,
    });
    Daily_cooldown.delete(userId); // Remove o usuário do cooldown após 3 horas
  }, cooldownTime);
}

async function Shop(interaction, activeInteractions) {
  const userId = interaction.user.id;
  const currentInteractions = await checkActiveInteractions(
    userId,
    activeInteractions
  );

  if (currentInteractions) {
    const msg = await interaction.channel.send(
      "Você possui uma interação ativa! Por favor, aguarde ou finalize a interação antes de executar o comando."
    );
    await wait(3000); // Aguarda 3 segundos
    msg.delete(); // Deleta a mensagem
    return;
  }
  //get all cards from collection

  const cardList = await CardController.getAllCards();

  // setting cards pagination to shop
  let pageId = 1;

  const ItensPerPage = 3;
  const totalPages = Math.ceil(cardList.length / ItensPerPage);

  let cardsPerPage = await CardController.getCardsPerPage(
    pageId,
    ItensPerPage,
    cardList
  );

  // setting embed & buttons
  let shopEmbed = await EmbedController.ShowShop(
    cardsPerPage,
    pageId,
    totalPages
  );
  const shopButtons = await ButtonController.ShopButtons();
  await interaction.reply({
    embeds: [shopEmbed],
    ephemeral: true,
    components: [shopButtons],
  });

  // setting collector
  const collector = interaction.channel.createMessageComponentCollector({
    filter: (i) => i.user.id === userId,
    time: 24 * 60 * 60 * 1000, // 1 dia
  });

  // handling buttons
  collector.on("collect", async (i) => {
    // se o botao for next, muda para a proxima pagina
    if (i.customId === "next") {
      pageId = pageId >= totalPages ? 1 : pageId + 1; // Volta para a primeira página se for a última

      cardsPerPage = await CardController.getCardsPerPage(
        pageId,
        ItensPerPage,
        cardList
      );
      shopEmbed = await EmbedController.ShowShop(
        cardsPerPage,
        pageId,
        totalPages
      );
      await i.update({
        embeds: [shopEmbed],
        ephemeral: true,
        components: [shopButtons],
      });
    }
    // se o botao for previous, muda para a pagina anterior
    else if (i.customId === "previous") {
      pageId = pageId === 1 ? (pageId = totalPages) : (pageId = pageId - 1); // se a pagina for menor que 1, volta para a ultima
      cardsPerPage = await CardController.getCardsPerPage(
        pageId,
        ItensPerPage,
        cardList
      );
      shopEmbed = await EmbedController.ShowShop(
        cardsPerPage,
        pageId,
        totalPages
      );
      await i.update({
        embeds: [shopEmbed],
        ephemeral: true,
        components: [shopButtons],
      });
    }
    if (i.customId === "quit") {
      activeInteractions.delete(userId);
      await i.update({
        content: "Saida realizada com sucesso.",
        embeds: [],
        components: [],
        ephemeral: true,
      });
      collector.stop();
      await i.deleteReply();
    }
  });
}

module.exports = { myProfile, friendProfile, Work, Daily, Shop };
