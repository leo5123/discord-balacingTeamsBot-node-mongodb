const fs = require('fs')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')

module.exports = (client) => {
    client.handleCommands = async () => {
        const commandFolders = fs.readdirSync(`./src/commands`);
        for (const folder of commandFolders) {
            const commandsFiles = fs.readdirSync(`./src/commands/${folder}`)
                .filter(file => file.endsWith('.js'));

            const { commands, commandArray } = client;
            for (const file of commandsFiles) {
                const command = require(`../../commands/${folder}/${file}`);
                commands.set(command.data.name, command);
                commandArray.push(command.data.toJSON())

            }
        }

        const clientId = '1048689708194070618'

        const rest = new REST({ version: '9' }).setToken(process.env.token2);
        try {
            console.log('Started refreshing application (/) commands.');

            await rest.put(Routes.applicationCommands(clientId), {

                body: client.commandArray,
            });

            console.log('Successfully reloaded application (/) commands.')
        } catch (error) {
            console.error(error)
        }
    }
}