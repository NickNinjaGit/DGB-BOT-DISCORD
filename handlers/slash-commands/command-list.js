const {SlashCommandBuilder} = require('discord.js');

module.exports = [
    /* Cards relational commands */
    // Open Package Command (Package Type, Package Quantity)
    // Check User Card List
    // Check Collection Card List
    // Card Details Command
    new SlashCommandBuilder()
        .setName('f-card')
        .setDescription('Exibe os detalhes de um card.')
        .addStringOption(option => option.setName('card').setDescription('Selecione um card para exibir os detalhes').setRequired(true)),
    // Sell Card Command

    /* User relational commands */
    // Shop list Command
    // Buy Item Command
    // Work Command (Get Coins)
    new SlashCommandBuilder()
        .setName('work')
        .setDescription('Trabalhe para ganhar uma quantidade de moedas'),
    // Daily Command (Get Coins)
    // User Profile Command
    new SlashCommandBuilder()
        .setName('my-profile')
        .setDescription('Exibe a sua conta do DGB.'),
    // Friend Profile Command
    new SlashCommandBuilder()
        .setName('friend-profile')
        .setDescription('Exibe a conta de alguém.')
        .addUserOption(option => option.setName('user').setDescription('Selecione um usuário para exibir o perfil').setRequired(true)),
        
    // Leaderboards Command
    // Battle Command

    /* Admin commands */
    // Add Card Command
    // Remove Card Command
    // Update Card Command
    // Test Command

    new SlashCommandBuilder()
        .setName('test')
        .setDescription('Teste de comandos')
];