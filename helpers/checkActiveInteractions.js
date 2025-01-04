module.exports = async function checkActiveInteractions(userId, activeInteractions) {
    if (activeInteractions.has(userId)) {
        // Marcar a interação como ativa
        return true;
    } else {
        activeInteractions.add(userId);
        return false;
    }

  
}