const SkillService = require("../../services/SkillService");
const CardService = require("../../services/CardService");
const calculateDamage = require("./calculate-damage");


module.exports = async function SkillActionHandler(AttackerAction, DefensorAction, currentAttacker, currentDefensor, currentAttackerCard, currentDefensorCard) {
    let response = null;
    // get skill info
    const AttackerSkill = await SkillService.getCurrentSkill(AttackerAction, currentAttackerCard);
    const DefensorSkill = await SkillService.getCurrentSkill(DefensorAction, currentDefensorCard);

    // SKILL-DAMAGE A VS ATK B 
    if(AttackerSkill.SkillType === "DAMAGE" && DefensorAction === "attack") {
        // getting both damages
        const skillDamageA = await SkillService.DamageSkill(AttackerSkill);
        const damageB = await calculateDamage.ApplyDamage(currentDefensorCard.currentATK);

        // dealing damage
        currentDefensorCard.currentHP -= skillDamageA.damage;
        currentAttackerCard.currentHP -= damageB;

        // costing mana
        currentAttackerCard.currentMANA -= AttackerSkill.cost;
        await CardService.saveUserCardChanges(currentAttacker.id, currentAttackerCard.cardId, {
            currentMANA: currentAttackerCard.currentMANA,
        })

        // saving changes
        await CardService.saveUserCardChanges(currentAttacker.id, currentAttackerCard.cardId, {
            currentHP: currentAttackerCard.currentHP,
        });
        await CardService.saveUserCardChanges(currentDefensor.id, currentDefensorCard.cardId, {
            currentHP: currentDefensorCard.currentHP,
        });

        // returning response dynamically
        response = `**🔥Os dois atacaram, ${currentAttackerCard.name} (${currentAttacker.name}) usou ${AttackerSkill.name} causando ${skillDamageA.damage} de dano e ${currentDefensorCard.name} (${currentDefensor.name}) deu ${damageB} de dano.🗡️**`;
        return response;
        
    }

    // SKILL-DAMAGE B VS ATK A
    else if(DefensorSkill.SkillType === "DAMAGE" && AttackerAction === "attack") {
        // getting both damages
        const skillDamageB = await SkillService.DamageSkill(DefensorSkill);
        const damageA = await calculateDamage.ApplyDamage(currentAttackerCard.currentATK);

        // dealing damage
        currentAttackerCard.currentHP -= skillDamageB.damage;
        currentDefensorCard.currentHP -= damageA;

        // costing mana
        currentDefensorCard.currentMANA -= DefensorSkill.cost;
        
        await CardService.saveUserCardChanges(currentDefensor.id, currentDefensorCard.cardId, {
            currentMANA: currentDefensorCard.currentMANA,
        })
       

        // saving changes
        await CardService.saveUserCardChanges(currentAttacker.id, currentAttackerCard.cardId, {
            currentHP: currentAttackerCard.currentHP,
        });
        await CardService.saveUserCardChanges(currentDefensor.id, currentDefensorCard.cardId, {
            currentHP: currentDefensorCard.currentHP,
        });

        // returning response dynamically
        response = `**🔥Os dois atacaram, ${currentDefensorCard.name} (${currentDefensor.name}) usou ${DefensorSkill.name} causando ${skillDamageB.damage} de dano e ${currentAttackerCard.name} (${currentAttacker.name}) deu ${damageA} de dano.🗡️**`;
        return response;
        
    }
    else if(AttackerSkill.SkillType === "DAMAGE" && DefensorSkill.SkillType === "DAMAGE") {
        // getting both damages
        const skillDamageA = await SkillService.DamageSkill(AttackerSkill);
        const skillDamageB = await SkillService.DamageSkill(DefensorSkill);
      
        // dealing damage
        currentAttackerCard.currentHP -= skillDamageB.damage;
        currentDefensorCard.currentHP -= skillDamageA.damage;
        

        // costing mana
        currentAttackerCard.currentMANA -= AttackerSkill.cost;
        currentDefensorCard.currentMANA -= DefensorSkill.cost;
        
        // saving HP and mana changes
        await CardService.saveUserCardChanges(currentAttacker.id, currentAttackerCard.cardId, {
            currentHP: currentAttackerCard.currentHP,
        });
        await CardService.saveUserCardChanges(currentDefensor.id, currentDefensorCard.cardId, {
            currentHP: currentDefensorCard.currentHP,
        });
        await CardService.saveUserCardChanges(currentAttacker.id, currentAttackerCard.cardId, {
            currentMANA: currentAttackerCard.currentMANA,
        });
        await CardService.saveUserCardChanges(currentDefensor.id, currentDefensorCard.cardId, {
            currentMANA: currentDefensorCard.currentMANA,
        });

        // returning response dynamically
        response = `**🔥Os dois atacaram, ${currentAttackerCard.name} (${currentAttacker.name}) usou ${AttackerSkill.name} causando ${skillDamageA.damage} de dano e ${currentDefensorCard.name} (${currentDefensor.name}) deu ${skillDamageB.damage} de dano usando ${DefensorSkill.name} 🔥**`;
        return response;
        
    }
}