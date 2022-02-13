const { SlashCommandBuilder } = require('@discordjs/builders');
const { getCommandError, getRandomNumber } = require('../funcs.js');
const { color, owners, contributors } = require('../data/config/config.json');
const Discord = require('discord.js');
const options = require('../data/config/options.json');
const help = require('../data/config/help.json');

module.exports = {
    detailedDescription: "help",
    category: "Info",
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription("help")
        .addStringOption((option) =>
            option
                .setName('command')
                .setDescription("command")
        ),
    async execute(interaction) {
        let command = interaction.options.getString('command');
        let titles = [];
        let embeds = [];
        let row = new Discord.MessageActionRow()
        let comp = new Discord.MessageSelectMenu()
            .setPlaceholder("Choose a category.")
            .setCustomId(`${interaction.id}-dropdownmenu`)
        let embed = new Discord.MessageEmbed()
            .setAuthor({ name: "help", iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setColor(color)
            .setDescription("help")
            .setTimestamp()
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        row.addComponents(comp.addOptions({ label: 'Categories', value: "index" }))
        if (command == null) {
            interaction.client.commands.map(c => {
                if (!titles.includes(c.category)) {
                    if (!owners.includes(interaction.user.id) && !contributors.includes(interaction.user.id)) {
                        if (c.category != 'Developer' || c.category != 'Contributor') {
                            return titles.push(c.category)
                        }
                    }
                    else if (!owners.includes(interaction.user.id)) {
                        if (c.category != 'Developer') {
                            return titles.push(c.category)
                        }
                    }
                    else if (!contributors.includes(interaction.user.id)) {
                        if (c.category != 'Contributor') {
                            return titles.push(c.category)
                        }
                    }
                }
            })
            let i = 0
            titles.map(t => {
                embed.addField(t + " " + "commands", help[t.toLowerCase()] || "No description yet")
                let newEmbed = new Discord.MessageEmbed()
                    .setTitle(`${t} commands`)
                    .setColor(color)
                    .setTimestamp()
                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                interaction.client.commands.map(c => {
                    if (c.category == t) {
                        newEmbed.addField(c.name || c.data.name, c.description || c.data?.description == undefined ? 'None' : c.data.description)
                    }
                })
                embeds.push(newEmbed)

                comp.addOptions({ label: titles[i], value: options[i] })
                i++
            })

            const filter = i => i.user.id == interaction.user.id;

            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 300000 })

            let changeEmbed = embed
                .setAuthor({ name: "help" });

            interaction.reply({ embeds: [changeEmbed], components: [row] })

            collector.on('collect', async newInteraction => {
                if (newInteraction.customId != `${interaction.id}-dropdownmenu`) return;
                let chosen = newInteraction.values[0]
                changeEmbed = embeds[options.indexOf(chosen)]
                category = titles[options.indexOf(chosen)]
                if (chosen == 'index') {
                    changeEmbed = embed;
                }

                await newInteraction.update({ embeds: [changeEmbed], components: [row] })
            })

            collector.on('end', async () => {
                try {
                    return await interaction.editReply({ components: [], embeds: [changeEmbed] })
                }
                catch (error) {
                    getEventError(interaction.client, error)
                }
            })
        }
        if (command != null) {
            let embed = new Discord.MessageEmbed()
                .setTitle("Four-Oh-Four")
                .setDescription(`Couldn't find \`${command}\`.`)
                .setColor(color)
                .setTimestamp()
                .setFooter({ text: interaction.user.username, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            interaction.client.commands.map(c => {
                if ((c.name || c.data.name) == command) {
                    embed
                        .setTitle(`Help ${c.name}`)
                        .setDescription(c.detailedDescription || c.description || c.data.description)
                        .addField("Developer", c.owner ? 'Yes' : 'No', true)
                        .addField("Admin", c.admin ? 'Yes' : 'No', true)
                        .addField("Type", c.type ? 'Message' : 'Slash', true)
                        .addField("Category", c.category ? c.category : "None", true)

                    if (c.data?.options?.length >= 1) {
                        embed.addField("Options", '\u200b')
                        for (let i = 0; i < c.data.options.length; i++) {
                            embed.addField(c.data.options[i].name, c.data.options[i].description, true)
                        }
                    }
                }
            })
            return await interaction.reply({ embeds: [embed] })
        }
    },
};