const { SlashCommandBuilder } = require("discord.js");
module.exports = [
  /* Cards relational commands */
  // Open Package Command (Package Type, Package Quantity)
  new SlashCommandBuilder()
    .setName("o-pack")
    .setDescription("Abre um pacote")
    .addStringOption((option) =>
      option
        .setName("pack-name")
        .setDescription("Selecione um pacote para abrir")
        .setRequired(true)
    ),
  // Show User Collection
  new SlashCommandBuilder()
    .setName("my-cards")
    .setDescription("Exibe uma lista com todas as cartas do jogador"),
  // Show Collection
  new SlashCommandBuilder()
    .setName("collection")
    .setDescription("Exibe uma lista com todas as cartas da colecção."),
  // Find card on collection
  new SlashCommandBuilder()
    .setName("f-card")
    .setDescription("Exibe os detalhes de um card da colecção.")
    .addStringOption((option) =>
      option
        .setName("card")
        .setDescription("Selecione um card para exibir os detalhes")
        .setRequired(true)
    ),
  // Set default Stardom Command
  new SlashCommandBuilder()
    .setName("stardom")
    .setDescription("Defina a imagem de estrelato para de um card.")
    .addStringOption((option) =>
      option
        .setName("card")
        .setDescription(
          "Selecione o card que deseje configurar a imagem de estrelato"
        )
        .setRequired(true)
    ),
  /* User relational commands */
  // Shop list Command
  new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Exibe a loja do DGB."),
  // Buy Card Command
  new SlashCommandBuilder()
    .setName("b-card")
    .setDescription("Compra um item da loja.")
    .addStringOption((option) =>
      option
        .setName("card")
        .setDescription("Selecione um card para comprar")
        .setRequired(true)
    ),
  // Sell Card Comman
  new SlashCommandBuilder()
    .setName("s-card")
    .setDescription("Vende um card repetida do seu inventário.")
    .addStringOption((option) =>
      option
        .setName("card")
        .setDescription("Selecione um card para vender")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("quantity")
        .setDescription("Selecione uma quantidade de cards para vender")
        .setRequired(true)
    ),
  // Buy Package Command
  new SlashCommandBuilder()
    .setName("b-pack")
    .setDescription("Compra um pacote da loja.")
    .addStringOption((option) =>
      option
        .setName("pack-name")
        .setDescription("Selecione um pacote para comprar")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("quantity")
        .setDescription("Selecione uma quantidade de pacotes para comprar")
        .setRequired(true)
    ),

  // Buf inventory slots Command
  new SlashCommandBuilder()
    .setName("b-inventory")
    .setDescription("Compre mais espaco para suas cartas no inventário.")
    .addIntegerOption((option) =>
      option
        .setName("quantity")
        .setDescription("Selecione uma quantidade de espaco para comprar")
        .addChoices([
            { name: '5', value: 5 },
            { name: '10', value: 10 },
            { name: '20', value: 20 },
            { name: '40', value: 40 },
        ])
        .setRequired(true)
    ),

  // Work Command (Get Coins)
  new SlashCommandBuilder()
    .setName("work")
    .setDescription("Trabalhe para ganhar uma quantidade de moedas"),
  // Daily Command (Get Coins)
  new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Resgate todo dia uma quantidade de moedas"),
  // User Profile Command
  new SlashCommandBuilder()
    .setName("my-profile")
    .setDescription("Exibe a sua conta do DGB."),
  // Friend Profile Command
  new SlashCommandBuilder()
    .setName("friend-profile")
    .setDescription("Exibe a conta de alguém.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Selecione um usuário para exibir o perfil")
        .setRequired(true)
    ),

  // Leaderboards Command
  // Battle Command

  /* Admin commands */
  // Add Card Command
  // Add Cash Command
  new SlashCommandBuilder()
    .setName("add-cash")
    .setDescription("Adicione uma quantidade de moedas. (Commando Admin)")
    .addIntegerOption((option) =>
      option
        .setName("cash")
        .setDescription("Selecione uma quantidade de moedas para adicionar")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Selecione um usuário para adicionar moedas")
        .setRequired(true)
    ),
  // Remove Cash Command
  new SlashCommandBuilder()
    .setName("remove-cash")
    .setDescription("Adicione uma quantidade de moedas. (Commando Admin)")
    .addIntegerOption((option) =>
      option
        .setName("cash")
        .setDescription("Selecione uma quantidade de moedas para adicionar")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Selecione um usuário para adicionar moedas")
        .setRequired(true)
    ),

  // Remove Card Command
  // Update Card Command
  // Test Command
];
