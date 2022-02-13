const { color, token } = require('../data/config/config.json')
const Discord = require('discord.js')

module.exports = {
    owner: true,
    name: "clear",
    aliases: [""],
    category: "Developer",
    description: "Clear given amount of messages",
    detailedDescription: "hi",

    async execute(message, args) {
        if (isNaN(Number(args))) return message.reply('Please specify a number')
        if (args == undefined) args = 1;
        let amount = Number(args);
        let embed = new Discord.MessageEmbed()
            .setColor(color)
        if (amount > 100) message.reply({ content: 'There is a maximum of 100 messages.' })
        else if (amount < 0) message.reply({ content: 'You can\'t clear less than 0.' })
        else {
            try {
                await message.channel.bulkDelete(amount)
            }
            catch (e) {
                await embed.setTitle(String(e.message))
                let m = await message.reply({ embeds: [embed] })
                setTimeout(() => {
                    m.delete()
                }, 5000)
            }

        }
    }
};