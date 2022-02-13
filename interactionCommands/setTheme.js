const { SlashCommandBuilder } = require('@discordjs/builders');
const theme = require('../data/config/themes.json')
const fs = require('fs')

module.exports = {
    homeGuild: true,
    owner: true,
    category: "Developer",
    detailedDescription: "Change the them of the server with a simple command",
    data: new SlashCommandBuilder()
        .setName('settheme')
        .setDescription('Set\'s theme of main server')
        .addStringOption((option) =>
            option
                .setName('theme')
                .setDescription('Set the theme of the server')
                .setRequired(true)
                .addChoice("Default", "default")
                .addChoice("Chinese New Year", "chineseNewYear")
                .addChoice("New Year", "newYear")
                .addChoice("Christmas", "christmas")
        ),
    async execute(interaction) {
        let themer = interaction.options.getString('theme');
        let replacement;
        interaction.guild.channels.fetch().then(async channels => {
            channels.forEach(async channel => {
                try {
                    if (channel.name.includes(theme.current)) {
                        let name = channel.name
                        if (themer == "default") {
                            replacement = theme.default;
                            channel.setName(name.replace(theme.current, replacement));
                        }
                        if (themer == "chineseNewYear") {
                            replacement = theme.chineseNewYear;
                            channel.setName(name.replace(theme.current, replacement));
                        }
                        if (themer == "newYear") {
                            replacement = theme.newYear;
                            channel.setName(name.replace(theme.current, replacement));
                        }
                        if (themer == "christmas") {
                            replacement = theme.christmas;
                            channel.setName(name.replace(theme.current, replacement));
                        }
                    }

                }
                catch (e) {
                    console.log(e)
                }
            })
            theme.current = replacement;
            fs.writeFile('data/config/themes.json', JSON.stringify(theme), (err) => { if (err) return console.error(err) })
            await interaction.reply({ content: `Set theme to ${themer}`, ephemeral: true });
        })
    },
};