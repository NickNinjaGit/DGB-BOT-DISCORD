const {
  Client,
  Events,
  GatewayIntentBits,
} = require("discord.js");
require("dotenv").config();

// utils
const CommandHandler = require("./handlers/slash-commands/command-handler");

// db connection
const conn = require("./db/conn");
// models
const Card = require("./models/Card");
const User = require("./models/User");
const Package = require("./models/Package");
const UserCards = require("./models/UserCards");
const Skill = require("./models/Skill");
// handlers
const handleInteraction = require("./handlers/interaction/interaction-handler.js");
const loadCardCollection = require("./handlers/cards/cardList");

// logger
const logger = require("./logger")

// Client settings
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
// Client init
client.once(Events.ClientReady, async (c) => {
  logger.info(`Ready! Logged in as ${c.user.tag}`);

  try {
    await conn.authenticate();
    await conn.sync({ force: false });
    await loadCardCollection();

    logger.info("Conexão com o banco de dados estabelecida com sucesso!");
  } catch (error) {
    logger.error("Erro ao conectar ao banco de dados:", error);
  }

  CommandHandler.registerCommands();
  //CommandHandler.deleteCommands();
});

// logs gerais
logger.info("Aplicação iniciada com sucesso!");

client.on(
  Events.InteractionCreate,
  async (interaction) => await handleInteraction(interaction)
);

client.login(process.env.TOKEN);
