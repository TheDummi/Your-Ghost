const Discord = require('discord.js')
const { getRandomNumber, getColor, getItem, getPresence, getArray, getRandomUser, getRandomEmojis, getShuffleArray, getUptime, getHaste, getCapitalize, getCommandError, getDelay, getValidURL, getPaginate } = require("../funcs.js")
const { inspect, promisify } = require("util")
const { exec } = require('child_process')
const config = require('../data/config/config.json')
const trivia = require('../data/game/trivia.json')
const destiny = require('../data/game/destiny.json')
const options = require('../data/config/options.json')

let sh = promisify(exec)
const clean = (text) => {
    if (typeof text === 'string') return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
    else return text;
};
module.exports = {
    owner: true,
    name: "eval",
    aliases: ["ev"],
    category: "Developer",
    detailedDescription: "Evaluate any code given to the JavaScript Language.",
    description: "e",
    async execute(message, args) {

        const embed = new Discord.MessageEmbed();
        let code = message.content.replace(config.prefix + "eval", "");
        try {
            const member = message.member,
                client = message.client,
                bot = message.client,
                guild = message.guild,
                channel = message.channel,
                members = message.guild.members,
                roles = message.guild.roles,
                channels = message.client.channels,
                users = message.client.users,
                commands = message.client.commands;
            let output;
            output = await eval(code);
            output = await output;
            if (typeof output !== 'string') output = inspect(output)
            output = await output.replace(new RegExp(message.client.token, 'g'), '[token omitted]');
            output = await clean(output);
            embed
                .setTitle('✅ Evaled code successfully')
                .addField('📥 Input', code.length > 1012 ? 'Too large to display. Hastebin: ' + (await getHaste(code)) : '```js\n' + code + '```')
                .addField('📤 Output', output.length > 1012 ? 'Too large to display. Hastebin: ' + (await getHaste(output)) : '```js\n' + output + '```')
                .setColor('#66FF00')
                .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();
        } catch (e) {
            embed
                .setTitle('❌ Code was not able to be evaled')
                .addField('📥 Input', code.length > 1012 ? 'Too large to display. Hastebin: ' + (await getHaste(code)) : '```js\n' + code + '```')
                .addField('📤 Output', e.length > 1012 ? 'Too large to display. Hastebin: ' + (await getHaste(e)) : '```js\n' + e + '```Full stack: ' + (await getHaste(e.stack)))
                .setColor('#FF0000')
                .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();
        }
        await message.reply({ embeds: [embed] })
    }
}