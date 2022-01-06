const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientID, guildID, token, prefix, global } = require('../data/config/config.json');
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
                if (global == true) {
                    rest.put(Routes.applicationCommands(clientID), {
                        body: commands
                    })
                    let guilds = await client.guilds.fetch()
                    let time = moment(Number(new Date())).format("H:mm:ss")
                    await console.log(`${time} | Succesfully loaded application commands globally in ${guilds.size} guilds.`)
                }
                else {
                    rest.put(Routes.applicationGuildCommands(clientID, guildID), {
                        body: commands
                    })
                    let time = moment(Number(new Date())).format("H:mm:ss")
                    await console.log(`${time} | Succesfully loaded application commands locally.`)
                }
            }
            catch (error) {
                let time = moment(Number(new Date())).format("H:mm:ss")
                await console.log(`${time} | Loading application commands failed.`, error)
            }
        })();
    }
}
