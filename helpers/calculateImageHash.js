const crypto = require('crypto');

async function calculateImageHash(imageURL) {
    try {
        const hash = crypto.createHash('sha256').update(imageURL).digest('hex');
        return hash;
    } catch (error) {
        console.error('Erro ao calcular hash da imagem:', error.message);
        throw error;
    }
}

module.exports = calculateImageHash;