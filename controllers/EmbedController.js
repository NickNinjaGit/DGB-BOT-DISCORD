const { EmbedBuilder } = require('discord.js');
const User = require('../models/User');

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
    static async ShowCard(card) {
        const embed = new EmbedBuilder()
            .setAuthor({ name: "⠀⠀⠀⠀⠀⠀" })
            .setTitle(`⠀⠀⠀⠀⠀⠀⠀🃏⠀${card.name}⠀⚔️`)
            .setImage(card.image)
            .setColor(card.rarity.color)
            .addFields(
                { name: `⠀⠀⠀⠀⠀⠀⠀⠀Raridade: ${card.rarity.name}`, value: `⠀`},
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
                { name: 'HP', value: `${card.HP}⠀❤️`, inline: true },
                { name: 'Mana', value: `${card.MANA}⠀🌀`, inline: true },
            )
            
            .addFields(
                { name: `ATK⠀⠀⠀⠀⠀⠀⠀${card.skill1?.name || "Habilidade 1"}:`, value: `⠀**${card.ATK}**⠀🗡️⠀⠀⠀⠀⠀⠀⠀⠀Custo:⠀**${card.skill1?.cost || 0}**⠀💠`, },
            )
            .addFields(
                { name: `DEF⠀⠀⠀⠀⠀⠀⠀${card.skill2?.name || "Habilidade 2"}:`, value: `⠀**${card.DEF}**⠀🛡️⠀⠀⠀⠀⠀⠀⠀⠀Custo:⠀**${card.skill2?.cost || 0}**⠀💠`, },
                { name: 'SPEED', value: `**⠀${card.SPEED}**⠀🏃`, inline: true }
            );
    
        return embed;
    }
    

    // ShowFriendProfile
}