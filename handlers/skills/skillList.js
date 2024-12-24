const createSkill = require("./createSkill");

async function skillList() {
    
  const fireBlast = await createSkill(
    "Fire Blast", // Name
    "A fire blast", // Description
    true, // Is Gif
    "https://platform.polygon.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/3795372/cuphead_dragon_8.0.gif", // Image
    50, // Cost
    "DAMAGE", // SkillType
    200, // SkillValue
    "", // StatusChangeType
    0, // SkillMultiplier
    1, // Acurracy - Sendo 1 == 100%
    1, // HitTimes
    0 // Duration
  );
  const taunt = await createSkill(
    "Taunt", // Name
    "Taunts the enemy", // Description
    true, // Is Gif
    "https://media.tenor.com/bfwyHpyc3W0AAAAM/krillin-taunt.gif", // Image
    10, // Cost
    "DEBUFF", // SkillType
    0, // SkillValue
    "DEF", // StatusChangeType
    0.5, // SkillMultiplier
    1, // Acurracy - Sendo 1 == 100%
    1, // HitTimes
    2 // Duration
  );

  return { fireBlast, taunt };
}

// Correção ao usar a função
async function main() {
  const skills = await skillList();
  console.log(skills.fireBlast, skills.taunt);
}

module.exports = skillList;
