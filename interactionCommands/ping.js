const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../data/config/config.json');
const Discord = require('discord.js');

module.exports = {
    detailedDescription: "ping",
    category: "Info",
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('ping'),
    async execute(interaction) {
        let m = await interaction.channel.send('calculating...')
        m.delete()
        let ping = String(interaction.client.ws.ping);
        let api = String(m.createdTimestamp - interaction.createdTimestamp)
        let embed = new Discord.MessageEmbed()
            .setTitle("PONG")
            .setColor(color)
            .setDescription(`API: ${api}ms.\nBot: ${ping}ms.`)
            .setTimestamp()
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.avatarURL({ dynamic: true }) })
        interaction.reply({ embeds: [embed] });
    },
};