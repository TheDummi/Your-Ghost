const { SlashCommandBuilder } = require('@discordjs/builders');
const trivia = require('../data/game/trivia.json');
const { getCapitalize } = require('../funcs.js');
const fs = require('fs');

module.exports = {
    contributor: true,
    category: "Contributor",
    detailedDescription: "hi",
    data: new SlashCommandBuilder()
        .setName('addtrivia')
        .setDescription('Add trivia questions')
        .addStringOption((Option) =>
            Option
                .setName('question')
                .setDescription('What is the question?')
                .setRequired(true)
        ).addStringOption((Option) =>
            Option
                .setName('correct-answer')
                .setDescription('What\'s the correct answer?')
                .setRequired(true)
        ).addStringOption((Option) =>
            Option
                .setName('incorrect-answer-1')
                .setDescription('What are the incorrect answers?')
                .setRequired(true)
        ).addStringOption((Option) =>
            Option
                .setName('incorrect-answer-2')
                .setDescription('What are the incorrect answers?')
                .setRequired(true)
        ).addStringOption((Option) =>
            Option
                .setName('difficulty')
                .setDescription('How hard is this question?')
                .setRequired(true)
                .addChoice('Easy', 'Easy')
                .addChoice('Medium', 'Medium')
                .addChoice('Hard', 'Hard')
        ).addStringOption((Option) =>
            Option
                .setName('type')
                .setDescription('What type of question is it?')
                .addChoice('Lore', 'Lore')
                .addChoice('Weapons', 'Weapons')
                .addChoice('Exotics', 'Exotics')
                .addChoice('Legendaries', 'Legendaries')
                .addChoice('Rares', 'Rares')
                .addChoice('Armor', 'Armor')
                .addChoice('Mechanics', 'Mechanics')
                .addChoice('Strikes', 'Strikes')
                .addChoice('Missions', 'Missions')
                .addChoice('Raids', 'Raids')
                .addChoice('Patrols', 'Patrols')
                .setRequired(true)
        ),

    async execute(interaction) {
        let question = getCapitalize(interaction.options.getString('question'))
        let correctAnswer = interaction.options.getString('correct-answer')
        let incorrectAnswer1 = interaction.options.getString('incorrect-answer-1')
        let incorrectAnswer2 = interaction.options.getString('incorrect-answer-2')
        let difficulty = interaction.options.getString('difficulty')
        let type = interaction.options.getString('type')

        if (!question.endsWith('?')) {
            question += "?"
        }
        if ((correctAnswer.length > 100) || (incorrectAnswer1.length > 100) || (incorrectAnswer2.length > 100)) return interaction.reply({ content: 'Answers can only be 100 characters.', ephemeral: true })

        trivia.push({
            question: question,
            correctAnswer: correctAnswer,
            wrongAnswer: incorrectAnswer1,
            wrongAnswerToo: incorrectAnswer2,
            grade: difficulty,
            tag: type
        })

        fs.writeFile('data/game/trivia.json', JSON.stringify(trivia), (err) => { if (err) console.log(err) })
        await interaction.reply({ content: "Added your question", ephemeral: true });
    },
};