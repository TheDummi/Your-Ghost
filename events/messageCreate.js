const { guildID, prefix, contributors, owners } = require('../data/config/config.json')
const { getCommandError } = require('../funcs.js')
const Discord = require('discord.js')
module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message) {
        if (message.author.bot) return;

        if (message.channel.type === 'GUILD_NEWS') {
            message.crosspost()
                .then(() => message.react('📣'))
                .catch(message.react('❌'));
        }

        if (!message.content.startsWith(prefix) || message.author.bot) return;
        let args = message.content.replace(prefix, "").split(/ +/);
        let command = args.shift().toLowerCase();

        if (command == "") return;
        if (!message.client.commands.has(command)) return;

        command = message.client.commands.get(command)

        if (command.owner) {
            if (!owners.includes(message.author.id)) return message.reply({ content: 'This is a developer command!', ephemeral: true });
        }

        if (command.contributor) {
            config.owners.forEach(owner => {
                contributors.push(owner)
            })
            if (!contributors.includes(message.author.id)) return message.reply({ content: 'This is a contributor only command', ephemeral: true })
        }

        if (command.homeGuild) {
            if (message.guild.id != guildID) return message.reply({ content: `This command can only be used in my <#${config.guildID}> server.`, ephemeral: true });
        }


        try {
            await command.execute(message, ...args)
        }
        catch (error) {
            getCommandError(message, error)
            try {
                await message.reply({ content: `There was an error executing ${command.name}.\nLog: <#916283556928557056>`, ephemeral: true });
            }
            catch { }
        }
    }
}