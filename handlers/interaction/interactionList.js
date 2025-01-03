const EmbedController = require("../../controllers/EmbedController");
const CardController = require("../../controllers/CardController");
const ButtonController = require("../../controllers/ButtonController");
// helpers
const IsRegisteredUser = require("../../helpers/IsRegisteredUser");
const isAdmin = require("../../helpers/isAdmin");
const wait = require("node:timers/promises").setTimeout;
const path = require("path");
img_folder = path.resolve(__dirname, "../../images/");
const {AttachmentBuilder} = require('discord.js');
// models
const User = require("../../models/User");
const UserCards = require("../../models/UserCards");
const Card = require("../../models/Card");


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
      ephemeral: true,
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
      ephemeral: true,
    });
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
      const hours = Math.floor((remainingTime / 1000) / 3600);
      const minutes = Math.floor((remainingTime / 1000) / 60);
      const seconds = Math.floor((remainingTime / 1000) % 60);
      interaction.reply({
        content: `Você já trabalhou! Volte em **${hours} horas, ${minutes} minutos e ${seconds} segundos.**`,
        ephemeral: true,
      });
      await wait(3000);
      interaction.deleteReply();
      return 
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
    content: `Você ganhou ${moneyQty.toFixed(0)} 💸! Volte daqui 3 horas para trabalhar de novo!`,
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
      const hours = Math.floor((remainingTime / 1000) / 3600);
      const minutes = Math.floor((remainingTime / 1000) / 60);
      const seconds = Math.floor((remainingTime / 1000) % 60);
      interaction.reply({
        content: `Você já coletou seu Daily! Volte em **${hours} horas, ${minutes} minutos e ${seconds} segundos.**`,
        ephemeral: true,
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
    content: `**Você ganhou ${moneyQty.toFixed(0)} 💸! Volte amanhã para coletar seu daily de novo!**`,
    ephemeral: true,
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

async function Shop(interaction) {
  const userId = interaction.user.id;
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
  )


  // setting embed & buttons
  let shopEmbed = await EmbedController.ShowShop(cardsPerPage, pageId, totalPages);
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
      )
      shopEmbed = await EmbedController.ShowShop(cardsPerPage, pageId, totalPages);
      await i.update({
        embeds: [shopEmbed],
        ephemeral: true,
        components: [shopButtons],
      });
      
        
    }
    // se o botao for previous, muda para a pagina anterior
    else if (i.customId === "previous") {
      pageId = pageId === 1 ? pageId = totalPages : pageId = pageId - 1; // se a pagina for menor que 1, volta para a ultima
      cardsPerPage = await CardController.getCardsPerPage(
        pageId,
        ItensPerPage,
        cardList
      )
      shopEmbed = await EmbedController.ShowShop(cardsPerPage, pageId, totalPages);
      await i.update({
        embeds: [shopEmbed],
        ephemeral: true,
        components: [shopButtons],
      });
    }
    if (i.customId === "quit") {
      await i.update({
        content: "Saida realizada com sucesso.",
        embeds: [],
        components: [],
        ephemeral: true,
      });
      await wait(1000);
      await i.deleteReply();
    }
  });
}

async function BuyCard(interaction) {
  const userId = interaction.user.id;
  const cardName = interaction.options.getString("card");
  const user = await User.findOne({ where: { discordID: userId } });
  const card = await CardController.getCardByName(cardName);

  // check if card exists
  if (!card) {
    await interaction.reply({
      content: "Card nao encontrado!",
      ephemeral: true,
    });
    await wait(3000);
    interaction.deleteReply();
    return;
  }

  // check if user has enough money
  if (user.wallet < card.price) {
    await interaction.reply({
      content: "Dinheiro insuficiente!",
      ephemeral: true,
    });
    await wait(3000);
    interaction.deleteReply();
    return;
  }

  
  // buy card
  await CardController.BuyCard(userId, cardName);
  user.wallet -= card.price;
  await user.save();
  await interaction.reply({
    content: `Compra realizada com sucesso! Use /f-user-cards para ver sua nova carta!`,
    ephemeral: true,
  });
  await wait(3000);
  interaction.deleteReply();
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
async function addCash(interaction) {
  const userId = interaction.user.id;
  const Isadmin = await isAdmin(userId);
 
  if (Isadmin === false) {
    interaction.reply({
      content: "Você não tem permissão para executar esse comando",
      ephemeral: true,
    });
    await wait(3000);
    interaction.deleteReply();
    return;
  }
  // get money to give and target user
  const targetUser = interaction.options.getUser("user");
  if(targetUser.bot) {
    interaction.reply({
      content: "Bots não podem receber dinheiro",
      ephemeral: true,
    });
    await wait(3000);
    interaction.deleteReply();
    return;
  }
  const moneyQty = interaction.options.getInteger("cash");
  const user = await User.findOne({ where: { discordID: targetUser.id } });
  user.wallet += moneyQty;
  await user.save();
  interaction.reply(`✅⠀**Você adicionou ${moneyQty} 💸 para o usuário ${targetUser.username}**⠀✅`);
  await wait(3000);
  interaction.deleteReply();
}
async function removeCash(interaction) {
  const userId = interaction.user.id;
  const Isadmin = await isAdmin(userId);
 
  if (Isadmin === false) {
    interaction.reply({
      content: "Você não tem permissão para executar esse comando",
      ephemeral: true,
    });
    await wait(3000);
    interaction.deleteReply();
    return;
  }
  // get money to give and target user
  const targetUser = interaction.options.getUser("user");
  if(targetUser.bot) {
    interaction.reply({
      content: "Bots não podem receber dinheiro",
      ephemeral: true,
    });
    await wait(3000);
    interaction.deleteReply();
    return;
  }
  const moneyQty = interaction.options.getInteger("cash");
  const user = await User.findOne({ where: { discordID: targetUser.id } });
  user.wallet -= moneyQty;
  await user.save();
  interaction.reply(`❌⠀**Você removeu ${moneyQty} 💸 para o usuário ${targetUser.username}**⠀❌`);
  await wait(3000);
  interaction.deleteReply();
}

module.exports = { myProfile, friendProfile, Work, Daily, Shop, BuyCard, findCard, addCash, removeCash };
