async function checkManaStatus(ManaPlayerStatus, skill1, skill2) {
  if (ManaPlayerStatus === 0) {
    return "LowManaBoth";
  }
  if (ManaPlayerStatus < skill1.cost) {
    return "LowMana1";
  }
  if (ManaPlayerStatus < skill2.cost) {
    return "LowMana2";
  }
}
async function SkillButtonRender(ManaStatus, skillsButtons) {
  if (ManaStatus === "LowMana1") {
    return skillsButtons.singleSkillRow2;
  }
  if (ManaStatus === "LowMana2") {
    return skillsButtons.singleSkillRow1;
  }
  if (ManaStatus === "LowManaBoth") {
    return "NoRender";
  }
  return skillsButtons.bothSkillsRow;
}
async function AttackerSkillButtonResolve(
  SkillButtonRender,
  thread,
  cardEmbedA,
  battleButtons
) {
  let response = null;
  if (SkillButtonRender === "NoRender") {
    response = await thread.send({
      embeds: [cardEmbedA],
      components: [battleButtons.actionRowSkillDisabled],
    });
    return response;
  } else {
    response = await thread.send({
      embeds: [cardEmbedA],
      components: [battleButtons.actionRow],
    });
    return response;
  }
}
async function DefensorSkillButtonResolve(SkillButtonRender, battleButtons) {
  if (SkillButtonRender === "NoRender") {
    
    return battleButtons.actionRowSkillDisabled;
  }
  else
  {
    return battleButtons.actionRow;
  }
}


async function CancelActionSkillRender(
  SkillButtonRender,
  interaction,
  currentCardEmbed,
  battleButtons
) {
  let response = null;
  if (SkillButtonRender === "NoRender") {
    response = await interaction.followUp({
      embeds: [currentCardEmbed],
      components: [battleButtons.actionRowSkillDisabled],
    });
    return response;
  } else {
    response = await interaction.followUp({
      embeds: [currentCardEmbed],
      components: [battleButtons.actionRow],
    });
    return response;
  }
}

module.exports = {
  checkManaStatus,
  SkillButtonRender,
  AttackerSkillButtonResolve,
  DefensorSkillButtonResolve,
  CancelActionSkillRender,
};
