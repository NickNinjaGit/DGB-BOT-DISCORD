// Controllers
const EmbedController = require("../../controllers/EmbedController");
const CardController = require("../../controllers/CardController");
const ButtonController = require("../../controllers/ButtonController");
const PackageController = require("../../controllers/PackageController");

// Models 
const User = require("../../models/User");
const UserCards = require("../../models/UserCards");

// handlers
const handleCardInteraction = require("../cards/handleCardInteraction");
const Package = require("../../models/Package");

// helpers
const wait = require("node:timers/promises").setTimeout;

/* Card Relational interactions */
async function findCard(interaction, activeInteractions) {
    const userId = interaction.user.id;
  
    // Verificar se já existe uma interação ativa para este usuário
    if (activeInteractions.has(userId)) {
      await interaction.reply({
        content: "Você já possui uma interação ativa! Aguarde ou finalize antes de executar novamente.",
      });
      return;
    }
  
    // Marcar a interação como ativa
    activeInteractions.add(userId);
  
    try {
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
        'f-card'
      );
  
      await interaction.reply({
        embeds: [cardEmbed],
        components: [skillDetails.skillRow],
        fetchReply: true,
      });
  
      handleCardInteraction(interaction, userId, card, cardEmbed, skillDetails, activeInteractions);
    } catch (error) {
      console.error("Erro na execução do comando:", error);
      activeInteractions.delete(userId); // Garantir que o estado seja limpo em caso de erro
      await interaction.reply({
        content: "Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.",
        ephemeral: true,
      });
    }
}
  
  
async function findUserCard(interaction, activeInteractions) {
    const userId = interaction.user.id;
    if (activeInteractions.has(userId)) {
        await interaction.reply({
          content: "Você já possui uma interação ativa! Aguarde ou finalize antes de executar novamente.",
        });
        return;
    }
    
    // Marcar a interação como ativa
    activeInteractions.add(userId);

    const user = await User.findOne({ where: { discordID: userId } });
    //get card name input and finding card in database
    const cardName = interaction.options.getString("card");
    const card = await CardController.getCardByName(cardName);
    if (!card) {
      await interaction.reply({
        content: "**Card não encontrado!**",
        
      });
      await wait(3000);
      interaction.deleteReply();
      return;
    }
    const userHasCard = await UserCards.findOne({where: {userId: user.id, cardId: card.id}});
    console.log(userHasCard);
  
    
    // check if user has the card
    if(!userHasCard) {
      await interaction.reply({
        content: "Voce não possui essa carta",
        
      });
      await wait(3000);
      interaction.deleteReply();
      return;
    }
    //check if card exists
    
  
    const cardEmbed = await EmbedController.ShowUserCard(card, user, userHasCard.quantity);
    const SkillDetails = await ButtonController.SkillDetails(
      card.skill1.name,
      card.skill2.name,
      'fu-card'
    );
    await interaction.reply({
      embeds: [cardEmbed],
      components: [SkillDetails.skillRow],
      fetchReply: true,
    });
  
    handleCardInteraction(interaction, userId, card, cardEmbed, SkillDetails, activeInteractions);
    
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

async function BuyPack(interaction) 
{
  const userid = interaction.user.id;
  const user = await User.findOne({where: {discordID: userid}});
  const packName = interaction.options.getString("pack-name");
  const qty = interaction.options.getInteger("quantity");
  const package = await PackageController.getPackageByName(packName);

  if(!package) {
    await interaction.reply({
      content: "Pacote não encontrado!",
      
    });
    await wait(3000);
    interaction.deleteReply();
    return;
  }

  if (user.wallet < package.price) {
    await interaction.reply({
      content: "Dinheiro insuficiente! Você possui apenas " + user.wallet + " 💸",
      
    });
    await wait(3000);
    interaction.deleteReply();
    return;
  }

  // buy pack
  await PackageController.BuyPackage(user, package, qty);

  interaction.reply({
    content: `Pacote comprado com sucesso! Use o comando /o-package [nome do pacote] para abrir seu pacote!`,
  })
  await wait(3000);
  interaction.deleteReply();
}

module.exports = { findCard, findUserCard, BuyCard, BuyPack };