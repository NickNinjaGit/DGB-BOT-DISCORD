// Controllers
const EmbedController = require("../../controllers/EmbedController");
const CardController = require("../../controllers/CardController");
const ButtonController = require("../../controllers/ButtonController");
const PackageController = require("../../controllers/PackageController");

// Models
const User = require("../../models/User");
const UserCards = require("../../models/UserCards");
const Card = require("../../models/Card");
// handlers
const handleSkillInteraction = require("../skills/handleSkillInteraction");

// validators
const checkActiveInteractions = require("../validations/checkActiveInteractions");
const cardExist = require("../validations/cardExist");
const userHasCards = require("../validations/userHasCards");
// helpers
const wait = require("node:timers/promises").setTimeout;
const pagination = require("../../helpers/pagination");

// gif exibition
const path = require("path");
img_folder = path.resolve(__dirname, "../../images/");
const { AttachmentBuilder } = require("discord.js");

/* Card Relational interactions */
async function findCard(interaction, activeInteractions) {
  const userId = interaction.user.id;

  // Verificar se já existe uma interação ativa para este usuário
  await checkActiveInteractions(userId, activeInteractions);

  // Marcar a interação como ativa
  activeInteractions.add(userId);

  // Obter o nome da carta
  const cardName = interaction.options.getString("card");
  const card = await CardController.getCardByName(cardName);

  // Verificar se a carta foi encontrada
  await cardExist(card, activeInteractions, interaction, userId);

  const cardEmbed = await EmbedController.ShowCard(card);
  const skillDetails = await ButtonController.SkillDetails(
    card.skill1.name,
    card.skill2.name
  );

  await interaction.reply({
    embeds: [cardEmbed],
    components: [skillDetails.skillRow],
    fetchReply: true,
  });

  handleSkillInteraction(
    interaction,
    userId,
    card,
    cardEmbed,
    skillDetails,
    activeInteractions
  );
}

async function myCards(interaction, activeInteractions) {
  const discordID = interaction.user.id;

  // Verificar se já existe uma interação ativa para este usuário
  await checkActiveInteractions(discordID, activeInteractions);

  // Marcar a interação como ativa
  activeInteractions.add(discordID);

  const user = await User.findOne({ where: { discordID: discordID } });

  // Query Cards to get all card info
  const cardList = await Card.findAll({
    include: {
      model: User,
      where: { id: user.id },
      through: { attributes: [] }, // Remove os atributos extras da tabela de junção
    },
  });
  // filter only cards that user has
  const userCards = await UserCards.findAll({ where: { userId: user.id } });
  let cardsqty = userCards.map((card) => card.quantity);

  // Check if user has cards
  userHasCards(userCards, interaction, activeInteractions, discordID);

  let pageId = 1;
  const ItensPerPage = 3;

  let cardsPerPage = await pagination(pageId, ItensPerPage, cardList);
  const totalPages = Math.ceil(cardList.length / ItensPerPage);

  const cardEmbed = await EmbedController.ShowUserCardList(
    cardsPerPage,
    cardsqty,
    pageId,
    totalPages
  );
  const navButtons = await ButtonController.NavButtons();
  await interaction.reply({
    embeds: [cardEmbed],
    components: [navButtons],
    fetchReply: true,
  });

  // setting collector
  const collector = interaction.channel.createMessageComponentCollector({
    filter: (i) => i.user.id === discordID,
    time: 24 * 60 * 60 * 1000, // 1 dia
  });

  // handling buttons
  collector.on("collect", async (i) => {
    // se o botao for next, muda para a proxima pagina
    if (i.customId === "next") {
      pageId = pageId >= totalPages ? 1 : pageId + 1; // Volta para a primeira página se for a última

      cardsPerPage = await pagination(pageId, ItensPerPage, cardList);
      const cardEmbed = await EmbedController.ShowUserCardList(
        cardsPerPage,
        cardsqty,
        pageId,
        totalPages
      );
      await i.update({
        embeds: [cardEmbed],
        ephemeral: true,
        components: [navButtons],
      });
    }
    // se o botao for previous, muda para a pagina anterior
    else if (i.customId === "previous") {
      pageId = pageId === 1 ? (pageId = totalPages) : (pageId = pageId - 1); // se a pagina for menor que 1, volta para a ultima
      cardsPerPage = await pagination(pageId, ItensPerPage, cardList);
      const cardEmbed = await EmbedController.ShowUserCardList(
        cardsPerPage,
        cardsqty,
        pageId,
        totalPages
      );
      await i.update({
        embeds: [cardEmbed],
        ephemeral: true,
        components: [navButtons],
      });
    }
    if (i.customId === "quit") {
      activeInteractions.delete(discordID);
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

async function Collection(interaction, activeInteractions) {
  const discordID = interaction.user.id;

  // Verificar se já existe uma interação ativa para este usuário
  await checkActiveInteractions(discordID, activeInteractions);

  // Marcar a interação como ativa
  activeInteractions.add(discordID);

  // Obter todas as cartas
  const cards = await CardController.getAllCards();

  // Inicializar variáveis de paginação
  let pageId = 0; // Índice da página (0 para a primeira carta)
  const totalCards = cards.length;

  // Obter a carta atual
  const currentCard = cards[pageId];

  // Gerar embed para a carta atual
  const cardEmbed = await EmbedController.ShowCard(
    currentCard,
    pageId + 1,
    totalCards
  );

  // Gerar botões de navegação
  const navButtons = await ButtonController.ShopButtons();

  // Responder ao usuário com a primeira carta
  await interaction.reply({
    embeds: [cardEmbed],
    components: [navButtons],
    fetchReply: true,
  });

  // Configurar o coletor de interações de botões
  const collector = interaction.channel.createMessageComponentCollector({
    filter: (i) => i.user.id === discordID,
    time: 24 * 60 * 60 * 1000, // 1 dia
  });

  // Manipular interações dos botões
  collector.on("collect", async (i) => {
    if (i.customId === "next") {
      // Avançar para a próxima carta
      pageId = (pageId + 1) % totalCards; // Retorna para a primeira carta se for a última
    } else if (i.customId === "previous") {
      // Voltar para a carta anterior
      pageId = (pageId - 1 + totalCards) % totalCards; // Vai para a última carta se estiver na primeira
    } else if (i.customId === "quit") {
      // Encerrar a interação
      activeInteractions.delete(discordID);
      await i.update({
        content: "Saída realizada com sucesso.",
        embeds: [],
        components: [],
      });
      collector.stop();
      await wait(1000);
      await i.deleteReply();
      return;
    }

    // Obter a nova carta e atualizar o embed
    const newCard = cards[pageId];
    const cardEmbed = await EmbedController.ShowCard(
      newCard,
      pageId + 1,
      totalCards
    );

    // Atualizar a mensagem com o novo embed
    await i.update({
      embeds: [cardEmbed],
      components: [navButtons],
      ephemeral: true,
    });
  });
}

async function BuyCard(interaction) {
  const userId = interaction.user.id;
  const cardName = interaction.options.getString("card");
  const user = await User.findOne({ where: { discordID: userId } });
  const card = await CardController.getCardByName(cardName);

  const buyGif = new AttachmentBuilder(`${img_folder}/buy.gif`);

  // check if card exists
  await cardExist(card, interaction, userId);

  // check if user has enough money
  if (user.wallet < card.price) {
    await interaction.reply({
      content: "Dinheiro insuficiente!",
    });
    await wait(3000);
    interaction.deleteReply();
    return;
  }

  // check user has space in inventory
  if (user.inventory === user.inventoryLimit) {
    await interaction.reply({
      content: "Inventario cheio!",
    });
    await wait(3000);
    interaction.deleteReply();
    return;
  }

  // buy card
  await CardController.AddCard(userId, cardName);
  user.wallet -= card.price;
  user.inventory += 1;
  await user.save();
  await interaction.reply({
    content: `Compra realizada com sucesso! **Use /fu-card para ver sua nova carta!**`,
    files: [buyGif],
  });
  await wait(3000);
  interaction.deleteReply();
}
async function SellCard(interaction) {
  const userId = interaction.user.id;
  const cardName = interaction.options.getString("card");
  const quantity = interaction.options.getInteger("quantity");
  const user = await User.findOne({ where: { discordID: userId } });
  const card = await CardController.getCardByName(cardName);

  const sellGif = new AttachmentBuilder(`${img_folder}/sell.gif`);

  // check if card exists
  await cardExist(card, interaction, userId);

  // check if user has the card
  const userHasCard = await UserCards.findOne({
    where: { userId: user.id, cardId: card.id },
  });
  if (!userHasCard) {
    await interaction.reply({
      content: "Voce não possui essa carta",
    });
    await wait(3000);
    interaction.deleteReply();
    return;
  }

  // check user has repeated card on inventory
  if (userHasCard.quantity <= 1) {
    await interaction.reply({
      content: "Você precisa ao menos de uma cópia da carta para vendê-la",
    });
    await wait(3000);
    interaction.deleteReply();
    return;
  }

  // sell card
  await CardController.SellCard(userId, cardName, quantity);
  // get money add qty
  const moneyAdded = card.sellValue * quantity;
  await interaction.reply({
    content: `Venda realizada com sucesso! **Você faturou ${moneyAdded} 💸 com a venda!**`,
    files: [sellGif],
  });
  await wait(3000);
  interaction.deleteReply();
}
async function BuyPack(interaction) {
  const userid = interaction.user.id;
  const user = await User.findOne({ where: { discordID: userid } });
  const packName = interaction.options.getString("pack-name");
  const qty = interaction.options.getInteger("quantity");
  const package = await PackageController.getPackageByName(packName);
  const buyGif = new AttachmentBuilder(`${img_folder}/buy.gif`);

  if (!package) {
    await interaction.reply({
      content: "Pacote não encontrado!",
    });
    await wait(3000);
    interaction.deleteReply();
    return;
  }

  if (user.wallet < package.price) {
    await interaction.reply({
      content:
        "Dinheiro insuficiente! Você possui apenas " + user.wallet + " 💸",
    });
    await wait(3000);
    interaction.deleteReply();
    return;
  }

  // buy pack
  await PackageController.BuyPackage(user, package, qty);

  interaction.reply({
    content: `Pacote ${packName} comprado com sucesso! **Use o comando /o-package [nome do pacote] para abrir seu pacote!**`,
    files: [buyGif],
  });
  await wait(3000);
  interaction.deleteReply();
}

module.exports = { findCard, myCards, Collection, BuyCard, SellCard, BuyPack };
