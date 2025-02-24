const ButtonController = require("./ButtonController");
const CardController = require("./CardController");
const EmbedController = require("./EmbedController");
const wait = require("node:timers/promises").setTimeout;

module.exports = class BattleController {
  static async BattleSetup(user1, user2, thread, turnosQty) {
    // TODO
    // ENVIAR UMA MENSAGEM PEDINDO AO USUARIO 1 DIGITAR A CARTA QUE DESEJA USAR
    const getUserCardChoice = (user) => {
      return new Promise((resolve) => {
        const collector = thread.createMessageCollector({
          filter: (m) => m.author.id === user.discordID,
          time: 300000, // 5 min para responder
        });

        collector.on("collect", async (msg) => {
          const cardName = msg.content;
          const choicedCard = await CardController.getUserCardByName(
            user,
            cardName
          );

          if (!choicedCard) {
            await thread.send({
              content: `**❌<@${user.discordID}> escolha uma opção válida! Caso não saiba suas cartas, use /my-cards**❌`,
            });
          } else {
            const response = await thread.send({
              content: `🃏**<@${user.discordID}> escolheu a carta ${choicedCard.name}**🃏`,
            });
            await wait(1000);
            await response.delete();
            resolve(choicedCard);
            collector.stop();
          }
        });

        collector.on("end", () => {
          resolve(null);
        });
      });
    };
    const user1Message = await thread.send({
      content: `⬆️<@${user1.discordID}> escolha a sua carta.⬆️`,
    });
    const user1Card = await getUserCardChoice(user1);
    user1Message.delete();
    await thread.send({
      content: `⬆️<@${user2.discordID}> escolha a sua carta.⬆️`,
    });
    const user2Card = await getUserCardChoice(user2);

    const userCardEmbed1 = await EmbedController.ShowBattleCard(user1Card);
    const userCardEmbed2 = await EmbedController.ShowBattleCard(user2Card);
    await thread.send({
      embeds: [userCardEmbed1],
      content: `# 🃏Carta de ${user1.name}🃏`,
    });
    await wait(1500);
    await thread.send({
      embeds: [userCardEmbed2],
      content: `# 🃏Carta de ${user2.name}🃏`,
    });
    await wait(500);
    await thread.send({
      content: `# ⚔️Iniciando o combate entre ${user1.name} (${user1Card.name}) e ${user2.name} (${user2Card.name})⚔️`,
    });

    // clean chat
    await thread.send({ content: `5...` });
    await wait(1000);
    await thread.send({ content: `4...` });
    await wait(1000);
    await thread.send({ content: `3...` });
    await wait(1000);
    await thread.send({ content: `2...` });
    await wait(1000);
    await thread.send({ content: `1...` });
    await wait(1000);
    const messages = await thread.messages.fetch({ limit: 100 });

    await thread.bulkDelete(messages);

    await this.BattleFlow(
      user1,
      user1Card,
      user2,
      user2Card,
      thread,
      turnosQty
    );
  }

  static async BattleFlow(user1, cardA, user2, cardB, thread, turnosQty) {
    let turns = 0;
    const cardEmbedA = await EmbedController.ShowBattleCard(cardA);
    const cardEmbedB = await EmbedController.ShowBattleCard(cardB);
    const battleButtons = await ButtonController.BattleButtons();
    // check if cardA have same speed of B

    while (turns !== turnosQty || cardA.currentHP > 0 || cardB.currentHP > 0) {
        let currentUser = null;

        if (cardA.currentSPEED === cardB.currentSPEED) {
          const random = Math.floor(Math.random() * 100);
        
          if (random % 2 === 0) {
            currentUser = user1;
            const battleMessage = await thread.send({
              embeds: [cardEmbedA],
              components: [battleButtons],
            });
        
        
            await thread.send({
              content: `# Turno ${turns + 1} de ${turnosQty}, vez de ${user1.name}`,
            });
            await thread.send({
                content: `💨**As cartas ${cardA.name} e ${cardB.name} têm a mesma velocidade. Por decisão do bot, será a vez de ${user1.name} primeiro 💨**`,
              });
        
            console.log(`Turno do usuário: ${currentUser.name} (${currentUser.discordID})`);
        
            // Criar coletor na própria mensagem com botões
            await new Promise((resolve) => {
              const collector = battleMessage.createMessageComponentCollector({
                filter: (i) => {
                  console.log(`Usuário que interagiu: ${i.user.id}, esperado: ${currentUser.discordID}`);
                  return i.user.id === currentUser.discordID;
                },
                time: 300000, // 5 min para responder
              });
        
              collector.on("collect", async (interaction) => {
                console.log(`Interação recebida: ${interaction.customId}`);
                if (interaction.customId === "attack") {
                  await interaction.reply({
                    content: `# Teste ataque`,
                    ephemeral: true, // Torna a resposta visível apenas para o usuário
                  });
        
                  resolve(interaction);
                  collector.stop();
                }
              });
        
              collector.on("end", (collected, reason) => {
                if (reason === "time") {
                  console.log(`⏳ Tempo esgotado para ${currentUser.name}`);
                  thread.send({
                    content: `⚠️ ${currentUser.name} não respondeu a tempo!`,
                  });
                }
              });
            });
        
          } else {
            currentUser = user2;
            const battleMessage = await thread.send({
              embeds: [cardEmbedB],
              components: [battleButtons],
            });
        
            await thread.send({
              content: `# Turno ${turns + 1} de ${turnosQty}, vez de ${user2.name}`,
            });
            await thread.send({
                content: `💨**As cartas ${cardA.name} e ${cardB.name} têm a mesma velocidade. Por decisão do bot, será a vez de ${user2.name} primeiro 💨**`,
              });
        
            console.log(`Turno do usuário: ${currentUser.name} (${currentUser.discordID})`);
        
            // Criar coletor na mensagem dos botões
            await new Promise((resolve) => {
              const collector = battleMessage.createMessageComponentCollector({
                filter: (i) => {
                  console.log(`Usuário que interagiu: ${i.user.id}, esperado: ${currentUser.discordID}`);
                  return i.user.id === currentUser.discordID;
                },
                time: 300000,
              });
        
              collector.on("collect", async (interaction) => {
                console.log(`Interação recebida: ${interaction.customId}`);
                if (interaction.customId === "attack") {
                  await interaction.reply({
                    content: `# Teste ataque`,
                    ephemeral: true,
                  });
        
                  resolve(interaction);
                  collector.stop();
                }
              });
        
              collector.on("end", (reason) => {
                if (reason === "time") {
                  thread.send({
                    content: `⚠️ ${currentUser.name} não respondeu a tempo! Vitória por desconexão concedida para ao adversário!`,
                  });
                }
              });
            });
          }
        }
        
      }

    const firstTurnPlayer = cardA.SPEED > cardB.SPEED ? cardA : cardB;
      if (firstTurnPlayer === cardA) {
        await thread.send({
          content: `@${user1.name} vai iniciar o combate por ter maior velocidade`,
        });
        await thread.send({
          content: `# Turno ${turns + 1} de ${turnosQty} vez de @${user1.name}`,
        });
        await thread.send(
          { embeds: [cardEmbedA] },
          { content: `O que você deseja fazer?` }
        );
      } else if (firstTurnPlayer === cardB) {
        await thread.send({
          content: `@${user2.name} vai iniciar o combate por ter maior velocidade`,
        });
        await thread.send({
          content: `# Turno ${turns + 1} de ${turnosQty} vez de @${user2.name}`,
        });
        await thread.send(
          { embeds: [cardEmbedB] },
          { content: `O que você deseja fazer?` }
        );
      } 
    }
  }

