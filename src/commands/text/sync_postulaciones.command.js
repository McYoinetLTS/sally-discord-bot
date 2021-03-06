const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'e.sallyc sync_postulaciones',
    data: {
        permiso: 'e.sallyc.sync_postulaciones',
        execute: async interaction => {
            const logger = require('../../logger/logger');
            const colors = require('../../logger/colors');
    
            const { google } = require('googleapis');
            const spreadsheetId = process.env.GOOGLE_SHEET_ID;
            const auth = new google.auth.GoogleAuth({
                keyFile: 'credentials.json',
                scopes: ['https://www.googleapis.com/auth/spreadsheets']
            });
                    
            const client = await auth.getClient();
            const googleSheets = google.sheets({ version: "v4", auth: client });
            const range = 'Respuestas!H:H';
    
            googleSheets.spreadsheets.values.get({ auth, spreadsheetId, range }, async (error, result) => {
                if(error) {
                    interaction.channel.send("Hubo un error intentar ejecutar el comando.\n```json" + error + "\n```")
                } else {    
                    const roles = await interaction.guild.roles.fetch(); // Todos los roles
                    let rolPostulante;
    
                    roles.forEach(role => {
                        if(role.name === 'Postulante') rolPostulante = role;
                    });
    
                    // Obtener datos desde Spreadsheets
                    const spreadsheetResult = result.data.values.slice(1); // Devuelve [ ['Valor'], ['Valor'], ['Valor'], ]
                        
                    let spreadsheetUsersMap = new Map(); // Mapa de usuarios (nombre -> id)
    
                    for (let user in spreadsheetResult) {
                        let fullUsername = spreadsheetResult[user][0];
                        spreadsheetUsersMap.set(fullUsername.slice(0, -5), fullUsername.slice(-4));
                    }
    
                    // Obtener datos del servidor
                    const serverUsers = await interaction.guild.members.fetch(); // Obtener lista de usuarios del servidor
                    let users = [] // Array de tipo GuildMember
                    let usersList = '';

                    await serverUsers.forEach(member => {
                        let memberNick = member.user.username;
                        let memberDiscriminator = member.user.discriminator;
                        let memberUsername = memberNick + '#' + memberDiscriminator;
    
                        if(spreadsheetUsersMap.has(memberNick)) {
                            users.push(memberUsername);

                            console.log(`${logger.info} Se agreg?? un usuario para rol: ${colors.blackBg(colors.whiteBlue(memberUsername))}`);
    
                            member.roles.add(rolPostulante);
                        }
                    });

                    await users.forEach(user => {
                        usersList += `${user}\n`;
                    });
    
                    let embed = new MessageEmbed()
                            .setColor(12796415)
                            .setDescription('Se asign?? el rol de **Postulante** a los usuarios de Discord encontrados en la [hoja de c??lculo](https://docs.google.com/spreadsheets/d/1raTbbnk53L9Gko8aLxikmDJmsqCu5tlvkZU6FQ2Ha1c/edit?resourcekey#gid=1601266446) de respuestas del [formulario de postulaci??n](https://forms.gle/iS25LmUNB4oNx4Hx9) que estaban dentro del servidor.')
                            .setTitle('Sincronizaci??n de postulantes')
                            .setFooter('Administraci??n')
                            .setAuthor('Sally')
                            .setTimestamp(new Date().toString())
                            .addFields({
                                name: 'Lista de usuarios',
                                value: '```yaml\n' + usersList + '```'
                            });
                    
                    interaction.channel.send({ embeds: [embed] })                  
                }
            });
        }
    }
}