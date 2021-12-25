const { Command } = require('discord-akairo')
const Discord = require('discord.js')
const { haste } = require("../funcs.js")
const { inspect } = require("util")
const fs = require('fs')

const clean = (text) => {
    if (typeof text === 'string') return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
    else return text;
};

class EvalCommand extends Command {
    constructor() {
        super('eval', {
            aliases: ['eval', 'ev'],
            category: 'Developer',
            description: 'Evaluate code without having to write an entire program for it.',
            args: [
                {
                    id: 'selDepth',
                    match: 'option',
                    type: 'number',
                    flag: '--depth',
                    default: 0,
                },
                {
                    id: 'deleteMSG',
                    match: 'flag',
                    flag: '--delete',
                },
                {
                    id: 'silent',
                    match: 'flag',
                    flag: '--silent',
                },
                {
                    id: 'code',
                    match: 'rest',
                    type: 'string',
                    prompt: {
                        start: 'What would you like to eval?',
                    },
                },
            ],
            ratelimit: 4,
            cooldown: 4000,
            ownerOnly: true,
        });
    }

    async exec(message, { selDepth, code, silent, deleteMSG }) {
        const embed = new Discord.MessageEmbed();
        try {
            let output;
            /* eslint-disable no-unused-vars */
            // noinspection JSUnusedLocalSymbols,JSUnusedLocalSymbols,JSUnusedLocalSymbols,JSUnusedLocalSymbols,JSUnusedLocalSymbols
            const me = message.member,
                member = message.member,
                bot = this.client,
                guild = message.guild,
                channel = message.channel;
            if (code.replace(/ /g, '').includes('9+10' || '10+9')) {
                output = 21;
            }
            else {
                output = eval(code);
                output = await output;
            }
            if (typeof output !== 'string') output = inspect(output, { depth: selDepth });
            output = output.replace(new RegExp(this.client.token, 'g'), '[token omitted]');
            output = clean(output);
            embed
                .setTitle('✅ Evaled code successfully')
                .addField('📥 Input', code.length > 1012 ? 'Too large to display. Hastebin: ' + (await haste(code)) : '```js\n' + code + '```')
                .addField('📤 Output', output.length > 1012 ? 'Too large to display. Hastebin: ' + (await haste(output)) : '```js\n' + output + '```')
                .setColor('#66FF00')
                .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
        } catch (e) {
            embed
                .setTitle('❌ Code was not able to be evaled')
                .addField('📥 Input', code.length > 1012 ? 'Too large to display. Hastebin: ' + (await haste(code)) : '```js\n' + code + '```')
                .addField('📤 Output', e.length > 1012 ? 'Too large to display. Hastebin: ' + (await haste(e)) : '```js\n' + e + '```Full stack: ' + (await haste(e.stack)))
                .setColor('#FF0000')
                .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
        }
        if (!silent) {
            await message.util.send(embed);
        } else {
            try {
                await message.author.send(embed);
                if (!deleteMSG) {
                    await message.react('<a:Check_Mark:790373952760971294>');
                }
            } catch (e) {
                if (!deleteMSG) {
                    await message.react('❌');
                }
            }
        }

        if (deleteMSG) {
            if (message.deletable) {
                await message.delete();
            }
        }
    }
}

module.exports = EvalCommand;