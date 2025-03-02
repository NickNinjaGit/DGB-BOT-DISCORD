const ButtonView = require("../views/ButtonView");
const EmbedView = require("../views/EmbedView");
const CardService = require("./CardService");
const wait = require("node:timers/promises").setTimeout;

const User = require("../models/User");

// handlers
const checkFirstTurnPlayer = require("../handlers/battle/check-first-turn-player");
const BattleActionCollector = require("../handlers/battle/battle-action-collector");
const calculateDamage = require("../handlers/battle/calculate-damage");
const checkAfkOrForfeit = require("../handlers/battle/check-afk-or-forfeit");
const resetAtributes = require("../handlers/battle/reset-atributes");

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

      const ActionResponse = await this.BattleActionHandler(
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
  static async BattleActionHandler(
    AttackerAction,
    DefensorAction,
    currentAttacker,
    currentAttackerCard,
    currentDefensor,
    currentDefensorCard,
    cardA,
    cardB
  ) {
    /* Casos de ataque vindo de user1 */
    let response = null;

    // ATACK A VS ATACK B vice versa
    if (AttackerAction === "attack" && DefensorAction === "attack") {
      const damageA = await calculateDamage.ApplyDamage(cardA.currentATK);
      const damageB = await calculateDamage.ApplyDamage(cardB.currentATK);
      cardA.currentHP -= damageB;
      cardB.currentHP -= damageA;
      await CardService.saveUserCardChanges(currentAttacker.id, cardA.cardId, {
        currentHP: cardA.currentHP,
      });
      await CardService.saveUserCardChanges(currentDefensor.id, cardB.cardId, {
        currentHP: cardB.currentHP,
      });

      response = `**🗡️Os dois atacaram, ${cardA.name} (${currentAttacker.name}) tomou ${damageA} de dano e ${cardB.name} (${currentDefensor.name}) tomou ${damageB} de dano.** 🗡️ `;
      return response;
    }
    // ATACK A VS DEFENSE B
    if (AttackerAction === "attack" && DefensorAction === "defend") {
      const damageA = await calculateDamage.ApplyDamage(
        currentAttackerCard.currentATK
      );
      const reducedDamageB = await calculateDamage.Defend(
        currentDefensorCard.currentDEF,
        damageA
      );
      currentDefensorCard.currentHP -= reducedDamageB;

      await CardService.saveUserCardChanges(
        currentDefensor.id,
        currentDefensorCard.cardId,
        {
          currentHP: currentDefensorCard.currentHP,
        }
      );

      response = `**🛡️${currentDefensorCard.name} (${currentDefensor.name}) defendeu o ataque, tomando ${reducedDamageB} de dano.** 🛡️ `;
      console.log("Respota", response);
      return response;
    }
    // ATACK A VS DODGE B
    if (AttackerAction === "attack" && DefensorAction === "dodge") {
      const damageA = await calculateDamage.ApplyDamage(
        currentAttackerCard.currentATK
      );
      const dodgedDamageB = await calculateDamage.Dodge(
        currentDefensorCard.currentSPEED,
        damageA
      );
      currentDefensorCard.currentHP -= dodgedDamageB;

      await CardService.saveUserCardChanges(
        currentDefensor.id,
        currentDefensorCard.cardId,
        {
          currentHP: currentDefensorCard.currentHP,
        }
      );

      if (dodgedDamageB === 0) {
        response = `🏃**${currentDefensorCard.name} (${currentDefensor.name}) esquivou do ataque, anulando completamente o dano!**🏃`;
        return response;
      } else {
        response = `💥**${currentDefensorCard.name} (${currentDefensor.name}) falhou em esquivar do ataque tomando o dobro de dano. (dano: ${dodgedDamageB})**💥`;
        return response;
      }
    }

    /* Casos de ataque vindo de user2 */
    // ATACK B VS DEFENSE A
    if (AttackerAction === "defend" && DefensorAction === "attack") {
      const damageB = await calculateDamage.ApplyDamage(
        currentDefensorCard.currentATK
      );
      const reducedDamageA = await calculateDamage.Defend(
        currentAttackerCard.currentDEF,
        damageB
      );
      currentAttackerCard.currentHP -= reducedDamageA;

      await CardService.saveUserCardChanges(
        currentAttacker.id,
        currentAttackerCard.cardId,
        {
          currentHP: currentAttackerCard.currentHP,
        }
      );

      response = `**🛡️${currentAttackerCard.name} (${currentAttacker.name}) previu o ataque de ${currentDefensorCard.name} (${currentDefensor.name}), recebendo ${reducedDamageA} de dano.** 🛡️ `;
      console.log("Respota", response);
      return response;
    }

    // ATACK B VS DODGE A
    if (AttackerAction === "dodge" && DefensorAction === "attack") {
      const damageB = await calculateDamage.ApplyDamage(
        currentDefensorCard.currentATK
      );
      const dodgedDamageA = await calculateDamage.Dodge(
        currentAttackerCard.currentSPEED,
        damageB
      );
      currentDefensorCard.currentHP -= dodgedDamageA;

      await CardService.saveUserCardChanges(
        currentAttacker.id,
        currentAttackerCard.cardId,
        {
          currentHP: currentAttackerCard.currentHP,
        }
      );

      if (dodgedDamageA === 0) {
        response = `🏃**${currentAttackerCard.name} (${currentAttacker.name}) preveu uma esquiva, anulando completamente o dano!**🏃`;
        return response;
      } else {
        response = `💥**${currentAttackerCard.name} (${currentAttacker.name}) falhou em esquivar do ataque tomando o dobro de dano. (dano: ${dodgedDamageA})**💥`;
        return response;
      }
    }
    /* Casos de nada acontecer */
    // DEFENSE A VS DEFENSE B
    // DEFESNE A VS DODGE B
    // DODGE A VS DEFENSE B
    // DODGE A VS DODGE B

    // DEFENSE B VS DEFENSE A
    // DEFENSE B VS DODGE A
    // DODGE B VS DEFENSE A
    // DODGE B VS DODGE A
    if (
      (AttackerAction === "defend" && DefensorAction === "dodge") ||
      (AttackerAction === "dodge" && DefensorAction === "defend") ||
      (AttackerAction === "dodge" && DefensorAction === "dodge") ||
      (AttackerAction === "defend" && DefensorAction === "defend")
    ) {
      response = `**🤡${currentAttacker.name} e ${currentDefensor.name} tentaram esquivar ou defender ao mesmo tempo, então nada aconteceu!🤡**`;
      return response;
    }
  }
};
