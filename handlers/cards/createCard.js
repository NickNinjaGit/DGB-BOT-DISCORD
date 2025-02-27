const Card = require('../../models/Card');
const ConvertImage = require('../image-handler').ConvertImage;
const ConvertGif = require('../image-handler').ConvertGif;
const calculateImageHash = require('../../helpers/calculateImageHash');

module.exports = async function createCard(
    name,
    description,
    universe,
    isGif,
    image,
    rarity,
    price,
    sellValue,
    tradable,
    HP,
    MANA,
    ATK,
    DEF,
    SPEED,
    SKILL1,
    SKILL2,
) {
    try {
        // Calcula o hash da imagem
        const hash = await calculateImageHash(image);

        // Verifica se o hash já existe no banco de dados
        const existingCard = await Card.findOne({ where: { imageHash: hash } });
        if (existingCard) {
            console.log('Imagem já existe no banco de dados, usando URL existente.');
            return existingCard; // Retorna o card existente
        }

        // Converte a imagem ou GIF e atualiza a variável `image`
        image = isGif ? await ConvertGif(image) : await ConvertImage(image);


        // Cria o novo card com o hash da imagem
        const card = await Card.create({
            name,
            description,
            universe,
            image, // URL da imagem no Cloudinary
            imageHash: hash, // Salva o hash no banco de dados
            rarity,
            price,
            sellValue,
            tradable,
            HP,
            MANA,
            ATK,
            DEF,
            SPEED,
            SKILL1,
            SKILL2,
        });

        return card;
    } catch (error) {
        console.error('Erro ao criar o card:', error.message);
        throw error;
    }
};