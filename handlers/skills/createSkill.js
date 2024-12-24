// image handler
const ConvertImage = require('../image-handler').ConvertImage;
const ConvertGif = require('../image-handler').ConvertGif;
const Skill = require('../../models/Skill');
const calculateImageHash = require('../../helpers/calculateImageHash');

module.exports = async function createSkill(name, description, isGif, image, cost, SkillType, SkillValue, StatusChangeType, SkillMultiplier, acurracy, hitTimes, duration) {
    
    // Calcula o hash da imagem
    const hash = await calculateImageHash(image);

    // Verifica se o hash já existe no banco de dados
    const existingCard = await Skill.findOne({ where: { imageHash: hash } });
    if (existingCard) {
        console.log('Imagem já existe no banco de dados, usando URL existente.');
        return existingCard; // Retorna o card existente
    }

    // Converte a imagem ou GIF e atualiza a variável `image`
    image = isGif ? await ConvertGif(image) : await ConvertImage(image);

    const skill = await Skill.create(
        { 
            name, 
            description, 
            image, 
            imageHash: hash,
            cost, 
            SkillType, 
            SkillValue,
            StatusChangeType,
            SkillMultiplier, 
            acurracy, 
            hitTimes, 
            duration,
        });
    return skill;
}