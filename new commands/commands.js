const { SlashCommandBuilder } = require('@discordjs/builders');
const { color, owners, contributors } = require('../data/config/config.json')
const Discord = require('discord.js')

module.exports = {
    detailedDescription: "Get a list of all commands",
    category: "Help",
    data: new SlashCommandBuilder()
        .setName('commands')
        .setDescription('all commands list'),

    async execute(interaction) {
        let command = interaction.client.commands;
        let commands = [];
        let categories = [];
        let embeds = [];
        const options = [
            "first_option",
            "second_option",
            "third_option",
            "fourth_option",
            "fifth_option",
            "sixth_option"
        ]
        const row = new Discord.MessageActionRow()
        let embed = new Discord.MessageEmbed()
            .setColor(color)
            .setTitle('Commands')
        command.forEach(i => {
            commands.push({ name: i.data.name, description: i.data.description, category: i.category, ownerOnly: i.owner, contributorOnly: i.contributor })
            if (!categories.includes(i.category)) {
                categories.push(i.category)
            }
            if (i.owner) {
                if (owners.includes(interaction.user.id)) {
                    return commands.push(i)
                }
                else return;
            }
            if (i.contributor) {
                if (owners.includes(interaction.user.id)) {
                    return commands.push(i)
                }
                if (contributors.includes(interaction.user.id)) {
                    return commands.push(i)
                }
                else return;
            }
            else commands.push(i)
        })

        let selection = new Discord.MessageSelectMenu()
            .setCustomId("select")
            .setPlaceholder('Select category')

        for (let i = 0; i < categories.length; i++) {
            selection.addOptions([
                {
                    label: categories[i],
                    value: options[i]
                }
            ])
            embeds[i] = new Discord.MessageEmbed()
                .setTitle(categories[i])
                .setColor(color)
            for (const item of command.filter(e => e.category === categories[i])) {
                if (!commands.includes(item)) continue;
                try {
                    embeds[i].addField(item.data.name, String(item.description), true)
                }
                catch {
                    embeds[i].addField(item.data.name, "No description provided", true)
                }
            }
            embed.addField(String(categories[i]), "Page " + i, true)
        }

        row.addComponents(selection)
        let inner = interaction.reply({ embeds: [embed], components: [row] })

        let filter = (inter) => inter.isSelectMenu();
        let collector = interaction.channel.createMessageComponentCollector({ filter, time: 300000 })

        collector.on('collect', (i) => {
            if (interaction.values == options[0]) {
                embed = embeds[0]
            }
            interaction.editReply({ embed: [embed], components: [row] })
        })
    },
};