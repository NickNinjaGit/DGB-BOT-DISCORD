const calculateDamage = require("./calculate-damage");
const CardService = require("../../services/CardService");
const SkillActionHandler = require("./skill-action-handler");
module.exports = async function BattleActionHandler(
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
      currentAttackerCard.currentHP -= dodgedDamageA;

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
    /* Skill cases*/
    if (AttackerAction === "skill1" || DefensorAction === "skill1" || AttackerAction === "skill2" || DefensorAction === "skill2") {
        response = await SkillActionHandler(AttackerAction, DefensorAction, currentAttacker, currentDefensor, currentAttackerCard, currentDefensorCard);
        return response;
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