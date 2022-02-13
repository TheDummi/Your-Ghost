const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientID, guildID, token, prefix, global } = require('../data/config/config.json');
const { getTime, getDataBase } = require('../funcs.js')

const moment = require('moment');
const Sequelize = require('sequelize');


module.exports = {
    name: 'ready',
    once: true,
    async execute(client, commands) {
        console.log(`${getTime(new Date())} | ${client.user.username} is online`);
        const rest = new REST({ version: '9' }).setToken(token);
        (async () => {
            try {
                if (global == true) {
                    rest.put(Routes.applicationCommands(clientID), {
                        body: commands
                    })
                    let guilds = await client.guilds.fetch()
                    await console.log(`${getTime(new Date())} | Successfully loaded application commands globally in ${guilds.size} guilds.`)
                }
                else {
                    rest.put(Routes.applicationGuildCommands(clientID, guildID), {
                        body: commands
                    })
                    await console.log(`${getTime(new Date())} | Successfully loaded application commands locally.`)
                }
            }
            catch (error) {
                await console.log(`${getTime(new Date())} | Loading application commands failed.`, error)
            }
        })();

        getDataBase().guilds.sync().then(() => console.log(`${getTime(new Date())} | Successfully synced guilds`)).catch(error => console.log(error))
        getDataBase().users.sync().then(() => console.log(`${getTime(new Date())} | Successfully synced users`)).catch(error => console.log(error))
    }
}
