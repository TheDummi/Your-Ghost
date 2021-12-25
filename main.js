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

const commands = [];

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

let time = moment(Number(new Date())).format('H:mm:ss')
let str = `${time} | Loaded ${eventFiles}\n${time} | Loaded ${commandFiles}`
console.log(str.replace(/.js,/g, ", "))

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command)
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


client.login(token);