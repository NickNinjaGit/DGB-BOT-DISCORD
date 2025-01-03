const { EmbedBuilder } = require('discord.js');
const User = require('../models/User');
const checkSkillType = require('../helpers/checkSkillType');

module.exports = class EmbedController {
    static async ShowUserProfile(discordId, displayImage) {
        const user = await User.findOne({ where: { discordId } });
    
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
                { name: 'Cartas Colecionadas 🃏', value: `0/100 `, inline: true },
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
    static async ShowShop(cards, pageId, totalPages) {
        const embed = new EmbedBuilder()
            .setAuthor({ name: "⠀⠀⠀⠀⠀⠀"})
            .setTitle(`Loja ⚔️`)
            .addFields(
                { name: '⠀', value: `⠀`},
            )
            .addFields(
                { name: 'Pacotes', value: `────୨ৎ────`},
            )
            .addFields(
                { name: '📦⠀Pacote Básico:⠀50⠀💸', value: `*Descrição: Esse pacote pode vir com 5 cartas de raridades baixas (Comum, Raro, Épico)*`},
                { name: '────୨ৎ────', value: `⠀`},
                { name: 'Pacote Avançado⠀150⠀💸', value: `*Descrição: O pacote avançado conta com 10 cartas excluindo apenas a raridade Mítica*`},
                { name: '────୨ৎ────', value: `⠀`},
                { name: 'Pacote Premium⠀300⠀💸', value: `*Descrição: O pacote premium conta com 20 cartas contendo todas as raridades*`},
            )
            .addFields(
                { name: '⠀', value: `⠀`},
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
            .setTitle(`⠀⠀⠀⠀⠀⠀⠀🃏⠀${card.name}⠀⚔️`)
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
