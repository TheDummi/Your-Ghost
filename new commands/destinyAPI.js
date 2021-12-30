const { APIKey, APIClientID, AuthorizationURL } = require('../data/config/config.json')
const moment = require('moment')
const XMLHttpRequest = require('xhr2');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
    owner: true,
    category: "Developer",
    detailedDescription: "Destiny",
    data: new SlashCommandBuilder()
        .setName('destiny')
        .setDescription('Destiny'),
    async execute() {
        let xhr = new XMLHttpRequest();

        xhr.open("GET", "https://www.bungie.net/platform/Destiny/Manifest/InventoryItem/1274330687/", true);
        xhr.setRequestHeader("X-API-Key", APIKey);
        console.log(xhr)
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                var json = JSON.parse(this.responseText);
                console.log(json.Response.data.inventoryItem.itemName);
            }
        }

        xhr.send();
    }
}
