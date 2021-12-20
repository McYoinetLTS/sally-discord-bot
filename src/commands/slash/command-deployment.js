// Importing
require('dotenv').config();

const token = process.env.TOKEN;
const clientid = process.env.CLIENT_ID;

const fs = require('fs');
const path = require('path')
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

let commands = [];

const readCommands = client => {
    fs.readdirSync(path.join(__dirname))
    .filter(file => file.endsWith('.command.js'))
    .forEach(file => {
        const command = require(path.join(__dirname, `${file}`));

        commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);

        console.log('Comando registrado:', command.data.name);
    });
}

const rest = new REST({ version: 9 }).setToken(token);

async function loadCommands(client) {
    await readCommands(client);

    rest.put(Routes.applicationCommands(clientid), { body: commands })
	.then(() => console.log('Comandos slash ("/") registrados satisfactoriamente.'))
	.catch(error => console.log('Hubo un error al intentar registrar los comandos slash:', error));
}

module.exports = { loadCommands };