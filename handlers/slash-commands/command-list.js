const {SlashCommandBuilder} = require('discord.js');
module.exports = [
    /* Cards relational commands */
    // Open Package Command (Package Type, Package Quantity)
    // Show User Collection
    new SlashCommandBuilder()
        .setName("my-cards")
        .setDescription("Exibe uma lista com todas as cartas do jogador"),
    // Show Collection 
    new SlashCommandBuilder()
        .setName('collection')
        .setDescription('Exibe uma lista com todas as cartas da colecção.'),
    // Find card on collection
    new SlashCommandBuilder()
        .setName('f-card')
        .setDescription('Exibe os detalhes de um card da colecção.')
        .addStringOption(option => option.setName('card').setDescription('Selecione um card para exibir os detalhes').setRequired(true)),

    /* User relational commands */
    // Shop list Command
    new SlashCommandBuilder()
        .setName('shop')
       .setDescription('Exibe a loja do DGB.'),
    // Buy Card Command
    new SlashCommandBuilder()
        .setName('b-card')
        .setDescription('Compra um item da loja.')            
        .addStringOption(option => option.setName('card').setDescription('Selecione um card para comprar').setRequired(true)),
    // Sell card Command
    // Sell Card Comman
    new SlashCommandBuilder()
        .setName('s-card')
        .setDescription('Vende um card repetida do seu inventário.')
        .addStringOption(option => option.setName('card').setDescription('Selecione um card para vender').setRequired(true))
        .addIntegerOption(option => option.setName('quantity').setDescription('Selecione uma quantidade de cards para vender').setRequired(true)),
    // Buy Package Command
    new SlashCommandBuilder()
        .setName('b-pack')
        .setDescription('Compra um pacote da loja.')
        .addStringOption(option => 
            option.setName('pack-name')
                .setDescription('Selecione um pacote para comprar')
                .setRequired(true)
        )
        .addIntegerOption(option => 
            option.setName('quantity')
                .setDescription('Selecione uma quantidade de pacotes para comprar')
                .setRequired(true)
        ),
    
    // Work Command (Get Coins)
    new SlashCommandBuilder()
        .setName('work')
        .setDescription('Trabalhe para ganhar uma quantidade de moedas'),
    // Daily Command (Get Coins)
    new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Resgate todo dia uma quantidade de moedas'),
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
    // Add Cash Command
    new SlashCommandBuilder()
        .setName('add-cash')
        .setDescription('Adicione uma quantidade de moedas. (Commando Admin)')
        .addIntegerOption(option => option.setName('cash').setDescription('Selecione uma quantidade de moedas para adicionar').setRequired(true))
        .addUserOption(option => option.setName('user').setDescription('Selecione um usuário para adicionar moedas').setRequired(true)),
    // Remove Cash Command
    new SlashCommandBuilder()
        .setName('remove-cash')
        .setDescription('Adicione uma quantidade de moedas. (Commando Admin)')
        .addIntegerOption(option => option.setName('cash').setDescription('Selecione uma quantidade de moedas para adicionar').setRequired(true))
        .addUserOption(option => option.setName('user').setDescription('Selecione um usuário para adicionar moedas').setRequired(true))
    
    // Remove Card Command
    // Update Card Command
    // Test Command
];