const fs = require('fs');
const path = require('path');
const logger = require('../../logger/logger');
const colors = require('../../logger/colors');

async function registerCommands(client) {
    try {
        console.log(`${logger.info} Registrando comandos...`);

        const allFiles = await fs.readdirSync(path.join(__dirname));
        const commands = await allFiles.filter(file => file.endsWith('.command.js'))

        await commands.forEach(file => {
            const command = require(path.join(__dirname, `${file}`));

            const msgFile = colors.green(file);
            const msgCommand = colors.blackBg(colors.cyan(command.name));
            const msgName = colors.blackBg(colors.purple('name'));
            const msgExecute = colors.blackBg(colors.purple('execute'));

            if (command.name != null && command.data.permiso !== undefined && command.data.execute != null){
                client.commands.set(command.name, command.data);
                console.log(`${logger.info} Se registró el comando ${msgCommand} del archivo "${msgFile}".`);
            } else {
                console.log(`${logger.warning} El archivo de comando "${msgFile}" no contiene las propiedades de ${msgName} o ${msgExecute}.`);
            }
        });

        console.log(`${logger.info} Registro de comandos finalizado.`);
        return true;
    } catch(error) {
        console.log(`${logger.error} Hubo un error al registrar los comandos.`)
        console.log(`${logger.error} Stacktrace: ${error}`);
        return error;
    }
    
}

module.exports = { registerCommands };