// Controllers
const EmbedController = require("../../controllers/EmbedController");
const CardController = require("../../controllers/CardController");
const ButtonController = require("../../controllers/ButtonController");
const PackageController = require("../../controllers/PackageController");
const CollectorController = require("../../controllers/CollectorController");

// Models
const User = require("../../models/User");
const UserCards = require("../../models/UserCards");



// helpers
const wait = require("node:timers/promises").setTimeout;
const checkActiveInteractions = require("../../helpers/checkActiveInteractions");


/* Card Relational interactions */
async function findCard(interaction, activeInteractions) {
  const discordID = interaction.user.id;

  const isActiveInteractions = await checkActiveInteractions(discordID, interaction, activeInteractions);

  if (isActiveInteractions === true)
  {
    return;
  }

  // Lógica principal do comando
  const cardName = interaction.options.getString("card");
  const card = await CardController.getCardByName(cardName);

  if (!card) {
    await interaction.reply({
      content: "Card não encontrado!",
    });
    return;
  }

  const cardEmbed = await EmbedController.ShowCard(card);
  const skillDetails = await ButtonController.SkillDetails(
    card.skill1.name,
    card.skill2.name,
  );

  await interaction.reply({
    embeds: [cardEmbed],
    components: [skillDetails.skillRow],
    fetchReply: true,
  });

  CollectorController.CardCollector(interaction, discordID, card, cardEmbed, skillDetails, activeInteractions);
}

async function BuyCard(interaction) {
  const userId = interaction.user.id;
  const cardName = interaction.options.getString("card");
  const user = await User.findOne({ where: { discordID: userId } });
  const card = await CardController.getCardByName(cardName);

  // check if card exists
  if (!card) {
    await interaction.reply({
      content: "Card nao encontrado!",
    });
    await wait(3000);
    interaction.deleteReply();
    return;
  }

  // check if user has enough money
  if (user.wallet < card.price) {
    await interaction.reply({
      content: "Dinheiro insuficiente!",
    });
    await wait(3000);
    interaction.deleteReply();
    return;
  }

  // buy card
  await CardController.AddCard(userId, cardName);
  user.wallet -= card.price;
  user.inventory += 1;
  await user.save();
  await interaction.reply({
    content: `Compra realizada com sucesso! Use /fu-card para ver sua nova carta!`,
  });
  await wait(3000);
  interaction.deleteReply();
}

async function BuyPack(interaction) {
  const userid = interaction.user.id;
  const user = await User.findOne({ where: { discordID: userid } });
  const packName = interaction.options.getString("pack-name");
  const qty = interaction.options.getInteger("quantity");
  const package = await PackageController.getPackageByName(packName);

  if (!package) {
    await interaction.reply({
      content: "Pacote não encontrado!",
    });
    await wait(3000);
    interaction.deleteReply();
    return;
  }

  if (user.wallet < package.price) {
    await interaction.reply({
      content:
        "Dinheiro insuficiente! Você possui apenas " + user.wallet + " 💸",
    });
    await wait(3000);
    interaction.deleteReply();
    return;
  }

  // buy pack
  await PackageController.BuyPackage(user, package, qty);

  interaction.reply({
    content: `Pacote comprado com sucesso! Use o comando /o-package [nome do pacote] para abrir seu pacote!`,
  });
  await wait(3000);
  interaction.deleteReply();
}

module.exports = { findCard, BuyCard, BuyPack };
