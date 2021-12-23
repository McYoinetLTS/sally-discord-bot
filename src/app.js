// Importing
require('dotenv').config();

const logger = require('./logger/logger');
const colors = require('./logger/colors');

const { Client, Intents, MessageEmbed, Permissions } = require('discord.js');
const token = process.env.TOKEN;
const commandManager = require('./commands/text/commandManager');

const client = new Client({ intents: new Intents(32767)});
const { Collection } = require('discord.js');

const userPrefix = 'sally!';
const adminPrefix = 'e.sallyc';

// Verificar config
const baseConfig = {
    roles: {},
    members: {}
}

const fs = require('fs');
const path = require('path').join(__dirname, 'permisos.json');
if(!fs.existsSync(path)) {
    fs.writeFileSync(path, JSON.stringify(baseConfig, null, 4));
}

const permisosDB = require('./permisos.json');

if(!permisosDB.roles) {
    permisosDB.roles = JSON.stringify({}, null, 4);
} else if(!permisosDB.members) {
    permisosDB.members = JSON.stringify({}, null, 4);
}

fs.writeFileSync(path, JSON.stringify(permisosDB));

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

    if(interaction.member.user.bot || !(message.startsWith(userPrefix) || message.startsWith(adminPrefix))) return;

    let existe = [];
    
    client.commands.forEach((value, key) => {
        if(message.includes(key)) {
            const permiso = value.permiso;

            let permitido;
                        
            interaction.member.roles.cache.forEach(role => {
                if (permisosDB.roles[role.id] && permisosDB.roles[role.id].permisos.includes(permiso)) {
                    return permitido = true;
                } 
            });
            
            permitido = interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);

            if(permiso == null) permitido = true;

            if(permitido) {
                console.log(`${logger.info} El usuario ${colors.blackBg(colors.whiteBlue(interaction.member.user.username + '#' + interaction.member.user.discriminator))} ejecutó el comando ${colors.blackBg(colors.cyan(message))}`);
                
                value.execute(interaction, client);
            } else {
                let embed = new MessageEmbed()
                            .setTitle('Servicio de comandos')
                            .setFooter('Administración')
                            .setAuthor('Sally')
                            .setTimestamp(new Date().toString())
                            .setColor('#ff7777')
                            .setDescription('Permisos insuficientes.');
                
                interaction.channel.send({ embeds: [embed] });

                console.log(`${logger.info} El usuario ${colors.blackBg(colors.whiteBlue(interaction.member.user.username + '#' + interaction.member.user.discriminator))} intentó ejecutar el comando ${colors.blackBg(colors.cyan(message))} sin permiso suficiente.`);
            }
            
            existe.push(true);
            return;
        } else existe.push(false);
    });

    if(!existe.includes(true)) {
        let embed = new MessageEmbed()
                            .setTitle('Comando desconocido')
                            .setFooter('Administración')
                            .setAuthor('Sally')
                            .setTimestamp(new Date().toString())
                            .setDescription('Ese comando no existe.')
                            .setColor('#ff7777');
            
        interaction.channel.send({ embeds: [embed] });
    }
});

client.login(token);