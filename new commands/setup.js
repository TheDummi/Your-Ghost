const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { color } = require('../data/config/config.json')
const { capitalize } = require('../funcs.js')
const profile = require('../data/user/profile.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup your destiny profile.')
        .addStringOption((option) =>
            option
                .setName('psn')
                .setDescription('What is your PSN name?')
                .setRequired(true),
        )
        .addBooleanOption((option) =>
            option
                .setName('synced')
                .setDescription('Have you synced with ps4?')
                .setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName('grimoire')
                .setDescription('What is your grimoire score?')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('character')
                .setDescription('What is your favourite character')
        )
        .addStringOption((option) =>
            option
                .setName('raid')
                .setDescription('What is your favourite raid?')
        )
        .addStringOption((option) =>
            option
                .setName('gamemode')
                .setDescription('Do you prefer PVE or PVP?')
        )
        .addStringOption((option) =>
            option
                .setName('weapon')
                .setDescription('What is your favourite weapon?')
        )
        .addStringOption((option) =>
            option
                .setName('strike')
                .setDescription('What is your favourite strike?')
        )
        .addStringOption((option) =>
            option
                .setName('subclass')
                .setDescription('What is your favourite strike?')
        ),


    async execute(interaction) {
        let user = interaction.user;

        if (!profile[user.id]) {
            profile[user.id] = {
                name: null,
                synced: false,
                grimoire: 0,
                favourites: {
                    character: null,
                    raid: null,
                    gamemode: null,
                    weapon: null,
                    strike: null,
                    subclass: null,
                }
            }
        }

        if (profile[user.id]) {
            return interaction.reply('you already have a profile!')
        }

        let name = interaction.options.getString('psn');
        let synced = interaction.options.getBoolean('synced');
        let grimoire = interaction.options.getNumber('grimoire');
        // let character = capitalize(interaction.option.getString('character')) || "Not set";
        let raid = capitalize(interaction.option.getString('raid')) || "Not set";
        let gamemode = interaction.option.getString('gamemode') || "Not set";
        let weapon = capitalize(interaction.option.getString('weapon')) || "Not set";
        let strike = capitalize(interaction.option.getString('strike')) || "Not set";
        let subclass = capitalize(interaction.option.getString('subclass')) || "Not set";

        profile[user.id] = {
            name: name,
            synced: synced,
            grimoire: grimoire,
            favourites: {
                character: character,
                raid: raid,
                gamemode: gamemode,
                weapon: weapon,
                strike: strike,
                subclass: subclass,
            }
        }

        fs.writeFile('data/user/profile.json', JSON.stringify(profile), (err) => {
            if (err) {
                console.log(err);
            }
        })
        await interaction.reply({ content: `set-up your profile under the name ${name}!` });
    },
};