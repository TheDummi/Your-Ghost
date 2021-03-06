const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { color } = require('../data/config/config.json')
const { capitalize } = require('../funcs.js')
const profileSettings = require('../models/profileSettings.js');

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
        ),


    async execute(interaction) {
        let user = interaction.user;


        let name = interaction.options.getString('psn');
        let synced = interaction.options.getBoolean('synced');
        let grimoire = interaction.options.getNumber('grimoire');

        let profileData;
        try {
            profileData = await profileSettings.findOne({ userID: interaction.user.id })
            if (!profileData) {
                let profile = await profileSettings.create({
                    userID: { type: interaction.user.id, required: true },
                    psn: { type: name, required: true },
                    synced: { type: synced, required: true },
                    gimoire: { type: grimoire, required: true }
                })
                profile.save()
            }
        }
        catch { }
        await interaction.reply({ content: `set-up your profile under the name ${name}!` });
    },
};