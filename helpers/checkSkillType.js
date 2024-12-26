module.exports = function checkSkillType(skillType, skillValue, StatusChangeType, SkillMultiplier) {
    if (skillType === 'DAMAGE')
    {
        return `${skillValue}🗡️`;
    }
    else if (skillType === 'HEAL')
    {
        return `${skillValue}🩸`;
    }
    else if (skillType === 'DEBUFF')
    {
        if(StatusChangeType === 'ATK')
        {
            return `🤏⠀${SkillMultiplier * 100}%`;
        }
        else if (StatusChangeType === 'DEF')
        {
            return `🤕⠀${SkillMultiplier * 100}%`;
        }
        else if (StatusChangeType === 'SPEED')
        {
            return `🐢⠀${SkillMultiplier * 100}%`;
        }
    }
    else if (skillType === 'BUFF')
    {
        if(StatusChangeType === 'ATK')
            {
                return `💪⠀${SkillMultiplier * 100}%`;
            }
            else if (StatusChangeType === 'DEF')
            {
                return `🔰⠀${SkillMultiplier * 100}%`;
            }
            else if (StatusChangeType === 'SPEED')
            {
                return `🏃⠀${SkillMultiplier * 100}%`;
            }
    }
}