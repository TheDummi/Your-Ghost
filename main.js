const Discord = require('discord.js')
const fs = require('fs')
const moment = require('moment')
const { clientID, guildID, token, prefix } = require('./data/config/config.json');

const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES
    ]
});

client.commands = new Discord.Collection()
client.message_cache = {}

const commands = [];

const interactionCommandFiles = fs.readdirSync('./interactionCommands').filter(file => file.endsWith('.js'));
const messageCommandFiles = fs.readdirSync('./messageCommands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

let time = moment(Number(new Date())).format('H:mm:ss')
let str = `${time} | Loaded events: ${Array.from(eventFiles).join(', ')}\n${time} | Loaded interaction commands: ${Array.from(interactionCommandFiles).join(', ')}\n${time} | Loaded message commands: ${Array.from(messageCommandFiles).join(', ')} `
console.log(str.replace(/.js/g, ""))

for (const file of interactionCommandFiles) {
    const command = require(`./interactionCommands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command)
}

for (const file of messageCommandFiles) {
    const command = require(`./messageCommands/${file}`);
    client.commands.set(command.name, command)
}

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => {
            event.execute(...args, commands)
        })
    }
    else {
        client.on(event.name, (...args) => {
            event.execute(...args, commands)
        })
    }
}
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

client.login(token);