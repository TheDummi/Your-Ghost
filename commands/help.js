const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { color } = require('../data/config/config.json')

module.exports = {
    category: "Help",
    detailedDescription: "Help command gives you more info on a command by running `help command: <command>`.",
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get a help message.')
        .addStringOption((option) =>
            option.setName("command")
                .setDescription('What command would you like more info on?')
        ),

    async execute(interaction) {
        let command = interaction.options.getString('command');
        let commands = [];
        interaction.client.commands.forEach(i => {
            commands.push({ name: i.data.name, description: i.data.description, detailedDescription: i.detailedDescription, ownerOnly: i.owner, contributorOnly: i.contributor, guild: i.homeGuild })
        })
        let embed = new Discord.MessageEmbed()
            .setColor(color)
        if (!command) {
            embed
                .setTitle('Help Command!')
                .setDescription('If you want more info on any command just run this command with a command I have and I\'ll give you the info you need!')
        }
        else {
            for (let i = 0; i < commands.length; i++) {
                if (commands[i].name == command) {
                    embed
                        .setTitle(`Help for ${command}`)
                        .setDescription((commands[i].detailedDescription || commands[i].description) + "\n\nDeveloper only: " + (commands[i].ownerOnly ? "Yes" : "No") + "\nContributor only: " + (commands[i].contributorOnly ? "Yes" : "No") + "\nMain server only: " + (commands[i].guild ? "Yes" : "No"))
                    break;
                }
                else embed
                    .setTitle(`No command ${command} found!`)
                    .setDescription(`Couldn't find help for ${command}.`)
            }
        }
        await interaction.reply({ embeds: [embed] });
    },
};