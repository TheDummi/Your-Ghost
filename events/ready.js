const { getPresence, getRandomColor, getRandomNumber } = require("../funcs.js")
const Discord = require('discord.js')

module.exports = {
    name: 'ready',

    async execute(client) {
        getPresence(client, 'LISTENING', 'the Traveler\'s wake', 'online')
        setInterval(() => {
            let presences = [
                `the Traveler`,
                `the Vex`,
                `the Fallen`,
                `the Hive`,
                `the Cabal`,
                `the taken taking over`,
            ];
            getPresence(client, 'WATCHING', presences[getRandomNumber(presences.length)], 'idle')
        }, 300000)

        let roles = new Discord.Collection()
        client.guilds.cache.forEach(g => {
            g.roles.cache.forEach(r => {
                roles.set(r.id, r)
            })
        })

        roles.get('id')
        let level = roles.get('806418917941182484')
        setInterval(async function () {
            await level.edit({
                color: getRandomColor(),
            })
        }, 600000);

        let VLevel = roles.get('806418905467584553')
        setInterval(async function () {
            await VLevel.edit({
                color: getRandomColor(),
            })
        }, 600000);

    }
}
