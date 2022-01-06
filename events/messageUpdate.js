const { owners, prefix, guildID, contributors } = require('../data/config/config.json')
const { commandError } = require('../funcs.js')
const Discord = require('discord.js')
module.exports = {
    name: 'messageUpdate',
    once: false,
    async execute(oldMessage, newMessage) {
        if (oldMessage.author.bot && newMessage.author.bot) return;

        if (!newMessage.content.startsWith(prefix) || newMessage.author.bot) return;
        let args = newMessage.content.replace(prefix, "").split(/ +/);
        let command = args.shift().toLowerCase();

        if (command == "") return;

        if (command.owner) {
            if (!owners.includes(interaction.author.id)) return interaction.reply({ content: 'This is a developer command!', ephemeral: true });
        }

        if (command.contributor) {
            config.owners.forEach(owner => {
                contributors.push(owner)
            })
            if (!contributors.includes(interaction.author.id)) return interaction.reply({ content: 'This is a contributor only command', ephemeral: true })
        }

        if (command.homeGuild) {
            if (interaction.guild.id != config.guildID) return interaction.reply({ content: `This command can only be used in my <#${config.guildID}> server.`, ephemeral: true });
        }

        command = newMessage.client.commands.get(command)

        try {
            command.execute(newMessage, ...args)
        }
        catch (error) {
            commandError(newMessage.client, error)
            try {
                await newMessage.reply({ content: `There was an error executing ${command.name}.`, ephemeral: true });
            }
            catch { }
        }
    }
}