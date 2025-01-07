const EmbedController = require("../../controllers/EmbedController");
const wait = require("util").promisify(setTimeout);

module.exports = async function handleCardInteraction(interaction, userId, card, cardEmbed, SkillDetails, activeInteractions) {
    const collector = interaction.channel.createMessageComponentCollector({
        filter: (i) => i.user.id === userId,
        time: 600000, // 10 minuto
      });
      // Configurar o coletor para ouvir interações nos botões
      collector.on("collect", async (i) => {
        
        if (i.customId === "skill1Details-f-card" || i.customId === "skill1Details-fu-card") {
          const skill1Embed = await EmbedController.ShowSkill(card.skill1);
          await i.update({
            embeds: [skill1Embed],
            components: [SkillDetails.backRow], // Mostrar botão de "voltar"
            fetchReply: true,
      
          });
        } else if (i.customId === "skill2Details-f-card" || i.customId === "skill2Details-fu-card") {
          const skill2Embed = await EmbedController.ShowSkill(card.skill2);
          await i.update({
            embeds: [skill2Embed],
            components: [SkillDetails.backRow], // Mostrar botão de "voltar"
            fetchReply: true,
      
          });
        } else if (i.customId === "back-f-card" || i.customId === "back-fu-card") {
          await i.update({
            embeds: [cardEmbed],
            components: [SkillDetails.skillRow], // Retornar ao conjunto de habilidades
            fetchReply: true,
          });
        } else if (i.customId === "quit-f-card" || i.customId === "quit-fu-card") {
          
          await activeInteractions.delete(userId);
          await i.update({
            content: "Saída realizada com sucesso.",
            embeds: [],
            components: [],
            fetchReply: true,
      
          }); 
          collector.stop();
          await wait(1000);
          await i.deleteReply();
        }
      });
}