// Importing
require('dotenv').config();

const logger = require('./logger/logger');
const colors = require('./logger/colors');

const { Client, Intents} = require('discord.js');
const token = process.env.TOKEN;
const commandManager = require('./commands/text/commandManager');

const client = new Client({ intents: new Intents(32767)});
const { Collection } = require('discord.js');

client.commands = new Collection();

client.once('ready', async () => {
    const botName = colors.blackBg(colors.whiteBlue(client.user.username + '#'+ client.user.discriminator));

    console.log(`${logger.info} Iniciando bot...`);
    const resultCommands = await commandManager.registerCommands(client);
    
    console.log(`${logger.info} El bot fue encendido. Nombre de usuario: ${botName}.`);

    if(!resultCommands === true) {
        console.log(`${logger.warning} Los comandos no fueron registrados correctamente.`);
    }
});

client.on('messageCreate', async interaction => {
    const message = interaction.content;

    if(!client.commands.has(message) || interaction.member.user.bot) return;

    console.log(`${logger.info} El usuario ${colors.blackBg(colors.whiteBlue(interaction.member.user.username + '#' + interaction.member.user.discriminator))} ejecutó el comando ${colors.blackBg(colors.cyan(message))}`);

    client.commands.get(message).execute(interaction);
});

client.login(token);