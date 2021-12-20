const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('staff_apply_sync')
            .setDescription('Asigna el rol de Postulante a los usuarios que enviaron el formulario mediante la Google Sheet API.'),
        
        async execute(interaction) {
            interaction.reply('Executed');
        }
}