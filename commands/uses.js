const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { color } = require('../data/config/config.json')
const uses = require('../data/user/uses.json')

module.exports = {
    category: "Info",
    detailedDescription: "Get a list of your used commands, these are in the order of when you used the command for the first time.\n\n`/uses` does not count.",
    data: new SlashCommandBuilder()
        .setName('uses')
        .setDescription('Get a list of your most used commands.'),

    async execute(interaction) {
        function getUses() {
            if (!uses[interaction.user.id]) {
                return "You have no used commands yet ;("
            }
            else {
                let use = uses[interaction.user.id].uses;
                let str = "";
                let val = 0;
                for (let i = 0; i < Object.keys(use).length; i++) {
                    str += String(Object.entries(use)[i]).replace(',', ': ') + "\n";
                    val += Object.values(use)[i];
                }

                return { commands: str, total: val };
            }
        }
        let embed = new Discord.MessageEmbed()
            .setAuthor({ name: 'Your most used commands', iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setDescription(getUses().commands)
            .setColor(color)
            .setFooter({ text: `In total you've used ${getUses().total} commands!` })
        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};