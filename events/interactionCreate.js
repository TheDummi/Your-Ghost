const { setPresence, commandError } = require('../funcs.js');
const fs = require('fs');
const uses = require('../data/user/uses.json');
const config = require('../data/config/config.json');
const Discord = require('discord.js')

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (!interaction.isCommand()) return;
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) return;

        if (command.owner) {
            let owners = config.owners;
            if (!owners.includes(interaction.user.id)) return interaction.reply({ content: 'This is a developer command!', ephemeral: true });
        }

        if (command.contributor) {
            let contributors = config.contributors;
            config.owners.forEach(owner => {
                contributors.push(owner)
            })
            if (!contributors.includes(interaction.user.id)) return interaction.reply({ content: 'This is a contributor only command', ephemeral: true })
        }

        if (command.homeGuild) {
            if (interaction.guild.id != config.guildID) return interaction.reply({ content: `This command can only be used in my <#${config.guildID}> server.`, ephemeral: true });
        }

        try {
            await command.execute(interaction);
            await setPresence(interaction.client, 'WATCHING', `${interaction.user.username} use ${interaction.commandName}!`)
            let com = interaction.commandName;
            if (!uses[interaction.user.id]) {
                uses[interaction.user.id] = {
                    name: interaction.user.username,
                    uses: { [com]: 1 }
                }
            }

            if (com == 'uses') return;
            else {
                uses[interaction.user.id].name = interaction.user.username;
                let use = [];
                use = uses[interaction.user.id].uses
                if (Object.keys(use).includes(com)) {
                    use = use[com]++
                }
                else {
                    use[com] = 1;
                }
            }
            fs.writeFile('data/user/uses.json', JSON.stringify(uses), (err) => { if (err) console.error })
        }
        catch (error) {
            commandError(interaction, error)
            try {
                await interaction.reply({ content: `There was an error executing ${interaction.commandName}.`, ephemeral: true });
            }
            catch { }
        }
    }
}