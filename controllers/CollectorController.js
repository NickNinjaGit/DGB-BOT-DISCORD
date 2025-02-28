const EmbedView = require("../views/EmbedView");
const CardService = require("../services/CardService");
const BattleService = require("../services/BattleService");

const User = require("../models/User");

// helper
const Pagination = require("../helpers/pagination");

const wait = require("node:timers/promises").setTimeout;

const { ChannelType } = require('discord.js');
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
        const skill1Embed = await EmbedView.ShowSkill(card.skill1);
        await i.update({
          embeds: [skill1Embed],
          components: [SkillDetails.backRow], // Mostrar botão de "voltar"
          fetchReply: true,
        });
      } else if (i.customId === "skill2Details") {
        const skill2Embed = await EmbedView.ShowSkill(card.skill2);
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
        collector.stop();
      }
    });
    collector.on("end", async () => {
      activeInteractions.delete(discordID);
      await interaction.editReply({
        content: "✅Saida realizada com sucesso.✅",
        components: [],
      });
      await wait(500);
      await interaction.deleteReply();
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
    let userCardsEmbed = await EmbedView.ShowUserCards(
      cardsPerPage,
      pageId,
      totalPages
    );

    collector.on("collect", async (i) => {
      if (i.customId === "next") {
        pageId = pageId >= totalPages ? 1 : pageId + 1; // Volta para a primeira página se for a último
        cardsPerPage = await Pagination(pageId, 3, cardList);
        userCardsEmbed = await EmbedView.ShowUserCards(
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
        userCardsEmbed = await EmbedView.ShowUserCards(
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
        collector.stop();
      }
    });
    collector.on("end", async () => {
      activeInteractions.delete(discordID);
      await interaction.editReply({
        content: "✅Saida realizada com sucesso.✅",
        components: [],
      });
      await wait(500);
      await interaction.deleteReply();
    });
    // Configurar o coletor para ouvir interações nos botões
  }
  static async CollectionCollector(
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

    const cards = await CardService.getAllCards();

    collector.on("collect", async (i) => {
      if (i.customId === "next") {
        // Atualiza o índice, garantindo que ele não ultrapasse os limites
        currentCardIndex = (currentCardIndex + 1) % cards.length;

        const currentCard = cards[currentCardIndex];
        const CollectionEmbed = await EmbedView.ShowCollection(
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
        const CollectionEmbed = await EmbedView.ShowCollection(
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
        collector.stop();
      }
    });
    collector.on("end", async () => {
      activeInteractions.delete(discordID);
      await interaction.editReply({
        content: "✅Saida realizada com sucesso.✅",
        components: [],
      });
      await wait(500);
      await interaction.deleteReply();
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
      const ShowPackageInfo = await EmbedView.ShowPackageInfo(discordID);
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
        collector.stop();
      }
    });
    collector.on("end", async () => {
      activeInteractions.delete(discordID);
      await interaction.editReply({
        content: "✅Saida realizada com sucesso.✅",
        components: [],
      });
      await wait(500);
      await interaction.deleteReply();
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
        shopEmbed = await EmbedView.ShowShop(
          cardsPerPage,
          packagesPerPage,
          pageId,
          totalPages
        );
        await i.update({
          embeds: [shopEmbed],
          components: [shopButtons],
        });
      }
      // se o botao for previous, muda para a pagina anterior
      else if (i.customId === "previous") {
        pageId = pageId === 1 ? (pageId = totalPages) : (pageId = pageId - 1); // se a pagina for menor que 1, volta para a ultima
        cardsPerPage = await Pagination(pageId, ItensPerPage, cardList);
        packagesPerPage = await Pagination(pageId, ItensPerPage, packageList);
        shopEmbed = await EmbedView.ShowShop(
          cardsPerPage,
          packagesPerPage,
          pageId,
          totalPages
        );
        await i.update({
          embeds: [shopEmbed],
          components: [shopButtons],
        });
      }
      if (i.customId === "quit") {
        collector.stop();
      }
    });
    collector.on("end", async () => {
      activeInteractions.delete(discordID);
      await interaction.editReply({
        content: "Saida realizada com sucesso.",
        components: [],
      });
      await wait(500);
      await interaction.deleteReply();
    });
  }
  static async StardomCollector(
    interaction,
    discordID,
    card,
    userCard,
    stardomButtons,
    quitButton,
    activeInteractions
  ) {
    const collector = interaction.channel.createMessageComponentCollector({
      filter: (i) => i.user.id === discordID,
      time: 600000, // 10 minuto
    });

    // Configurar o coletor para ouvir interações nos botões
    collector.on("collect", async (i) => {
      let updatedImage;

      if (i.customId === "stardom-default") {
        userCard.currentIMG = card.image;
        updatedImage = card.image;
        await userCard.save();
        i.update({
          embeds: [
            await EmbedView.getUpdatedEmbed(
              updatedImage,
              "Moldura Padrão aplicada."
            ),
          ],
          components: [stardomButtons, quitButton],
        });
        return;
      }

      if (i.customId === "stardom-bronze") {
        updatedImage = await CardService.ChangeStardomImage(
          userCard,
          card,
          "/e_sepia/e_colorize:30,co_rgb:ff7700/bo_5px_solid_rgb:ff8000/"
        );
        i.update({
          embeds: [
            await EmbedView.getUpdatedEmbed(
              updatedImage,
              "✅Moldura de bronze aplicada.✅"
            ),
          ],
          components: [stardomButtons, quitButton],
        });
        return;
      }

      if (i.customId === "stardom-silver") {
        updatedImage = await CardService.ChangeStardomImage(
          userCard,
          card,
          "/e_sepia/e_colorize:30,co_rgb:8a8680/bo_5px_solid_rgb:8a8680/"
        );
        i.update({
          embeds: [
            await EmbedView.getUpdatedEmbed(
              updatedImage,
              "✅Moldura de prata aplicada.✅"
            ),
          ],
          components: [stardomButtons, quitButton],
        });
        return;
      }
      if (i.customId === "stardom-gold") {
        updatedImage = await CardService.ChangeStardomImage(
          userCard,
          card,
          "/e_sepia/e_colorize:30,co_rgb:fff700/bo_5px_solid_rgb:fff700/"
        );
        i.update({
          embeds: [
            await EmbedView.getUpdatedEmbed(
              updatedImage,
              "✅Moldura de ouro aplicada.✅"
            ),
          ],
          components: [stardomButtons, quitButton],
        });
        return;
      }
      if (i.customId === "stardom-iridium") {
        updatedImage = await CardService.ChangeStardomImage(
          userCard,
          card,
          "/e_sepia/e_colorize:30,co_rgb:ff00e1/bo_5px_solid_rgb:883db8/"
        );
        i.update({
          embeds: [
            await EmbedView.getUpdatedEmbed(
              updatedImage,
              "✅Moldura de irídio aplicada.✅"
            ),
          ],
          components: [stardomButtons, quitButton],
        });
        return;
      }

      if (i.customId === "quit") {
        collector.stop();
        return;
      }
    });
    collector.on("end", async () => {
      activeInteractions.delete(discordID);
      await interaction.editReply({
        content: "✅Saida realizada com sucesso.✅",
        components: [],
      });
      await wait(500);
      await interaction.deleteReply();
    });
  }
  static async StartBattleCollector(
    interaction,
    challenge,
    challengedUser,
    turnosQty,
    discordID,
    activeInteractions
  ) 
  {
    const filter = (reaction, user) => {
      if (user.bot) return false; // Impede que bots ativem a reação

      if (reaction.emoji.name === "👍" && challengedUser.id === user.id)
        return true;
      if (reaction.emoji.name === "👎" && challengedUser.id === user.id)
        return true;
      if (reaction.emoji.name === "❌" && user.id === discordID) return true;

      return false; // Se não for nenhuma das opções, retorna falso
    };
    const collector = challenge.createReactionCollector({
      filter,
      time: 300000, //5 minutos
    });

    collector.on("collect", async (reaction) => {
      if (reaction.emoji.name === "👍") {
        await interaction.editReply({
          content: `<@${challengedUser.id}> aceitou o desafio! Acesse o tópico criado para entrar esse duelo!`,
        });

        // defina que os usuários estão em batalha
        const user1 = await User.findOne({ where: { discordID: discordID } });
        const user2 = await User.findOne({
          where: { discordID: challengedUser.id },
        });
        //user1.IsInBattle = true;
        //user2.IsInBattle = true;
        //await user1.save();
        //await user2.save();
        const hostUser = interaction.user
        const channel = await interaction.fetchReply();
        // Criar a thread a partir da mensagem de resposta
        const thread = await channel.channel.threads.create({
          name: `${hostUser.username} vs ${challengedUser.username}`,
          autoArchiveDuration: 1440, // 24 horas (1440 minutos)
          reason: "Tópico para separar as batalhas",
          type: ChannelType.PrivateThread,
        });
        await thread.members.add(discordID);
        await thread.members.add(challengedUser.id);
        await wait(1000);
        collector.stop();
        activeInteractions.delete(discordID);
        // inicie o setup da batalha
        await BattleService.BattleSetup(user1, user2, thread, turnosQty, hostUser, challengedUser);
        await wait(3000);
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
};
