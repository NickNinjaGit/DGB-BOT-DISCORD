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
const UserCards = require("./models/UserCards");
const Skill = require("./models/Skill");
// handlers
const handleInteraction = require("./handlers/interaction-handler.js");
const loadCardCollection = require("./handlers/cards/cardList");

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
  console.log(`Ready! Logged in as ${c.user.tag}`);
  try {
    await conn.authenticate();
    await conn.sync();
    //await conn.sync({ force: true });
    await loadCardCollection();

    console.log("Connected to database!");
  } catch (error) {
    console.log("An error occurred while connecting to the database:", error);
  }
  CommandHandler.registerCommands();
  // CommandHandler.deleteCommands();
});

client.on(
  Events.InteractionCreate,
  async (interaction) => await handleInteraction(interaction)
);

client.login(process.env.TOKEN);
