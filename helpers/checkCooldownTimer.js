const wait = require("node:timers/promises").setTimeout;

module.exports = async function checkCooldownTimer(discordID, interaction, cooldownMapper) {
    if (cooldownMapper.has(discordID)) {
        const remainingTime = cooldownMapper.get(discordID) - Date.now();
        if (remainingTime > 0) {
            const hours = Math.floor(remainingTime / 1000 / 3600);
            const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
            const seconds = Math.floor((remainingTime / 1000) % 60);
            await interaction.reply({
                content: `Você já trabalhou! Volte em **${hours} horas, ${minutes} minutos e ${seconds} segundos.**`,
                ephemeral: true, // Torna a mensagem visível apenas para o usuário
            });
            await wait(3000);
            // Verifica se a interação ainda pode ser deletada
            await interaction.deleteReply().catch(error => {
                console.error('Erro ao deletar a resposta:', error);
            });

            return true; // Usuário está em cooldown
        }
    }
    return false; // Usuário não está em cooldown
}
