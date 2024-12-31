const { REST, Routes } = require('discord.js');
const commandList = require('./command-list');
require('dotenv').config();
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// deleting commands
function registerCommands() {
  rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {body: commandList})
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
}

function deleteCommands() {
  rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] })
  .then(() => console.log('Successfully deleted all application commands.'))
  .catch(console.error);
}


module.exports = { registerCommands, deleteCommands };
