const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { color } = require('../data/config/config.json')
const { capitalize } = require('../funcs.js')
const profileSettings = require('../models/profileSettings.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Setup your destiny profile.')
        .addMentionableOption((option) =>
            option
                .setName('user')
                .setDescription('who whould you like to see?')
        ),


    async execute(interaction) {
        let user = interaction.options.getMentionable('user') || interaction.user;


        let name = interaction.options.getString('psn');
        let synced = interaction.options.getBoolean('synced');
        let grimoire = interaction.options.getNumber('grimoire');

        let profileData;
        try {
            profileData = await profileSettings.findOne({ userID: user.id })
            if (!profileData) {
                let profile = await profileSettings.create({
                    userID: { type: user.id, required: true },
                    psn: { type: name, required: true },
                    synced: { type: synced, required: true },
                    gimoire: { type: grimoire, required: true }
                })
                profile.save()
            }
        }
        catch { }
        await interaction.reply({ content: `Name: ${profileData.name}\nSynced: ${profileData.synced ? "Yes" : "No"}\nGrimoire: ${profileData.grimoire}.` });
    },
};