// models
const User = require("../../models/User");

//helpers
const isAdmin = require("../../helpers/isAdmin");
const wait = require("node:timers/promises").setTimeout;

/* Admin Relational interactions */
async function addCash(interaction) {
  const userId = interaction.user.id;
  const Isadmin = await isAdmin(userId);
 
  if (Isadmin === false) {
    interaction.reply({
      content: "Você não tem permissão para executar esse comando",
    });
    await wait(3000);
    interaction.deleteReply();
    return;
  }
  // get money to give and target user
  const targetUser = interaction.options.getUser("user");
  if(targetUser.bot) {
    interaction.reply({
      content: "Bots não podem receber dinheiro",

    });
    await wait(3000);
    interaction.deleteReply();
    return;
  }
  const moneyQty = interaction.options.getInteger("cash");
  const user = await User.findOne({ where: { discordID: targetUser.id } });
  user.wallet += moneyQty;
  await user.save();
  interaction.reply(`✅⠀**Você adicionou ${moneyQty} 💸 para o usuário ${targetUser.username}**⠀✅`);
  await wait(3000);
  interaction.deleteReply();
}
async function removeCash(interaction) {
  const userId = interaction.user.id;
  const Isadmin = await isAdmin(userId);
 
  if (Isadmin === false) {
    interaction.reply({
      content: "Você não tem permissão para executar esse comando",
    });
    await wait(3000);
    interaction.deleteReply();
    return;
  }
  // get money to give and target user
  const targetUser = interaction.options.getUser("user");
  if(targetUser.bot) {
    interaction.reply({
      content: "Bots não podem receber dinheiro",
    });
    await wait(3000);
    interaction.deleteReply();
    return;
  }
  const moneyQty = interaction.options.getInteger("cash");
  const user = await User.findOne({ where: { discordID: targetUser.id } });
  user.wallet -= moneyQty;
  await user.save();
  interaction.reply(`❌⠀**Você removeu ${moneyQty} 💸 para o usuário ${targetUser.username}**⠀❌`);
  await wait(3000);
  interaction.deleteReply();
}

module.exports = { addCash, removeCash };
