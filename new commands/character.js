const { SlashCommandBuilder } = require('@discordjs/builders');
const { getDatabase } = require('../funcs.js');

module.exports = {
    category: "Destiny",
    detailedDescription: "Setup your 3 destiny characters as they are in game.\n\nNumber: which character you want to set (1, 2, or 3)\nCharacter: what is that character(Warlock, Hunter or Titan)\nLevel: what level is this character (1-40)\nLight: what light is this character (3-335)\nExotics: how many exotics do you have for this character?\nRaid: can you do every raid the game has with this character?",
    data: new SlashCommandBuilder()
        .setName('character')
        .setDescription('Setup your destiny characters'),

    async execute(interaction) {

    }
}