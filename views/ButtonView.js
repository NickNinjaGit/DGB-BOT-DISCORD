const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = class ButtonController {
  static async SkillDetails(skill1, skill2) {
    const skillRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("skill1Details")
        .setLabel(`Detalhes de ${skill1}`)
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("skill2Details")
        .setLabel(`Detalhes de ${skill2}`)
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("quit")
        .setLabel(`Sair`)
        .setStyle(ButtonStyle.Danger)
    );

    const backRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("back")
        .setLabel("Voltar")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("quit")
        .setLabel(`Sair`)
        .setStyle(ButtonStyle.Danger)
    );

    return { skillRow, backRow };
  }
  static async StardomButtons(starPoints) {
    const buttonConfigs = [
      {
        min: 10,
        id: "stardom-bronze",
        label: "Mudar para Bronze",
        style: ButtonStyle.Success,
      },
      {
        min: 50,
        id: "stardom-silver",
        label: "Mudar para Prata",
        style: ButtonStyle.Success,
      },
      {
        min: 100,
        id: "stardom-gold",
        label: "Mudar para Ouro",
        style: ButtonStyle.Success,
      },
      {
        min: 200,
        id: "stardom-iridium",
        label: "Mudar para Ascendente",
        style: ButtonStyle.Success,
      },
    ];
    const buttons = buttonConfigs
      .filter((config) => starPoints >= config.min)
      .map((config) =>
        new ButtonBuilder()
          .setCustomId(config.id)
          .setLabel(config.label)
          .setStyle(config.style)
      );
    const stardomRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("stardom-default")
        .setLabel(`Mudar para o Padrão`)
        .setStyle(ButtonStyle.Success),
      ...buttons
    );
    const quitRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("quit")
        .setLabel(`Sair`)
        .setStyle(ButtonStyle.Danger)
    );
    return { stardomRow, quitRow };
  }
  static async ProfileButtons() {
    const profileRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("user-info")
        .setLabel(`Estátisticas`)
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("pack-info")
        .setLabel(`Inventário de Pacotes`)
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("quit")
        .setLabel(`Sair`)
        .setStyle(ButtonStyle.Danger)
    );
    return profileRow;
  }
  static async NavButtons() {
    const navRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("previous")
        .setLabel(`<-`)
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("next")
        .setLabel(`->`)
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("quit")
        .setLabel(`Sair`)
        .setStyle(ButtonStyle.Danger)
    );
    return navRow;
  }
  static async BattleButtons() {
    const actionRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("attack")
        .setLabel(`Atacar`)
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("defend")
        .setLabel(`Defender`)
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("dodge")
        .setLabel(`Esquivar`)
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("skillList")
        .setLabel(`Skills`)
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("forfeit")
        .setLabel(`Desistir`)
        .setStyle(ButtonStyle.Secondary)
    );
    const confirmActionRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("confirm")
        .setLabel("Confirmar Ação")
        .setStyle(ButtonStyle.Success),
    );
    const cancelActionRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("cancel")
        .setLabel("Cancelar Ação")
        .setStyle(ButtonStyle.Danger)
    );

    return { actionRow, confirmActionRow, cancelActionRow };
  }
};
