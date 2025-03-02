const wait = require("node:timers/promises").setTimeout;
module.exports = async function checkAfkOrForfeit(
  channel,
  thread,
  action,
  user1,
  user2,
  BattleOrder
) {
  const timer = 15000;
  switch (action) {
    case "AfkAttacker":
      await thread.delete();
      const AfkAttackerMsg = await channel.send({
        content: `** <@${BattleOrder.currentAttacker.discordID}> ficou AFK por muito tempo. Vitória de <@${BattleOrder.currentDefensor.discordID}>!**`,
      });
      await wait(timer);
      await AfkAttackerMsg.delete();
      return true;

    case "AfkDefensor":
      await thread.delete();
      const AfkDefensorMsg = await channel.send({
        content: `**<@${BattleOrder.currentDefensor.discordID}> ficou AFK por muito tempo. Vitória de <@${BattleOrder.currentAttacker.discordID}>!**`,
      });
      await wait(timer);
      await AfkDefensorMsg.delete();
      return true;


    case BattleOrder.currentAttacker.name:
      await thread.delete();
      const AttackerForfeitMsg = await channel.send({
        content: `**Luta de ${user1.name} e ${user2.name} finalizada por desistência. Vitória de <@${BattleOrder.currentDefensor.discordID}>!**`,
      });
      await wait(timer);
      await AttackerForfeitMsg.delete();
      return true;


    case BattleOrder.currentDefensor.name:
      await thread.delete();
      const DefensorForfeitMsg = await channel.send({
        content: `**Luta de ${user1.name} e ${user2.name} finalizada por desistência. Vitória de <@${BattleOrder.currentAttacker.discordID}>!**`,
      });
      await wait(timer);
      await DefensorForfeitMsg.delete();
      return true;
  }
};
