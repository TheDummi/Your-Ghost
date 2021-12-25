const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const { color } = require('../data/config/config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Replies with your avatar!')
        .addMentionableOption((option) =>
            option
                .setName('user')
                .setDescription('Mention a user to get their avatar')
        ),
    async execute(interaction) {
        let user = interaction.options.getMentionable('user') || interaction;
        let embed = new Discord.MessageEmbed()
            .setTitle(`${user.user.username}'s avatar`)
            .setColor(color)
            .setURL(user.user.avatarURL({ dynamic: true, size: 4096 }) || user.avatarURL({ dynamic: true, size: 4096 }))
            .setImage(user.user.avatarURL({ dynamic: true, size: 4096 }) || user.avatarURL({ dynamic: true, size: 4096 }))
        await interaction.reply({ embeds: [embed], ephemeral: false });
    },
};