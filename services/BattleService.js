const ButtonController = require("../controllers/ButtonController");
const EmbedController = require("../controllers/EmbedController");
const CardService = require("./CardService");
const wait = require("node:timers/promises").setTimeout;



// helpers
const checkFirstTurnPlayer = require("../helpers/checkFirstTurnPlayer");
const BattleHelper = require("../helpers/BattleHelper");
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
          const choicedCard = await CardService.getUserCardByName(
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
    const forfeitButton = await ButtonController.ForfeitButton();

    while (turns < turnosQty && cardA.currentHP > 0 && cardB.currentHP > 0) {
      //check who starts turn
      const BattleOrder = await checkFirstTurnPlayer(cardA, cardB, turns, turnosQty, user1, user2, cardEmbedA, cardEmbedB, battleButtons, forfeitButton, thread);
      const AttackerAction = await BattleHelper.BattleAttackerCollector(thread, BattleOrder.currentAttacker);
      console.log("Ação do Atacante: " + AttackerAction);
      const DefenderAction = await BattleHelper.BattleDefenderCollector(thread, BattleOrder.currentDefender, user1, cardEmbedA, cardEmbedB);
      console.log("Defensor respondeu com: " + DefenderAction);
      console.log("FIM DO CICLO! PARABENS!")

      
      turns++;
  
      
    }
  }
};
