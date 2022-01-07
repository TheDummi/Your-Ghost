const { APIKey, APIClientID, AuthorizationURL } = require('../data/config/config.json')
const moment = require('moment')
const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const got = require('got')

module.exports = {
    owner: true,
    category: "Developer",
    detailedDescription: "Destiny",
    data: new SlashCommandBuilder()
        .setName('destiny')
        .setDescription('Destiny'),
    async execute() {
        got.get('https://www.bungie.net').then(async (response) => {
            const body = JSON.parse(response.body)
            console.log(body)
        })
    }
}
