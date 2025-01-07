const { EmbedBuilder } = require('discord.js');
const User = require('../models/User');
const CardController = require('../controllers/CardController');
const PackageController = require('../controllers/PackageController');
const checkSkillType = require('../helpers/checkSkillType');

module.exports = class EmbedController {
    static async ShowUserProfile(discordId, displayImage) {
        const user = await User.findOne({where: {discordID: discordId}});
        const cardCollection = await CardController.getCardCollection(discordId);
    
        const embed = new EmbedBuilder()
            .setAuthor({ name: "⠀⠀⠀⠀⠀⠀"})
            .setTitle(`🃏 Perfil de ${user.name} ⚔️`)
            .addFields(
                { name: '⠀', value: `⠀`},)
            .setThumbnail(displayImage)
            .addFields(
                { name: 'Informações 📜', value: `────୨ৎ────`},
            )
            .addFields(
                { name: 'Cartas Colecionadas 🃏', value: `${cardCollection.cardsQty}/${cardCollection.lastCard} `, inline: true },
                { name: 'Dinheiro 💰', value: `${user.wallet} 💸  `, inline: true },
                { name: 'Inventario 🎒', value: `${user.inventory} /${user.inventoryLimit} `, inline: true },
                
            )
            .addFields(
                { name: '-----------------------------', value: `⠀⠀`},
            )
            .addFields(
                { name: 'Score de Batalhas 🏆', value: `────୨ৎ────`},
            )
          
            .addFields(
                { name: 'Batalhas Vencidas 👑', value: `${user.BattlesWon} Batalhas ` },
                { name: '-----------------------------', value: `⠀⠀`},
                { name: 'Battles Perdidas 💀', value: `${user.BattlesLost} Batalhas ` },
                { name: '-----------------------------', value: `⠀⠀`},
                { name: 'Batalhas Abandonadas 🏳️', value: `${user.BattlesGiveUp} Batalhas `, inline: true },
                { name: '-----------------------------', value: `⠀⠀`}
            )
        return embed;
    }
    static async ShowPackageInfo(discordID)
    {
        const user = await User.findOne({where: {discordID}});
        const packs = await PackageController.getPackagesQty(user.id);

        const embed = new EmbedBuilder()
            .setAuthor({ name: "⠀⠀⠀⠀⠀⠀"})
            .setTitle(`🃏 Perfil de ${user.name} ⚔️`)
            .addFields(
                { name: '⠀', value: `⠀`},)
            .addFields(
                { name: '🎒⠀⠀Inventário de Pacotes ⠀📦', value: `────୨ৎ────`},
            )
            .addFields(
                { name: '🏷️📦⠀Pacotes Básicos: ', value: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${packs.BasicPackQty}`, inline: true },
                { name: '📛📦⠀Pacotes Avançados: ', value: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${packs.AdvancedPackQty}  `, inline: true },
            )
            .addFields(
                { name: '-----------------------------', value: `⠀⠀`},
            )
            .addFields(
                { name: '💎📦⠀Pacotes Premium: ', value: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${packs.PremiumPackQty}`, inline: true },
                { name: '🔵📦⠀Pacotes Só Comuns: ', value: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${packs.onlyCommonQty}  `, inline: true },
            )
            .addFields(
                { name: '-----------------------------', value: `⠀⠀`},
            )
            .addFields(
                { name: '🟢📦⠀Pacotes Só Raras: ', value: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${packs.onlyRareQty}`, inline: true },
                { name: '🟣📦⠀Pacotes Só Épicas: ', value: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${packs.onlyEpicQty}  `, inline: true },
            )
            .addFields(
                { name: '-----------------------------', value: `⠀⠀`},
            )
            .addFields(
                { name: '🟠📦⠀Pacotes Só Lendárias: ', value: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${packs.onlyLegendaryQty}`, inline: true },
                { name: '🔴📦⠀Pacotes Só Míticas: ', value: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${packs.onlyMiticQty}`, inline: true },
            )
            .addFields(
                { name: '-----------------------------', value: `⠀⠀`},
            )
          
            
        return embed;
    }
    static async ShowShop(cards, packages, pageId, totalPages) {
        const embed = new EmbedBuilder()
            .setAuthor({ name: "⠀⠀⠀⠀⠀⠀"})
            .setColor('Gold')
            .setTitle(`⠀🃏 Loja ⚔️`)
            .addFields(
                { name: '⠀', value: `⠀`},
            )
            .addFields(
                !packages.length ? { name: '•⠀📦⠀Parece que as opções de pacotes acabaram! Espere mais atualizações para ter acesso a novos tipos de pacotes!', value: `────୨ৎ────`} : 
                { name: 'Pacotes', value: `────୨ৎ────`},
            )
            .addFields(
                // função anonima pra imprimir os pacotes
                packages.map(pack => {
                    return { name: `📦⠀${pack.name}:⠀${pack.price}⠀💸`, value: `⠀`};
                })
            )
            .addFields(
                { name: '=====================================', value: `⠀`}
            )
            .addFields(
                { name: 'Cartas', value: `────୨ৎ────`},
            )
            .setFooter({text: `Página ${pageId}/${totalPages}`});
        cards.forEach(card => {
            embed.addFields(
                { name: `🃏⠀${card.name}:⠀${card.price}⠀💸`, value: `*Descrição: ${card.description}*`},
                { name: 'Raridade', value: `${card.rarity.name}`},
                { name: '========୨ৎ========', value: `⠀`},
            )
        })
        return embed
    }
    static async ShowCard(card) {
        const embed = new EmbedBuilder()
            .setAuthor({ name: "⠀⠀⠀⠀⠀⠀" })
            .setTitle(`🃏⠀${card.name}⠀⚔️`)
            .setImage(card.image)
            .setColor(card.rarity.color)
            .addFields(
                { name: `⠀⠀⠀⠀⠀⠀⠀⠀ Raridade: ${card.rarity.name}`, value: `⠀`},
            )
            .addFields(
                {name: 'Descrição', value: `*${card.description}*`}
            )      
            .addFields(
                { name: 'Preço', value: `**${card.price}**⠀💵`, inline: true },
                { name: 'Valor de Venda', value: `**${card.sellValue}**⠀💰`, inline: true },
                { name: '⠀⠀', value: `-----------------------------` }
            )

            
            .addFields(
                { name: `${card.HP}⠀❤️`, value: `⠀`, inline: true },
                { name: `${card.MANA}⠀🌀`, value: `⠀`, inline: true },
            )
            
            .addFields(
                { name: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${card.skill1.name}`, value: `**${card.ATK}**⠀🗡️⠀⠀⠀⠀⠀⠀⠀⠀Custo:⠀**${card.skill1?.cost || 0}**⠀💠`, },
                { name: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${card.skill2.name}:`, value: `**${card.DEF}**⠀🛡️⠀⠀⠀⠀⠀⠀⠀⠀Custo:⠀**${card.skill2?.cost || 0}**⠀💠`, },
                { name: `⠀`, value: `**${card.SPEED}**⠀💨`}
            )
    
        return embed;
    }
    static async ShowUserCardList(cards, qty, pageId, totalPages) {
        const embed = new EmbedBuilder()
            .setAuthor({ name: "⠀⠀⠀⠀⠀⠀" })
            .setTitle(`⠀🃏⠀Cartas⠀⚔️`)
            .setColor('Gold')
            
            .addFields(
                { name: '⠀', value: `⠀` },
                { name: 'Cartas', value: `────୨ৎ────` },
            )
            .setFooter({text: `Página ${pageId}/${totalPages}`});
            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                const quantity = qty[i]; // Obter a quantidade correspondente para a carta
                const rarity_info = await CardController.checkRarity(card.rarity);
                const handleText = quantity > 1 ? 'Cópias' : 'Cópia'
                embed.addFields(
                    { name: `🃏⠀${card.name} - ${quantity} ${handleText}` , value: `⠀` },
                    { name: `${rarity_info.name}⠀⠀⠀⠀⠀⠀⠀🌟**0**`, value: `${card.description}` },
                    { name: '────────୨ৎ────────', value: `⠀` },
                );
            }        
            return embed;
    }
    
    static async ShowUserCard(card, user, qty) {
        const embed = new EmbedBuilder()
            .setAuthor({ name: "⠀⠀⠀⠀⠀⠀" })
            .setTitle(`🃏⠀${card.name}⠀⚔️`)
            .setImage(card.image)
            .setColor(card.rarity.color)
            .addFields(
                { name: `⠀⠀⠀⠀⠀⠀**${qty}**⠀♦️⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀**0**⠀🌟`, value: `⠀`},
            )
            .addFields(
                { name: `⠀⠀⠀⠀⠀⠀⠀⠀ Raridade: ${card.rarity.name}`, value: `⠀`},
            )
            .addFields(
                {name: 'Descrição', value: `*${card.description}*`}
            )      
            .addFields(
                { name: 'Preço', value: `**${card.price}**⠀💵`, inline: true },
                { name: 'Valor de Venda', value: `**${card.sellValue}**⠀💰`, inline: true },
                { name: '⠀⠀', value: `-----------------------------` }
            )

            
            .addFields(
                { name: `${card.HP}⠀❤️`, value: `⠀`, inline: true },
                { name: `${card.MANA}⠀🌀`, value: `⠀`, inline: true },
            )
            
            .addFields(
                { name: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${card.skill1.name}`, value: `**${card.ATK}**⠀🗡️⠀⠀⠀⠀⠀⠀⠀⠀Custo:⠀**${card.skill1?.cost || 0}**⠀💠`, },
                { name: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${card.skill2.name}:`, value: `**${card.DEF}**⠀🛡️⠀⠀⠀⠀⠀⠀⠀⠀Custo:⠀**${card.skill2?.cost || 0}**⠀💠`, },
                { name: `⠀`, value: `**${card.SPEED}**⠀💨`}
            )
        .setFooter({text: "Pertencente ao jogador: " + user.name});
    
        return embed;
    }

    static async ShowSkill(skill) {
        const skillType = checkSkillType(skill.SkillType, skill.SkillValue, skill.StatusChangeType, skill.SkillMultiplier);
        const embed = new EmbedBuilder()
            .setAuthor({ name: "⠀⠀⠀⠀⠀⠀" })
            .setTitle(`⠀⠀⠀⠀⠀⠀⠀⠀🌀⠀${skill.name}⠀🌀`)
            .setImage(skill.image)
            .setDescription(`**Descrição:** *${skill.description}*`)
            .setColor('Gold')
            .addFields(
                { name: '⠀⠀', value: `-----------------------------` }
            )
            .addFields(
                {name: `${skill.cost}⠀💠`, value: `⠀`},
            )   
            .addFields(
                {name: skillType, value: `**${skill.hitTimes}⠀👊**`, inline: true },
            )
            .addFields(
                {name: `⠀🎯⠀${skill.acurracy * 100}%`, value: ` **${skill.duration === 0 ? '⠀Instântaneo⠀💥' : '⠀⠀'+ skill.duration + '⠀🕒'}**`, inline: true },
            )
           
        return embed;
    }


    
}
