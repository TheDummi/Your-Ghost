const got = require("got");
const Discord = require("discord.js")
const config = require('../data/config/config.json');

module.exports = {
    name: "docs",
    aliases: [''],
    category: 'Developer',
    description: 'Gets methods for a class',
    detailedDescription: "",
    owner: true,

    async execute(message, args) {
        if (!args) return message.reply({ content: "Please specify a class" })
        let color = config.color;
        got.get('https://raw.githubusercontent.com/discordjs/discord.js/docs/stable.json').then(async response => {
            const body = JSON.parse(response.body)
            let classes = new Discord.Collection();
            body.classes.forEach(e => {
                classes.set(e.name, e)
            });
            let findClass = (message) => {
                return classes.find(e => e.name.toLowerCase() == args) || null
            };
            let c = findClass(message);
            if (c === null) {
                let embed = new Discord.MessageEmbed()
                    .setTitle("Could not find that class!")
                    .setDescription('discord.js click [here](https://discord.js.org/#/docs/main/stable/general/welcome)\nDiscord-Akairo [here](https://discord-akairo.github.io/#/docs/main/master/general/welcome) or [here](https://discord-akairo.github.io/#/docs/main/master/class/AkairoClient)')
                    .setColor(color)
                return message.reply({ embeds: [embed] })
            }
            else {
                if (c.props === undefined || c.methods === undefined) {
                    let embed = new Discord.MessageEmbed()
                        .setTitle(c.name)
                        .setDescription(`${c.description.replace("<warn>", "```").replace("</warn>", "```")}\n\n[Docs link](http://discord.js.org/#/docs/main/stable/class/${c.name})`)
                        .setFooter({ text: "For this class either there was not a single method or there wan not a single property. This caused me to exclude both, because if it didn't it would make the programers' life much harder." })
                        .setColor(color)
                    return message.reply({ embeds: [embed] })
                }

                let props = "";
                c.props.forEach(e => {
                    props = `${props}**${e.name}**: ${e.description}\n\n`
                })
                let meths = "";
                c.methods.forEach(e => {
                    meths = `${meths}**${e.name}**: ${e.description}\n\n`
                })
                let embed = new Discord.MessageEmbed()
                    .setTitle(c.name)
                    .setDescription(`${c.description.replace("<warn>", "```").replace("</warn>", "```")}\n\n[Docs link](http://discord.js.org/#/docs/main/stable/class/${c.name})`)
                    .addField("| Properties", props, true)
                    .addField("| Methods", meths, true)
                    .setColor(color)
                return message.reply({ embeds: [embed] }).catch(e => {
                    let propsSlim = "";
                    c.props.forEach(e => {
                        propsSlim = `${propsSlim}${e.name}\n\n`
                    })
                    let methsSlim = "";
                    c.methods.forEach(e => {
                        methsSlim = `${methsSlim}${e.name}\n\n`
                    })
                    let embedSlim = new Discord.MessageEmbed()
                        .setTitle(c.name)
                        .setDescription(`${c.description}\n\n[Docs link](http://discord.js.org/#/docs/main/stable/class/${c.name})`)
                        .addField("| Properties", props, true)
                        .addField("| Methods", meths, true)
                        .setFooter({ text: "This response was minified to get around the discord character limit" })
                        .setColor(color)
                    message.reply({ embeds: [embedSlim] }).catch(e => {
                        let embedSuperSlim = new Discord.MessageEmbed()
                            .setTitle(c.name)
                            .setDescription(`${c.description.replace("<warn>", "```").replace("</warn>", "```")}\n\n[Docs link](http://discord.js.org/#/docs/main/stable/class/${c.name})`)
                            .setFooter({ text: "This response was super minified to get around the discord character limit" })
                            .setColor(color)
                        message.reply({ embeds: [embedSuperSlim] })
                    })
                })
            }
        });
    }
};