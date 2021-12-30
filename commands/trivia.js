const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

const trivia = require('../data/game/trivia.json');
const { randomNumber } = require('../funcs.js');
const { color } = require('../data/config/config.json')


const cooldown = new Set();

module.exports = {
    category: "Destiny",
    detailedDescription: "Trivia gives you a question and you have 15 seconds to answer. You can play with as many people as you wnat at once, and see who is the smarter one in your group, or play it alone, to work on your knowledge or even test it.",
    data: new SlashCommandBuilder()
        .setName('trivia')
        .setDescription('Replies with a trivia question'),

    async execute(interaction) {
        if (cooldown.has(interaction.channel.id)) {
            interaction.reply({ content: 'This channel recently started a trivia, either participate or wait til the cooldown is over!', ephemeral: true });
            return;
        }
        cooldown.add(interaction.channel.id)
        let obj = trivia[randomNumber(trivia.length)];
        let allAnswers = Object.values(obj).slice(1, 4)
        let answers = {};
        let lets = "ABC";

        for (let i = 0; allAnswers.length > 0; i++) {
            let ind = randomNumber(allAnswers.length);
            answers[lets[i]] = allAnswers[ind];
            allAnswers.splice(ind, 1);
        }
        let row = new Discord.MessageActionRow()
        let afterRow = new Discord.MessageActionRow()
        for (let i = 0; i < 3; i++) {
            let b = new Discord.MessageButton()
                .setCustomId(`${interaction.id}-${lets[i]}`)
                .setLabel(answers[lets[i]])
                .setStyle('PRIMARY')
            row.addComponents(b)
            afterRow.addComponents(b.setDisabled(true))
        }
        let embed = new Discord.MessageEmbed()
            .setTitle(obj.question)
            .setDescription(`A: ${answers.A}\nB: ${answers.B}\nC: ${answers.C}`)
            .setColor(color)
            .setFooter({ text: `This question is ${obj.grade} and is for ${obj.tag}. You have 15sec to answer.` })

        await interaction.reply({ embeds: [embed], components: [row] });
        let answersGiven = { correct: new Set(), incorrect: new Set() };
        let filter = (inter) => inter.isButton() && inter.customId.startsWith(interaction.id);
        let collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 })
        collector.on('collect', async (newInteraction) => {
            let [mId, answerLet] = newInteraction.customId.split('-');
            let answer = answers[answerLet];
            await newInteraction.reply({ content: `You answered ${answer}`, ephemeral: true });
            if (answer == obj.correctAnswer) {
                answersGiven.correct.add(newInteraction.user.username);
                answersGiven.incorrect.delete(newInteraction.user.username);
            }
            else {
                answersGiven.correct.delete(newInteraction.user.username);
                answersGiven.incorrect.add(newInteraction.user.username);
            }
        })
        collector.on('end', () => {
            interaction.editReply({ embeds: [embed], components: [afterRow] })
            let str = "";
            if (answersGiven.correct.size > 0) {
                str += "\nAnswered correctly: " + Array.from(answersGiven.correct).join(', ')
            }
            if (answersGiven.incorrect.size > 0) {
                str += "\nAnswered incorrectly: " + Array.from(answersGiven.incorrect).join(', ')
            }
            embed
                .setTitle('Results')
                .setDescription(`The correct answer was: ${obj.correctAnswer}.\n${str}`)
                .setFooter({ text: `This question was ${obj.grade} and was for ${obj.tag}.` })
            interaction.followUp({ embeds: [embed] });
            cooldown.delete(interaction.channel.id)
        })
    }
}; 