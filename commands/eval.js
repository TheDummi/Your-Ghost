const Discord = require('discord.js')
const { haste, isOwner } = require("../funcs.js")
const { SlashCommandBuilder } = require('@discordjs/builders');

const clean = (text) => {
    if (typeof text === 'string') return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
    else return text;
};
module.exports = {
    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription('run bot code')
        .addStringOption((option) =>
            option
                .setName('code')
                .setDescription('What would you like to evaluate?')
                .setRequired(true)
        ),
    async execute(interaction, client, message) {
        if (isOwner(interaction.user.id, interaction)) return;
        const embed = new Discord.MessageEmbed();
        let code = interaction.options.getString('code')
        try {
            let output;
            output = eval(code);
            output = await output;
            output = clean(output);
            embed
                .setTitle('✅ Evaled code successfully')
                .addField('📥 Input', code.length > 1012 ? 'Too large to display.' : '```js\n' + code + '```')
                .addField('📤 Output', output.length > 1012 ? 'Too large to display.' : '```js\n' + output + '```')
                .setColor('#66FF00')
                .setFooter(interaction.user.username, interaction.user.avatarURL({ dynamic: true }))
                .setTimestamp();
        } catch (e) {
            embed
                .setTitle('❌ Code was not able to be evaled')
                .addField('📥 Input', code.length > 1012 ? 'Too large to display.' : '```js\n' + code + '```')
                .addField('📤 Output', e.length > 1012 ? 'Too large to display.' : '```js\n' + e + '```')
                .setColor('#FF0000')
                .setFooter(interaction.user.username, interaction.user.avatarURL({ dynamic: true }))
                .setTimestamp();
        }
        interaction.reply({ embeds: [embed] })
    }
}