const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { title, description, icon, examples, changes, message } = require('../data/config/update.json')
const { color } = require('../data/config/config.json')

module.exports = {
    category: "Info",
    detailedDescription: "Get the latest news on what the bot has to offer.",
    data: new SlashCommandBuilder()
        .setName('new')
        .setDescription('Get the latest news on what\'s new.'),

    async execute(interaction) {
        let embed = new Discord.MessageEmbed()
            .setTitle(title)
            .setDescription(description)
            .setFooter({ text: '- Dummi' })
            .setTimestamp()
            .setImage(icon)
            .setColor(color)
        if (examples != "") {
            embed.addField('Examples', examples, true)
        }
        if (changes != "") {
            embed.addField('Changes', changes, true)
        }
        if (message != "") {
            embed.addField('Message of the dev', message)
        }
        await interaction.reply({ embeds: [embed] });
    },
};