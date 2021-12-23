const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'sally!info',
    data: {
        permiso: null,
        execute: async interaction => {
            let embed = new MessageEmbed()
                            .setColor(12796415)
                            .setDescription('Estas son las plataformas y los medios de contacto que utiliza el servidor.')
                            .setTitle('Información')
                            .setFooter('Soporte')
                            .setAuthor('Sally')
                            .setTimestamp(new Date().toString())
                            .addFields(
                                { name: 'IP <:minecraft_icon:922591310425260063>', value: 'mc.sally.net', inline: true },
                                { name: 'Discord <:discord_icon:922592062367465482>', value: 'https://discord.link/sally', inline: true },
                                { name: 'TeamSpeak <:teamspeak_icon:922592427938820106>', value: 'ts.sally.net', inline: true },
                                { name: 'Sitio web', value: 'https://sally.net/', inline: true },
                                { name: 'Twitter <:twitter_icon:922592947323699231>', value: 'https://twitter.com/Sally', inline: true },
                                { name: 'Correo electrónico <:email_icon:922592834052296794>', value: 'contacto@sally.net', inline: true }
                            );
            
            interaction.channel.send({ embeds: [embed] });
        }
    }
}