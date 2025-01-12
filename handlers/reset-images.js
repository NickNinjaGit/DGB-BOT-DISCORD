const cloudinary = require('cloudinary').v2;
const path = require('path');
const env_dir = path.resolve(__dirname, '../.env');
require('dotenv').config({ path: env_dir });

// Configuração do Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Função para listar e deletar os arquivos na raiz
const deleteFilesInHome = async () => {
    try {
        // Listar os arquivos no diretório raiz
        const resources = await cloudinary.api.resources({
            type: 'upload', // Especifica que são recursos enviados
            max_results: 500, // Define o máximo de recursos retornados (até 500 por vez)
        });

        // Pegar os public_ids dos arquivos na raiz
        const publicIds = resources.resources.map((resource) => resource.public_id);

        if (publicIds.length === 0) {
            console.log('Não há arquivos na pasta "home" para deletar.');
            return;
        }

        // Deletar os arquivos usando os public_ids
        const deleteResult = await cloudinary.api.delete_resources(publicIds);

        console.log('Arquivos deletados com sucesso:', deleteResult);
    } catch (error) {
        console.error('Erro ao deletar os arquivos na pasta "home":', error);
    }
};

// Chamar a função
deleteFilesInHome();
