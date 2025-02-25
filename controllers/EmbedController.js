const { EmbedBuilder } = require("discord.js");
// Models
const User = require("../models/User");
// controllers
const CardService = require("../services/CardService");
const PackageService = require("../services/PackageService");

// helpers
const checkSkillType = require("../helpers/checkSkillType");

module.exports = class EmbedController {
  static async ShowUserProfile(discordId, displayImage) {
    const user = await User.findOne({ where: { discordID: discordId } });
    const cardCollection = await CardService.getUserCardsListed(discordId);

    const embed = new EmbedBuilder()
      .setAuthor({ name: "⠀⠀⠀⠀⠀⠀" })
      .setTitle(`🃏 Perfil de ${user.name} ⚔️`)
      .addFields({ name: "⠀", value: `⠀` })
      .setThumbnail(displayImage)
      .addFields({ name: "Informações 📜", value: `────୨ৎ────` })
      .addFields(
        {
          name: "Cartas Colecionadas 🃏",
          value: `${cardCollection.cardsQty}/${cardCollection.lastCard} `,
          inline: true,
        },
        { name: "Dinheiro 💰", value: `${user.wallet} 💸  `, inline: true },
        {
          name: "Inventario 🎒",
          value: `${user.inventory} /${user.inventoryLimit} `,
          inline: true,
        }
      )
      .addFields({ name: "-----------------------------", value: `⠀⠀` })
      .addFields({ name: "Score de Batalhas 🏆", value: `────୨ৎ────` })

      .addFields(
        { name: "Batalhas Vencidas 👑", value: `${user.BattlesWon} Batalhas ` },
        { name: "-----------------------------", value: `⠀⠀` },
        { name: "Battles Perdidas 💀", value: `${user.BattlesLost} Batalhas ` },
        { name: "-----------------------------", value: `⠀⠀` },
        {
          name: "Batalhas Abandonadas 🏳️",
          value: `${user.BattlesGiveUp} Batalhas `,
          inline: true,
        },
        { name: "-----------------------------", value: `⠀⠀` }
      );
    return embed;
  }
  static async ShowPackageInfo(discordID) {
    const user = await User.findOne({ where: { discordID } });
    const packs = await PackageService.getPackagesQty(user.id);

    const embed = new EmbedBuilder()
      .setAuthor({ name: "⠀⠀⠀⠀⠀⠀" })
      .setTitle(`🃏 Perfil de ${user.name} ⚔️`)
      .addFields({ name: "⠀", value: `⠀` })
      .addFields({ name: "🎒⠀⠀Inventário de Pacotes ⠀📦", value: `────୨ৎ────` })
      .addFields(
        {
          name: "🏷️📦⠀Pacotes Básicos: ",
          value: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${packs.BasicPackQty}`,
          inline: true,
        },
        {
          name: "📛📦⠀Pacotes Avançados: ",
          value: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${packs.AdvancedPackQty}  `,
          inline: true,
        }
      )
      .addFields({ name: "-----------------------------", value: `⠀⠀` })
      .addFields(
        {
          name: "💎📦⠀Pacotes Premium: ",
          value: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${packs.PremiumPackQty}`,
          inline: true,
        },
        {
          name: "🔵📦⠀Pacotes Só Comuns: ",
          value: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${packs.onlyCommonQty}  `,
          inline: true,
        }
      )
      .addFields({ name: "-----------------------------", value: `⠀⠀` })
      .addFields(
        {
          name: "🟢📦⠀Pacotes Só Raras: ",
          value: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${packs.onlyRareQty}`,
          inline: true,
        },
        {
          name: "🟣📦⠀Pacotes Só Épicas: ",
          value: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${packs.onlyEpicQty}  `,
          inline: true,
        }
      )
      .addFields({ name: "-----------------------------", value: `⠀⠀` })
      .addFields(
        {
          name: "🟠📦⠀Pacotes Só Lendárias: ",
          value: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${packs.onlyLegendaryQty}`,
          inline: true,
        },
        {
          name: "🔴📦⠀Pacotes Só Míticas: ",
          value: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${packs.onlyMiticQty}`,
          inline: true,
        }
      )
      .addFields({ name: "-----------------------------", value: `⠀⠀` });

    return embed;
  }
  static async ShowShop(cards, packages, pageId, totalPages) {
    const embed = new EmbedBuilder()
      .setAuthor({ name: "⠀⠀⠀⠀⠀⠀" })
      .setTitle(`⠀⠀⠀⠀⠀⠀⠀⠀⠀🃏Loja ⚔️`)
      .addFields({ name: "⠀", value: `⠀` })
      .addFields(
        !packages.length
          ? {
              name: "•⠀📦⠀Parece que as opções de pacotes acabaram! Espere mais atualizações para ter acesso a novos tipos de pacotes!",
              value: `────୨ৎ────`,
            }
          : { name: "Pacotes", value: `────୨ৎ────` }
      )
      .addFields(
        // iterate over the packages array and add each package to the embed
        ...packages.map((pack) => ({
          name: `${pack.name}: ${pack.price}⠀💸`,
          value: `────୨ৎ────`,
        }))
      )
      .addFields({ name: "=====================================", value: `⠀` })
      .addFields({ name: "Cartas", value: `────୨ৎ────` })
      .setFooter({ text: `Página ${pageId}/${totalPages}` });
    cards.forEach((card) => {
      embed.addFields(
        {
          name: `🃏⠀${card.name}:⠀${card.price}⠀💸`,
          value: `*Descrição: ${card.description}*`,
        },
        { name: "Raridade", value: `${card.rarity.name}` },
        { name: "========୨ৎ========", value: `⠀` }
      );
    });
    return embed;
  }
  static async ShowCard(card) {
    const embed = new EmbedBuilder()
      .setAuthor({ name: "⠀⠀⠀⠀⠀⠀" })
      .setTitle(`🃏⠀${card.name}⠀⚔️`)
      .setImage(card.image)
      .setColor(card.rarity.color)
      .addFields({
        name: `Raridade: ${card.rarity.name}`,
        value: `⠀`,
      })
      .addFields({
        name: `🌐⠀${card.universe}`,
        value: `⠀`,
      })
      .addFields({ name: "Descrição", value: `*${card.description}*` })
      .addFields(
        { name: "Preço", value: `**${card.price}**⠀💵`, inline: true },
        {
          name: "Valor de Venda",
          value: `**${card.sellValue}**⠀💰`,
          inline: true,
        },
        { name: "⠀⠀", value: `-----------------------------` }
      )

      .addFields(
        { name: `${card.HP}⠀❤️`, value: `⠀`, inline: true },
        { name: `${card.MANA}⠀🌀`, value: `⠀`, inline: true }
      )

      .addFields(
        {
          name: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${card.skill1.name}`,
          value: `**${card.ATK}**⠀🗡️⠀⠀⠀⠀⠀⠀⠀⠀Custo:⠀**${
            card.skill1?.cost || 0
          }**⠀💠`,
        },
        {
          name: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${card.skill2.name}:`,
          value: `**${card.DEF}**⠀🛡️⠀⠀⠀⠀⠀⠀⠀⠀Custo:⠀**${
            card.skill2?.cost || 0
          }**⠀💠`,
        },
        { name: `⠀`, value: `**${card.SPEED}**⠀💨` }
      );

    return embed;
  }
  static async ShowUserCards(cardList, pageId, totalPages) {
    const embed = new EmbedBuilder()
      .setAuthor({ name: "⠀⠀⠀⠀⠀⠀" })
      .setTitle(`🃏 Inventário de Cartas ⚔️`)
      .addFields({ name: "⠀", value: `⠀` })
      .addFields({ name: "Cartas", value: `────୨ৎ────` })
      .setFooter({ text: `Pagina ${pageId}/${totalPages}` });
    cardList.forEach((card) => {
      embed.addFields(
        {
          name: `${card.name} ⠀${card.quantity}⠀♦️ ${card.starPoints} 🌟`,
          value: `${card.description}`,
        },
        { name: "⠀", value: `-----------------------------` }
      );
    });
    return embed;
  }
  static async ShowBattleCard(card)
  {
    const embed = new EmbedBuilder()
      .setAuthor({ name: "⠀⠀⠀⠀⠀⠀" })
      .setTitle(`🃏⠀${card.name}⠀⚔️`)
      .setImage(card.currentIMG)
      .setColor(card.rarity.color)
      .addFields({
        name: `Raridade: ${card.rarity.name}`,
        value: `⠀`,
      })
      .addFields({ name: "Descrição", value: `*${card.description}*` })
      .addFields({ name: "⠀⠀", value: `-----------------------------` })
 

      .addFields(
        { name: `${card.currentHP}/${card.HP}⠀❤️`, value: `⠀`, inline: true },
        { name: `${card.currentMANA}/${card.MANA}⠀🌀`, value: `⠀`, inline: true }
      )

      .addFields(
        {
          name: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${card.skill1.name}`,
          value: `**${card.currentATK}**⠀🗡️⠀⠀⠀⠀⠀⠀⠀⠀Custo:⠀**${
            card.skill1?.cost || 0
          }**⠀💠`,
        },
        {
          name: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${card.skill2.name}:`,
          value: `**${card.currentDEF}**⠀🛡️⠀⠀⠀⠀⠀⠀⠀⠀Custo:⠀**${
            card.skill2?.cost || 0
          }**⠀💠`,
        },
        { name: `⠀`, value: `**${card.currentSPEED}**⠀💨` }
      );

    return embed;
  }
  static async ShowPackCards(gainedCards) {
    const embedList = [];
    gainedCards.forEach((card) => {
      // Cria uma nova embed para cada carta

      const embed = new EmbedBuilder()
        .setAuthor({ name: "⠀⠀⠀⠀⠀⠀" })
        .setColor(card.rarity.color) // Define a cor da embed
        .setTitle(`🃏⠀${card.name}⠀⚔️`)
        .setDescription(`**Descrição:** *${card.description}*`)
        .setImage(card.image)
        .addFields(
          { name: `**${card.rarity.name}**`, value: `⠀` },
          {
            name: `🌐⠀${card.universe}`,
            value: `⠀`,
          },
          { name: "Preço", value: `${card.price} 💵`, inline: true },
          {
            name: "Valor de Venda",
            value: `${card.sellValue} 💰`,
            inline: true,
          },
          {
            name: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${card.skill1.name}`,
            value: `**${card.ATK}**⠀🗡️⠀⠀⠀⠀⠀⠀⠀⠀Custo:⠀**${
              card.skill1?.cost || 0
            }**⠀💠`,
          },
          {
            name: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${card.skill2.name}:`,
            value: `**${card.DEF}**⠀🛡️⠀⠀⠀⠀⠀⠀⠀⠀Custo:⠀**${
              card.skill2?.cost || 0
            }**⠀💠`,
          },
          { name: `⠀`, value: `**${card.SPEED}**⠀💨` }
        );
      embedList.push(embed);
    });

    return embedList;
  }
  static async ShowCollection(card, pageId, totalPages) {
    const embed = new EmbedBuilder()
      .setAuthor({ name: "⠀⠀⠀⠀⠀⠀" })
      .setTitle(`🃏⠀${card.name}⠀⚔️`)
      .setImage(card.image)
      .setColor(card.rarity.color)
      .addFields({
        name: `Raridade: ${card.rarity.name}`,
        value: `⠀`,
      })
      .addFields({
        name: `🌐⠀${card.universe}`,
        value: `⠀`,
      })
      .addFields({ name: "Descrição", value: `*${card.description}*` })
      .addFields(
        { name: "Preço", value: `**${card.price}**⠀💵`, inline: true },
        {
          name: "Valor de Venda",
          value: `**${card.sellValue}**⠀💰`,
          inline: true,
        },
        { name: "⠀⠀", value: `-----------------------------` }
      )

      .addFields(
        { name: `${card.HP}⠀❤️`, value: `⠀`, inline: true },
        { name: `${card.MANA}⠀🌀`, value: `⠀`, inline: true }
      )

      .addFields(
        {
          name: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${card.skill1.name}`,
          value: `**${card.ATK}**⠀🗡️⠀⠀⠀⠀⠀⠀⠀⠀Custo:⠀**${
            card.skill1?.cost || 0
          }**⠀💠`,
        },
        {
          name: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${card.skill2.name}:`,
          value: `**${card.DEF}**⠀🛡️⠀⠀⠀⠀⠀⠀⠀⠀Custo:⠀**${
            card.skill2?.cost || 0
          }**⠀💠`,
        },
        { name: `⠀`, value: `**${card.SPEED}**⠀💨` }
      )
      .setFooter({ text: `Pagina ${pageId}/${totalPages}` });
    return embed;
  }
  static async ShowSkill(skill) {
    const skillType = checkSkillType(
      skill.SkillType,
      skill.SkillValue,
      skill.StatusChangeType,
      skill.SkillMultiplier
    );
    const embed = new EmbedBuilder()
      .setAuthor({ name: "⠀⠀⠀⠀⠀⠀" })
      .setTitle(`🌀⠀${skill.name}⠀🌀`)
      .setImage(skill.image)
      .setDescription(`**Descrição:** *${skill.description}*`)
      .setColor("Gold")
      .addFields({ name: "⠀⠀", value: `-----------------------------` })
      .addFields({ name: `${skill.cost}⠀💠`, value: `⠀` })
      .addFields({
        name: skillType,
        value: `**${skill.hitTimes}⠀👊**`,
        inline: true,
      })
      .addFields({
        name: `⠀🎯⠀${skill.acurracy * 100}%`,
        value: ` **${
          skill.duration === 0
            ? "⠀Instântaneo⠀💥"
            : "⠀⠀" + skill.duration + "⠀🕒"
        }**`,
        inline: true,
      });

    return embed;
  }

  static async StardomSettings(stardomTier, starPoins, cardName, currentIMG) {
    const embed = new EmbedBuilder()
      .setAuthor({ name: "⠀⠀⠀⠀⠀⠀" })
      .setTitle(`⚔️⠀Ajustes de ${cardName}⠀⚔️`)
      .setDescription(`*Selecione uma moldura padrão de estrelato para a imagem da sua carta. Quanto mais batalhas ganhas, mais estrelato você terá com a carta. Para liberar outros estilos, ganhe mais pontos!*`)
      .setImage(currentIMG)
      .setColor("Gold")
      .addFields({name: "Quantidade de Estrelato: ", value: `**${starPoins}** 🌟`, inline: true})
      .addFields({ name: "⠀⠀", value: `-----------------------------` })
      .addFields(
        {name: "Tier: ", value: `**${stardomTier}**`, inline: true},
      )
      return embed;
  }

  static async ShowLeaderboard(users)
  {
    users = users.slice(0, 10);
    let i = 1;
    const embed = new EmbedBuilder()
      .setAuthor({ name: "⠀⠀⠀⠀⠀⠀" })
      .setTitle(`🏆⠀Leaderboards ⠀🏆`)
      .setColor("Gold")
      .addFields({name: "========================", value: `⠀`})
      users.forEach((user) => {
        embed.addFields({
          name: `🏆⠀${i} | @${user.name} | ${user.BattlesWon} vitórias`,
          value: `⠀`,
        })
        i++;
      })
    
      return embed;
  }
  
  static getUpdatedEmbed(imageUrl, description) {
    return new EmbedBuilder()
      .setTitle(description)
      .setImage(imageUrl)
      .setColor('Gold'); // Personalize a cor se quiser
  }
};
