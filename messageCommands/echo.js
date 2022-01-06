const { randColor } = require('../funcs.js')

const Discord = require('discord.js')
module.exports = {
    owner: true,
    name: "echo",
    aliases: ['say'],
    description: '',
    category: "Info",
    detailedDescription: "Get the bot's latency. To say it user friendly, how long the bot takes to get your command, til it replies to you.",

    async execute(message) {
        if (message.content.includes("--embed")) {
            let embed = new Discord.MessageEmbed()
                .setColor(randColor())
                .setDescription(message.content.slice(6).replace('--embed', ""))
            await message.channel.send({ embeds: [embed] });
        }
        else {
            await message.channel.send({ content: message.content.slice(6) });
        }
        await message.delete()
    },
};