const { SlashCommandBuilder } = require('@discordjs/builders')
const characters = require('../data/user/characters.json')
const fs = require('fs')
module.exports = {
    category: "Destiny",
    detailedDescription: "Setup your 3 destiny characters as they are in game.\n\nNumber: which character you want to set (1, 2, or 3)\nCharacter: what is that character(Warlock, Hunter or Titan)\nLevel: what level is this character (1-40)\nLight: what light is this character (3-335)\nExotics: how many exotics do you have for this character?\nRaid: can you do every raid the game has with this character?",
    data: new SlashCommandBuilder()
        .setName('character')
        .setDescription('Setup your destiny characters')
        .addNumberOption((option) =>
            option
                .setName('number')
                .setDescription('What number of character is this?')
                .addChoice("Character 1", 1)
                .addChoice("Character 2", 2)
                .addChoice("Character 3", 3)
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('character')
                .setDescription('What is this character?')
                .addChoice('Warlock', 'Warlock')
                .addChoice('Hunter', 'Hunter')
                .addChoice('Titan', 'Titan')
                .setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName('level')
                .setDescription('What level is this character?')
                .setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName('light')
                .setDescription('What light is this character?')
                .setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName('exotics')
                .setDescription('How many exotics do you have of this character?')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('raid')
                .setDescription('Can you do all raids with this character?')
                .addChoice('Yes', 'yes')
                .addChoice('No', 'no')
                .setRequired(true)
        ),
    async execute(interaction) {

        let user = interaction.user;
        let number = interaction.options.getNumber('number');
        let type = interaction.options.getString('character').toLowerCase();
        let level = interaction.options.getNumber('level');
        let light = interaction.options.getNumber('light');
        let raid = interaction.options.getString('raid');
        let exotics = interaction.options.getNumber('exotics');
        console.log(number, type, level, light, raid, exotics)
        if (!characters[user.id]) {
            characters[user.id] = {
                firstCharacter: {
                    type: null,
                    level: 0,
                    light: 0,
                    raid: false,
                    exotics: 0,
                },
                secondCharacter: {
                    type: null,
                    level: 0,
                    light: 0,
                    raid: false,
                    exotics: 0,
                },
                thirdCharacter: {
                    type: null,
                    level: 0,
                    light: 0,
                    raid: false,
                    exotics: 0,
                }
            }
        }
        if (level > 40 || level < 1) {
            return interaction.reply({ content: `${level} is not an achievable level in Destiny!`, ephemeral: true })
        }
        if (light > 335 || light < 3) {
            return interaction.reply({ content: `${light} is not an achievable light in Destiny!`, ephemeral: true })
        }
        if ((type == "warlock" && (exotics > 19 || exotics < 0)) || (type == "warlock" && (exotics > 19 || exotics < 0)) || (type == "warlock" && (exotics > 19 || exotics < 0)) || ((type == "hunter" && (exotics > 20 || exotics < 0)) || (type == "hunter" && (exotics > 20 || exotics < 0)) || (type == "hunter" && (exotics > 20 || exotics < 0))) || ((type == "titan" && (exotics > 20 || exotics < 0)) || (type == "titan" && (exotics > 20 || exotics < 0)) || (type == "titan" && (exotics > 20 || exotics < 0)))) {
            return interaction.reply({ content: `you can't have ${exotics} exotics on a ${type}!`, ephemeral: true })
        }
        if (characters[user.id].firstCharacter.type == null || characters[user.id].secondCharacter.type == null || characters[user.id].thirdCharacter.type == null) {
            if (number == 1) {
                characters[user.id].firstCharacter = {
                    type: type,
                    level: level,
                    light: light,
                    raid: raid,
                    exotics: exotics
                }
            }
            if (number == 2) {
                characters[user.id].secondCharacter = {
                    type: type,
                    level: level,
                    light: light,
                    raid: raid,
                    exotics: exotics
                }
            }
            if (number == 3) {
                characters[user.id].thirdCharacter = {
                    type: type,
                    level: level,
                    light: light,
                    raid: raid,
                    exotics: exotics
                }
            }
        }

        else {
            await interaction.reply({ content: `You've already set up character ${number}! use \`?update\`, to update your progress.`, ephemeral: true });
        }

        fs.writeFile('data/user/characters.json', JSON.stringify(characters), (err) => {
            if (err) {
                console.log(err)
            };
        });

        await interaction.reply(`Setup character ${number} to be your ${type}!`)
    }
}