module.exports = class SkillService
{
    static async getCurrentSkill(action, card)
    {
        let currentSkill = null;
        if(action === "skill1")
        {
            currentSkill = card.skill1;
            return currentSkill;
        }
        else if (action === "skill2")
        {
            currentSkill = card.skill2;
            return currentSkill;
        }
        else
        {
            return "";
        }
    }
    static async DamageSkill(skill) {
        const SkillValue = skill.SkillValue;
        const acurracy = skill.acurracy;
        const hitTimes = skill.hitTimes;
        const duration = skill.duration;

        
        const damage = SkillValue * hitTimes;

        if(acurracy < Math.random()) {
            return 0;
        }

        if(duration > 0)
        {
            return {damage, duration};
        }
        else
        {
            return {damage};
        }
       
    }
}