const createSkill = require("./createSkill");
const path = require("path");
const fs = require("fs");


async function loadSkills() {
    const file = fs.readFileSync(path.resolve(__dirname, "./skills.json"));
    const skillsData = JSON.parse(file);
    const skills = [];
    for(const skillData of skillsData) {
        const skill = await createSkill(
            skillData.name,
            skillData.description,
            skillData.isGif,
            skillData.image,
            skillData.cost,
            skillData.SkillType,
            skillData.SkillValue,
            skillData.StatusChangeType,
            skillData.SkillMultiplier,
            skillData.Accurracy,
            skillData.HitTimes,
            skillData.Duration
        );
        skills.push(skill);
    }
    return skills;
}


module.exports = loadSkills;
