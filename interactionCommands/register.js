const { SlashCommandBuilder } = require('@discordjs/builders');
const { color, AuthorizationURL, APIClientID } = require('../data/config/config.json');
const Discord = require('discord.js');

module.exports = {
    detailedDescription: "ping",
    category: "Destiny",
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('register'),
    async execute(interaction) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Register")
            .setColor(color)
            .setDescription(`You can register by clicking [this](${AuthorizationURL}?client_id=${APIClientID}&response_type=code).`)
            .setTimestamp()
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.avatarURL({ dynamic: true }) })
        interaction.reply({ embeds: [embed] });
    },
};