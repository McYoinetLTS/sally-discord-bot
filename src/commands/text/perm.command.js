const { MessageEmbed } = require('discord.js');
const logger = require('../../logger/logger');
const colors = require('../../logger/colors');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'e.sallyc perm',
    data: {
        permiso: 'e.sallyc.perm',
        execute: async (interaction) => {            
            let embed = new MessageEmbed()
                            .setTitle('Administración de permisos')
                            .setFooter('Administración')
                            .setAuthor('Sally')
                            .setTimestamp(new Date().toString());

            
            let args = interaction.content.split(' ').slice(2);

            if(args.length < 3) {
                embed.setColor('#ff7777')
                     .setDescription('Uso:\n e.sallyc perm `<add - remove - list>` `<tipo: members - roles>` `<target>` `[nodo]`.');
                    
                interaction.channel.send({ embeds: [embed] });
            } else {
                const operation = args[0];
                let type = args[1];
                let targetId = args[2];
                const nodo = args[3] ?? 'lista';
                let target;

                let all; // Lista de roles o miembros, depende el type

                switch(type) {
                    case 'roles':
                        all = interaction.guild.roles.cache;
                        break;
                    case 'members':
                        all = interaction.guild.client.users.cache;
                        break;
                }

                targetId = (targetId.startsWith('<@') && targetId.endsWith('>')) ? targetId.slice(3, -1) : targetId;

                target = all.get(targetId);
                
                if(!target) {
                    embed.setColor('#ff7777')
                         .setDescription('No se encontró ningún target con el ID ``' + targetId + '``.');
                    
                    return interaction.channel.send({ embeds: [embed] });
                }

                try {
                    const permisos = await JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'permisos.json')));

                    switch(operation) {
                        case 'add':
                            if(permisos[type][targetId] && permisos[type][targetId].permisos) {
                                if(!permisos[type][targetId].permisos.includes(nodo))
                                    permisos[type][targetId].permisos.push(nodo);
                            } else {
                                permisos[type][targetId] = { permisos: [nodo] };
                            }

                            break;
                        case 'remove':
                            if(permisos[type][targetId] && permisos[type][targetId].permisos.includes(nodo)) {
                                let index = permisos[type][targetId].permisos.indexOf(nodo);
                                permisos[type][targetId].permisos.splice(index, 1);
                            } else {
                                embed.setColor(12796415)
                                     .setDescription(`No se encontró ese permiso en el target ${target} de ID ${targetId}.`);
                                
                                return interaction.channel.send({ embeds: [embed] });
                            }
                            
                            break;
                        case 'list':
                            if(!permisos[type][targetId]) {
                                embed.setColor(12796415)
                                     .setDescription(`El target ${target} no tiene permisos definidos.`);
                            } else {
                                embed.setColor(12796415)
                                    .setDescription(`Mostrando la lista de permisos del target ${target}.`)
                                    .addField('Permisos', 
                                        '```json\n' + JSON.stringify(permisos[type][targetId], null, 4) + '\n```',);
                            }

                            interaction.channel.send({ embeds: [embed] });
                            return;
                    }                    
                    
                    await fs.writeFileSync(path.join(__dirname, '..', '..', 'permisos.json'), JSON.stringify(permisos, null, 4));

                    embed.setColor(12796415)
                         .setDescription('Permisos establecidos.')
                         .addFields(
                            { name: 'Target', value: `${target}`, inline: true},
                            { name: 'ID de target', value: targetId, inline: true},
                            { name: 'Nodo', value: nodo, inline: true},
                            { name: 'Operación', value: operation, inline: true}
                        );
                        
                    return interaction.channel.send({ embeds: [embed] });
                } catch(error) {
                    console.log(`${logger.error} No pudo realizarse la operación ${operation} a los permisos del target ${colors.purpleBg(colors.black(targetId))} (nodo: ${colors.purpleBg(colors.black(nodo))}).`);
                    console.log(`${logger.error} Stacktrace: ${error}`);

                    embed.setColor('#ff7777')
                         .setDescription('Ha ocurrido un error interno.');
                    
                    return interaction.channel.send({ embeds: [embed] });
                }
            }
        }
    }
}