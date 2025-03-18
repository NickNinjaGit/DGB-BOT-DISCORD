const CardService = require("../../services/CardService");
const ButtonView = require("../../views/ButtonView");
const skillRenderHandler = require("./skill-render-handler");

module.exports = async function checkFirstTurnPlayer(
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
) {
  // check if cards have the same speed
  if (cardA.currentSPEED === cardB.currentSPEED) {
    const random = Math.floor(Math.random() * 100);

    // if odd, user1 goes first
    if (random % 2 === 0) {
      const currentAttacker = user1;
      const currentAttackerCard = await CardService.getUserCardByName(
        user1,
        cardA.name
      );
      const skillsButtons = await ButtonView.BattleSkillsButtons(
        cardA.skill1,
        cardA.skill2
      );
      const currentDefensor = user2;
      const currentDefensorCard = await CardService.getUserCardByName(
        user2,
        cardB.name
      );
      // check if player has mana to use skill
      const attackerManaStatus = cardA.currentMANA;
      const checkManaStatus = await skillRenderHandler.checkManaStatus(
        attackerManaStatus,
        cardA.skill1,
        cardA.skill2
      );
      const SkillButtonRender = await skillRenderHandler.SkillButtonRender(
        checkManaStatus,
        skillsButtons
      );
      await skillRenderHandler.AttackerSkillButtonResolve(
        SkillButtonRender,
        thread,
        cardEmbedA,
        battleButtons
      );
      await thread.send({
        content: `# Turno ${turns + 1} de ${turnosQty}, vez de ${user1.name}`,
      });
      await thread.send({
        content: `💨**As cartas ${cardA.name} e ${cardB.name} têm a mesma velocidade. Por decisão do bot, será a vez de ${user1.name}. 💨**`,
      });

      console.log(
        `Turno do usuário: ${currentAttacker.name} (${currentAttacker.discordID})`
      );
      return {
        currentAttacker,
        currentAttackerCard,
        currentDefensor,
        currentDefensorCard,
      };
    }
    // if even, user2 goes first
    else {
      const currentAttacker = user2;
      const currentAttackerCard = await CardService.getUserCardByName(
        user2,
        cardB.name
      );
      const skillsButtons = await ButtonView.BattleSkillsButtons(
        cardB.skill1,
        cardB.skill2
      );
      const currentDefensor = user1;
      const currentDefensorCard = await CardService.getUserCardByName(
        user1,
        cardA.name
      );
      const attackerManaStatus = cardB.currentMANA;
      const checkManaStatus = await skillRenderHandler.checkManaStatus(
        attackerManaStatus,
        cardB.skill1,
        cardB.skill2
      );
      const SkillButtonRender = await skillRenderHandler.SkillButtonRender(
        checkManaStatus,
        skillsButtons
      );
      await skillRenderHandler.AttackerSkillButtonResolve(
        SkillButtonRender,
        thread,
        cardEmbedB,
        battleButtons
      );
      await thread.send({
        content: `# Turno ${turns + 1} de ${turnosQty}, vez de ${user2.name}`,
      });
      await thread.send({
        content: `💨**As cartas ${cardA.name} e ${cardB.name} têm a mesma velocidade. Por decisão do bot, será a vez de ${user2.name}. 💨**`,
      });

      console.log(
        `Turno do usuário: ${currentAttacker.name} (${currentAttacker.discordID})`
      );
      return {
        currentAttacker,
        currentAttackerCard,
        currentDefensor,
        currentDefensorCard,
      };
    }
  } else {
    const firstPlayer = cardA.currentSPEED > cardB.currentSPEED ? cardA : cardB;
    if (firstPlayer === cardA) {
      const currentAttacker = user1;
      const currentAttackerCard = await CardService.getUserCardByName(
        user1,
        cardA.name
      );
      const skillsButtons = await ButtonView.BattleSkillsButtons(
        cardA.skill1,
        cardA.skill2
      );
      const currentDefensor = user2;
      const currentDefensorCard = await CardService.getUserCardByName(
        user2,
        cardB.name
      );
      const attackerManaStatus = cardA.currentMANA;
      const checkManaStatus = await skillRenderHandler.checkManaStatus(
        attackerManaStatus,
        cardA.skill1,
        cardA.skill2
      );
      const SkillButtonRender = await skillRenderHandler.SkillButtonRender(
        checkManaStatus,
        skillsButtons
      );
      await skillRenderHandler.AttackerSkillButtonResolve(
        SkillButtonRender,
        thread,
        cardEmbedA,
        battleButtons
      );
      await thread.send({
        content: `💨**${cardA.name} possui maior velocidade.**💨`,
      });
      await thread.send({
        content: `# Turno ${turns + 1} de ${turnosQty} vez de @${user1.name}`,
      });

      return {
        currentAttacker,
        currentAttackerCard,
        currentDefensor,
        currentDefensorCard,
      };
    } else if (firstPlayer === cardB) {
      const currentAttacker = user2;
      const currentAttackerCard = await CardService.getUserCardByName(
        user2,
        cardB.name
      );
      const currentDefensor = user1;
      const currentDefensorCard = await CardService.getUserCardByName(
        user1,
        cardA.name
      );
      const skillsButtons = await ButtonView.BattleSkillsButtons(
        cardB.skill1,
        cardB.skill2
      );
      const attackerManaStatus = cardB.currentMANA;
      const checkManaStatus = await skillRenderHandler.checkManaStatus(
        attackerManaStatus,
        cardB.skill1,
        cardB.skill2
      );
      const SkillButtonRender = await skillRenderHandler.SkillButtonRender(
        checkManaStatus,
        skillsButtons
      );
      await skillRenderHandler.AttackerSkillButtonResolve(
        SkillButtonRender,
        thread,
        cardEmbedB,
        battleButtons
      );
      await thread.send({
        content: `💨**${user2.name} possui maior velocidade.**💨`,
      });
      await thread.send({
        content: `# Turno ${turns + 1} de ${turnosQty} vez de @${user2.name}`,
      });

      return {
        currentAttacker,
        currentAttackerCard,
        currentDefensor,
        currentDefensorCard,
      };
    }
  }
};
