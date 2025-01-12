const {ButtonBuilder, ButtonStyle, ActionRowBuilder} = require('discord.js');

module.exports = class ButtonController {
    static async SkillDetails(skill1, skill2)
    {
        const skillRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('skill1Details')
                    .setLabel(`Detalhes de ${skill1}`)
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('skill2Details')
                    .setLabel(`Detalhes de ${skill2}`)
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('quit')
                    .setLabel(`Sair`)
                    .setStyle(ButtonStyle.Danger),
            )

        const backRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('back')
                    .setLabel('Voltar')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('quit')
                    .setLabel(`Sair`)
                    .setStyle(ButtonStyle.Danger),
            )

        return {skillRow, backRow};
    }
    static async ProfileButtons()
    {
        const profileRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('user-info')
                .setLabel(`Estátisticas`)
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('pack-info')
                .setLabel(`Inventário de Pacotes`)
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('quit')
                .setLabel(`Sair`)
                .setStyle(ButtonStyle.Danger),
        )
        return profileRow   
    }
    static async NavButtons()
    {
        const navRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('previous')
                .setLabel(`<-`)
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('next')
                .setLabel(`->`)
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('quit')
                .setLabel(`Sair`)
                .setStyle(ButtonStyle.Danger),
        )
        return navRow
    }
}