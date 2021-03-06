const { color, token } = require('../data/config/config.json')
const Discord = require('discord.js')
const got = require("got")
const fs = require('fs')
const base = 'https://hst.sh'
module.exports = {
    owner: true,
    name: "haste",
    aliases: ["get"],
    category: "Developer",
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
        let str = String(b).replace(/```/g, "\`\`\`").replace(token, "LOL you thought you could get my token.")
        const { body } = await got.post(`${base}/documents`, {
            body: str
        });
        let embed = new Discord.MessageEmbed()
            .setTitle(`${args}`)
            .setColor(color)
            .setURL(`${base}/${JSON.parse(body).key}`)
        if (b.length > 4080) {
            embed.setDescription(`Code is ${b.length} characters, couldn't display in an embed, click the url for the full stack.`)
        }
        else {
            embed.setDescription('```js\n' + str + '```')
        }
        await message.reply({ embeds: [embed] });
    },
};