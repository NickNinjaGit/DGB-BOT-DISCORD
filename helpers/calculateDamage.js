const randomic = Math.random().toFixed(2);
async function ApplyDamage(ATK) {
    // Calcula o dano através do ataque fixo vezes o fator RNG entre 0 e 1.
    
    let Damage = ATK * randomic
    Damage = Math.floor(Damage);
    const minDamage = Math.floor(ATK - ATK/2);

    // Evita que o dano seja menor que 50% do ataque
    if (Damage < minDamage) {
        Damage = minDamage;
    }
    const critChance = 0.2;
    const critRoll = Math.random();
    // Acerto Crítico
    if (critRoll < critChance) {
        const critDamage = Damage * 2;
        const critMessage = `Acerto Crítico! de ${Damage} para ${critDamage}`
        return critDamage;
    }
    return Damage;
}
async function Defend(DEF, Damage) {
    // Aplica a fórmula de redução escalonada de dano
    const damageReductionFactor = DEF / (Damage + DEF);
    const Defense = Damage * (1 - damageReductionFactor);

    // Se a defesa for muito forte, o defensor pode "recuperar" um pouco do dano perdido
    if (Defense >= Damage) {
        Defense += Defense / 2;
    }
    return Defense.toFixed(0);
}

module.exports = { ApplyDamage, Defend };