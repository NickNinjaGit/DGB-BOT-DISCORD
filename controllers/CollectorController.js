const EmbedController = require("./EmbedController");
const CardController = require("./CardController");

// helper
const Pagination = require("../helpers/pagination");

module.exports = class CollectorController {
  static async CardCollector(
    interaction,
    discordID,
    card,
    cardEmbed,
    SkillDetails,
    activeInteractions
  ) {
    const collector = interaction.channel.createMessageComponentCollector({
      filter: (i) => i.user.id === discordID,
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
        });
      } else if (i.customId === "skill2Details") {
        const skill2Embed = await EmbedController.ShowSkill(card.skill2);
        await i.update({
          embeds: [skill2Embed],
          components: [SkillDetails.backRow], // Mostrar botão de "voltar"
          fetchReply: true,
        });
      } else if (i.customId === "back") {
        await i.update({
          embeds: [cardEmbed],
          components: [SkillDetails.skillRow], // Retornar ao conjunto de habilidades
          fetchReply: true,
        });
      } else if (i.customId === "quit") {
        await activeInteractions.delete(discordID);
        await i.update({
          content: "Saída realizada com sucesso.",
          embeds: [],
          components: [],
          fetchReply: true,
        });
        collector.stop();
        await i.deleteReply();
      }
    });
  }
  static async MyCardsCollector(
    interaction,
    discordID,
    cardList,
    pageId,
    totalPages,
    navButtons,
    activeInteractions
  ) {
    const collector = interaction.channel.createMessageComponentCollector({
      filter: (i) => i.user.id === discordID,
      time: 600000, // 10 minuto
    });
    let cardsPerPage = await Pagination(pageId, 3, cardList);
    let userCardsEmbed = await EmbedController.ShowUserCards(
      cardsPerPage,
      pageId,
      totalPages
    );

    collector.on("collect", async (i) => {
      if (i.customId === "next") {
        pageId = pageId >= totalPages ? 1 : pageId + 1; // Volta para a primeira página se for a último
        cardsPerPage = await Pagination(pageId, 3, cardList);
        userCardsEmbed = await EmbedController.ShowUserCards(
          cardsPerPage,
          pageId,
          totalPages
        );
        await i.update({
          embeds: [userCardsEmbed],
          components: [navButtons],
          fetchReply: true,
        });
      } else if (i.customId === "previous") {
        pageId = pageId <= 1 ? totalPages : pageId - 1;
        cardsPerPage = await Pagination(pageId, 3, cardList);
        userCardsEmbed = await EmbedController.ShowUserCards(
          cardsPerPage,
          pageId,
          totalPages
        );
        await i.update({
          embeds: [userCardsEmbed],
          components: [navButtons],
          fetchReply: true,
        });
      } else if (i.customId === "quit") {
        activeInteractions.delete(discordID);
        collector.stop();
        await i.update({
          content: "Interação finalizada.",
          components: [],
          fetchReply: true,
        });
        await i.deleteReply();
      }
    });
    // Configurar o coletor para ouvir interações nos botões
  }
  static async CollectionController(
    interaction,
    discordID,
    currentCardIndex,
    navButtons,
    activeInteractions
  ) {
    const collector = interaction.channel.createMessageComponentCollector({
      filter: (i) => i.user.id === discordID,
      time: 600000, // 10 minutos
    });
  
    const cards = await CardController.getAllCards();
  
    collector.on("collect", async (i) => {
      if (i.customId === "next") {
        // Atualiza o índice, garantindo que ele não ultrapasse os limites
        currentCardIndex = (currentCardIndex + 1) % cards.length;
  
        const currentCard = cards[currentCardIndex];
        const CollectionEmbed = await EmbedController.ShowCollection(
          currentCard,
          currentCardIndex + 1, // Índice atual +1 para exibir como posição
          cards.length
        );
  
        await i.update({
          embeds: [CollectionEmbed],
          components: [navButtons],
          fetchReply: true,
        });
      }
  
      if (i.customId === "previous") {
        // Atualiza o índice, garantindo que ele não fique negativo
        currentCardIndex = (currentCardIndex - 1 + cards.length) % cards.length;
  
        const currentCard = cards[currentCardIndex];
        const CollectionEmbed = await EmbedController.ShowCollection(
          currentCard,
          currentCardIndex + 1, // Índice atual +1 para exibir como posição
          cards.length
        );
  
        await i.update({
          embeds: [CollectionEmbed],
          components: [navButtons],
          fetchReply: true,
        });
      }
  
      if (i.customId === "quit") {
        activeInteractions.delete(discordID);
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
  
  static async ProfileCollector(
    interaction,
    discordID,
    myProfileEmbed,
    profileButtons,
    activeInteractions
  ) {
    const collector = interaction.channel.createMessageComponentCollector({
      filter: (i) => i.user.id === discordID,
      time: 600000, // 10 minuto
    });

    // Configurar o coletor para ouvir interações nos botões
    collector.on("collect", async (i) => {
      const ShowPackageInfo = await EmbedController.ShowPackageInfo(discordID);
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
        activeInteractions.delete(discordID);
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
  static async ShopCollector(
    interaction,
    discordID,
    shopEmbed,
    shopButtons,
    cardList,
    packageList,
    pageId,
    ItensPerPage,
    totalPages,
    cardsPerPage,
    packagesPerPage,
    activeInteractions
  ) {
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

        cardsPerPage = await Pagination(pageId, ItensPerPage, cardList);
        packagesPerPage = await Pagination(pageId, ItensPerPage, packageList);
        shopEmbed = await EmbedController.ShowShop(
          cardsPerPage,
          packagesPerPage,
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
        cardsPerPage = await Pagination(pageId, ItensPerPage, cardList);
        packagesPerPage = await Pagination(pageId, ItensPerPage, packageList);
        shopEmbed = await EmbedController.ShowShop(
          cardsPerPage,
          packagesPerPage,
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
};
