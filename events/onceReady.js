const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientID, guildID, token, prefix } = require('../data/config/config.json');
const moment = require('moment');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client, commands) {
        let time = moment(Number(new Date())).format("H:mm:ss")
        console.log(`${time} | ${client.user.username} is online`);

        const rest = new REST({ version: '9' }).setToken(token);

        (async () => {
            try {
                rest.put(Routes.applicationGuildCommands(clientID, guildID), {
                    body: commands
                })
                let time = moment(Number(new Date())).format("H:mm:ss")
                await console.log(`${time} | Succesfully loaded application commands.`)
            }
            catch (error) {
                let time = moment(Number(new Date())).format("H:mm:ss")
                await console.log(`${time} | Loading application commands failed.`, error)
            }
        })();
    }
}
