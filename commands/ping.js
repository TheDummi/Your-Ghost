const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../data/config/config.json')
const Discord = require('discord.js')
module.exports = {
    category: "Info",
    detailedDescription: "Get the bot's latency. To say it user friendly, how long the bot takes to get your command, til it replies to you.",
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),

    async execute(interaction) {
        let ping = String(interaction.client.ws.ping);
        let embed = new Discord.MessageEmbed()
            .setTitle('🏓 PONG!')
            .setColor(color)
            .setDescription('My ping: ' + ping + "ms")
        await interaction.reply({ embeds: [embed] });
    },
};