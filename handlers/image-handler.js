const cloudinary = require('cloudinary').v2;
const path = require('path');
const env_dir = path.resolve(__dirname, '../.env');
require('dotenv').config({ path: env_dir });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function ConvertImage(imageURL) {
    try {
        // Upload da imagem
        const result = await cloudinary.uploader.upload(imageURL);

        // Gerar a URL transformada
        const url = cloudinary.url(result.public_id, {
            transformation: [
                {
                    width: 555,
                    height: 555,
                    crop: "fill",
                    gravity: 'auto',
                },
                {
                    quality: "auto",
                    fetch_format: "auto",
                },
                {
                    effect: 'improve',
                    improve: 'outdoor',
                },
            ],
        });

        return url;
    } catch (error) {
        console.error('Erro ao fazer upload da imagem:', error.message);
    }
}

async function ConvertGif(gifURL) {
    try {
        // Upload da imagem
        const result = await cloudinary.uploader.upload(gifURL);
        console.log('Imagem carregada com sucesso!');
        // console.log('Secure URL:', result.secure_url);

        // Gerar a URL transformada
        const url = cloudinary.url(result.public_id, {
            format: 'gif',
            transformation: [
                {
                    width: 555,
                    height: 555,
                    crop: "fill",
                    gravity: 'auto',
                },
                {
                    quality: "auto",
                    fetch_format: "auto",
                },
                {
                    effect: 'improve',
                    improve: 'outdoor',
                },
            ],
        });
        console.log('URL transformada:', url);
        return url;
    } catch (error) {
        console.error('Erro ao fazer upload da imagem:', error.message);
    }
}
module.exports = { ConvertImage, ConvertGif };

