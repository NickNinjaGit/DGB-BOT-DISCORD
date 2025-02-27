const wait = require("node:timers/promises").setTimeout;
module.exports = async function checkAfkOrForfeit(
  channel,
  thread,
  action,
  user1,
  user2,
  BattleOrder
) {
  switch (action) {
    case "AfkAttacker":
      await thread.delete();
      const AfkAttackerMsg = await channel.send({
        content: `** ${BattleOrder.currentAttacker.name} ficou AFK por muito tempo. Vitória de ${BattleOrder.currentDefensor.name}!**`,
      });
      await wait(3000);
      await AfkAttackerMsg.delete();
      return true;

    case "AfkDefensor":
      await thread.delete();
      const AfkDefensorMsg = await channel.send({
        content: `**${BattleOrder.currentDefensor.name} ficou AFK por muito tempo. Vitória de ${BattleOrder.currentAttacker.name}!**`,
      });
      await wait(3000);
      await AfkDefensorMsg.delete();
      return true;


    case BattleOrder.currentAttacker.name:
      await thread.delete();
      const AttackerForfeitMsg = await channel.send({
        content: `**Luta de ${user1.name} e ${user2.name} finalizada por desistência. Vitória de ${BattleOrder.currentDefensor.name}!**`,
      });
      await wait(3000);
      await AttackerForfeitMsg.delete();
      return true;


    case BattleOrder.currentDefensor.name:
      await thread.delete();
      const DefensorForfeitMsg = await channel.send({
        content: `**Luta de ${user1.name} e ${user2.name} finalizada por desistência. Vitória de ${BattleOrder.currentAttacker.name}!**`,
      });
      await wait(3000);
      await DefensorForfeitMsg.delete();
      return true;
  }
};
