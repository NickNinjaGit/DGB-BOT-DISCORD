const ButtonView = require("../views/ButtonView");
const EmbedView = require("../views/EmbedView");
const CardService = require("./CardService");
const wait = require("node:timers/promises").setTimeout;

const User = require("../models/User");

// handlers
const checkFirstTurnPlayer = require("../handlers/battle/check-first-turn-player");
const BattleActionCollector = require("../handlers/battle/battle-action-collector");
const checkAfkOrForfeit = require("../handlers/battle/check-afk-or-forfeit");
const resetAtributes = require("../handlers/battle/reset-atributes");
const BattleActionHandler = require("../handlers/battle/battle-action-handler");

module.exports = class BattleService {
  static async BattleSetup(
    user1,
    user2,
    thread,
    turnosQty,
    battleCallUser,
    challengedUser
  ) {
    const getUserCardChoice = (user) => {
      return new Promise((resolve) => {
        const collector = thread.createMessageCollector({
          filter: (m) => m.author.id === user.discordID,
          time: 600000, // 5 min para responder
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
            await thread.send({
              content: `🃏**<@${user.discordID}> escolheu a carta ${choicedCard.name}**🃏`,
            });
            await thread.send({
              content: `-----------------------------------`,
            });
            resolve(choicedCard);
            collector.stop();
          }
        });

        collector.on("end", (reason) => {
          if (reason === "time") {
            battleCallUser.send(
              "❌**A batalha foi cancelada pois uma das partes não escolheu sua carta.**❌"
            );
            challengedUser.send(
              "❌**A batalha foi cancelada pois uma das partes não escolheu sua carta.**❌"
            );
            resolve(null);
          }
        });
      });
    };
    const user1Message = await thread.send({
      content: `⬆️<@${user1.discordID}> escolha a sua carta.⬆️`,
    });
    let user1Card = await getUserCardChoice(user1);
    if (user1Card === null) return;
    user1Message.delete();
    await thread.send({
      content: `⬆️<@${user2.discordID}> escolha a sua carta.⬆️`,
    });
    let user2Card = await getUserCardChoice(user2);
    if (user2Card === null) return;

    const userCardEmbed1 = await EmbedView.ShowBattleCard(user1Card);
    const userCardEmbed2 = await EmbedView.ShowBattleCard(user2Card);
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
    /*await thread.send({ content: `5...` });
    await wait(1000);
    await thread.send({ content: `4...` });
    await wait(1000);
    await thread.send({ content: `3...` });
    await wait(1000);
    await thread.send({ content: `2...` });
    await wait(1000);
    await thread.send({ content: `1...` });
    await wait(1000);
    
*/
    const messages = await thread.messages.fetch({ limit: 100 });
    await thread.bulkDelete(messages);
    await resetAtributes(user1Card, user2Card);
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
    let cardEmbedA = await EmbedView.ShowBattleCard(cardA);
    let cardEmbedB = await EmbedView.ShowBattleCard(cardB);
    const battleButtons = await ButtonView.BattleButtons();

    const channel = thread.parent;

    while (turns < turnosQty && cardA.currentHP > 0 && cardB.currentHP > 0) {
      //check who starts turn
      const BattleOrder = await checkFirstTurnPlayer(
        cardA,
        cardB,
        turns,
        turnosQty,
        user1,
        user2,
        cardEmbedA,
        cardEmbedB,
        battleButtons,
        thread
      );
      const AttackerAction =
        await BattleActionCollector.BattleAttackerCollector(
          thread,
          BattleOrder.currentAttacker,
          BattleOrder.currentDefensor.name,
          user1,
          cardA,
          cardB,
          cardEmbedA,
          cardEmbedB
        );
        console.log("Ação esperada:", AttackerAction);
      const AttackerAFKorForfeit = await checkAfkOrForfeit(
        channel,
        thread,
        AttackerAction,
        user1,
        user2,
        BattleOrder
      );
      if (AttackerAFKorForfeit) {
        turns === 0 ? (turns = 1) : (turns += 1);
        const forfeitCurrency = turns * 10;
        const winner = await User.findOne({
          where: { id: BattleOrder.currentAttacker.id },
        });

        winner.wallet += forfeitCurrency;
        await winner.save();
        await resetAtributes(cardA, cardB);
        user1.IsInBattle = false;
        user2.IsInBattle = false;
        user1.save();
        user2.save();
        const moneyDefensorMsg = await channel.send({
          content: `**<@${BattleOrder.currentDefensor.discordID}> recebeu ${forfeitCurrency} moedas pela vitória.**`,
        });
        await wait(10000);
        await moneyDefensorMsg.delete();
        break;
      }
      const DefensorAction =
        await BattleActionCollector.BattleDefensorCollector(
          thread,
          BattleOrder.currentDefensor,
          BattleOrder.currentAttacker.name,
          user1,
          cardA,
          cardB,
          cardEmbedA,
          cardEmbedB
        );
      const DefensorAFKorForfeit = await checkAfkOrForfeit(
        channel,
        thread,
        DefensorAction,
        user1,
        user2,
        BattleOrder
      );
      if (DefensorAFKorForfeit) {
        turns === 0 ? (turns = 1) : (turns += 1);
        const forfeitCurrency = turns * 10;
        const winner = await User.findOne({
          where: { id: BattleOrder.currentDefensor.id },
        });
        winner.wallet += forfeitCurrency;
        await winner.save();

        await resetAtributes(cardA, cardB);
        user1.IsInBattle = false;
        user2.IsInBattle = false;
        user1.save();
        user2.save();
        const moneyAttackerMsg = await channel.send({
          content: `**<@${BattleOrder.currentAttacker.discordID}> recebeu ${forfeitCurrency} moedas pela vitória.**`,
        });
        await wait(10000);
        await moneyAttackerMsg.delete();
        break;
      }

      const ActionResponse = await BattleActionHandler(
        AttackerAction,
        DefensorAction,
        BattleOrder.currentAttacker,
        BattleOrder.currentAttackerCard,
        BattleOrder.currentDefensor,
        BattleOrder.currentDefensorCard,
        cardA,
        cardB
      );
      // pega os dados atualizados no banco
      cardA = await CardService.getUserCardByName(
        BattleOrder.currentAttacker,
        cardA.name
      );
      cardB = await CardService.getUserCardByName(
        BattleOrder.currentDefensor,
        cardB.name
      );

      // Gera novas embeds com os valores atualizados
      cardEmbedA = await EmbedView.ShowBattleCard(cardA);
      cardEmbedB = await EmbedView.ShowBattleCard(cardB);

      await thread.send({
        content: `${ActionResponse}`,
      });
      await thread.send({
        content: `-----------------------------------`,
      });
      await thread.send({
        content: `-----------------------------------`,
      });
      // determinar o vencedor se chegar no fim da batalha
      if (cardA.currentHP <= 0 || cardB.currentHP <= 0) {
        console.log("Vitória por HP");
      } else if (turns === turnosQty) {
        console.log("Vitória por TURNOS");
      }
      turns++;
    }
  }
};
