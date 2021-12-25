const { owners, color } = require('../data/config/config.json')
const Discord = require('discord.js')
module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message) {
        let command = message.content.toLowerCase()
        if (message.author.id == message.client.user.id)

            if (message.author.bot) return;

        if (command.startsWith("banana")) {
            return await message.reply('Here have a banana: :banana:!')
        }

        // if (command.startsWith(`<@!${client.user.id}>`)) {
        //     message.react('👀');
        //     let embed = new Discord.MessageEmbed()
        //         .setColor(config.color)
        //         .setAuthor(`Hello there, ${message.member.nickname || message.author.username} !`, message.author.displayAvatarURL({ dynamic: true }))
        //         .setDescription(`My prefixes are ${config.prefixes} and ${this.client.user}.\nRun ${config.prefixes}commands to get a commands list.`)
        //     message.reply(embed)
        // }    
        // if (command.includes('dummi') || command.includes("<@!" + owners[0] + ">") || command.includes("<@" + owners[0] + ">")) {
        //     if (message.guild == false) return;
        //     if (message.author.id == owners[0]) return;
        //     else {
        //         message.react('👀')
        //         let invite = message.url
        //         invite = await invite
        //         let anEmbed = new Discord.MessageEmbed()
        //             .setTitle(`${message.author.username} mentioned you!`)
        //             .setURL(invite)
        //             .setColor(color)
        //             .setFooter(`This was said in ${message.channel.name}, ${message.guild.name}.`, message.author.displayAvatarURL({ dynamic: true }))
        //             .setTimestamp()
        //         if (command.length > 1983) {
        //             message.content = "Click the link above to see the message!"
        //         }
        //         if (message.attachments.array()) {
        //             try {
        //                 let attachment = await message.attachments.array();
        //                 let attached = "";
        //                 for (let i = 0; i < attachment.length; i++) {
        //                     attached = await attachment[i].attachment;
        //                 }
        //                 await anEmbed
        //                     .setImage(attached.toString())
        //                     .setDescription(`Message content: ${message.content} `)
        //             }
        //             catch (e) { }
        //         }
        //         client.users.fetch(owners[0])
        //             .then(owner => {
        //                 owner.send(anEmbed)
        //             })
        //     }
        // }
        if (message.channel.type === 'news') {
            message.crosspost()
                .then((message) => message.react('📣'))
                .catch(console.error)
        }

        // const eventChannel = '921779479326634005'
        // let number = randomNumber(10000) + 1;
        // let pastNumbers = [];
        // if (message.channel.id == eventChannel) {
        //     if (command == '?start' && message.author.id == config.owners[0]) {
        //         let startEmbed = new Discord.MessageEmbed()
        //             .setTitle('Event started!')
        //             .setDescription('If you guess the number you will get a custom role!\n\nThe number can be between 1 and 10000, but it changes every hour!')
        //             .setColor(config.color)
        //         message.channel.send(startEmbed).then(() => {
        //             console.log(number)
        //             if (message.content === number) {
        //                 let embed = new Discord.MessageEmbed()
        //                     .setAuthor(`🎉 ${message.author.username} guessed the number! 🎉`, message.author.displayAvatarURL({ dynamic: true }))
        //                     .setColor(config.color)
        //                     .setDesctiption(`The number was ${number}`)
        //                 pastNumbers.push(number)
        //                 message.channel.send(embed)
        //             }
        //             setInterval(() => {
        //                 if (message.content === number) {
        //                     embed.addField('Past hours numbers', pastNumbers, true)
        //                     pastNumbers.push(number)
        //                     message.channel.send(embed)
        //                 }
        //             }, 3600000)
        //         })
        //     }
        // }
    }
}