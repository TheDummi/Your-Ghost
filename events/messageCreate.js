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