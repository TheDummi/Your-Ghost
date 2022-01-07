const { color, token } = require('../data/config/config.json')
const Discord = require('discord.js')
const got = require("got")
const fs = require('fs')
const base = 'https://hst.sh'
module.exports = {
    owner: true,
    name: "haste",
    aliases: ["get"],
    category: "Dev",
    description: "Get hasted code",
    detailedDescription: "hi",

    async execute(message, args) {
        if (!args) {
            return await message.reply('Please specify a path.')
        }
        let b;
        try {
            b = fs.readFileSync(args)
        }
        catch (e) {
            return await message.reply("Not a valid file path")
        }
        let str = String(b)
        str.replace(/```/g, "\`\`\`").replace(token, "Haha you thought you could get my token.")
        const { body } = await got.post(`${base}/documents`, {
            body: str
        });
        let embed = new Discord.MessageEmbed()
            .setTitle(`${args}`)
            .setColor(color)
            .setURL(`${base}/${JSON.parse(body).key}`)
        if (b.length > 4080) {
            embed.setDescription('Code is too long to display in an embed, click the link in the title!')
        }
        else {
            embed.setDescription('```js\n' + str + '```')
        }
        await message.reply({ embeds: [embed] });
    },
};