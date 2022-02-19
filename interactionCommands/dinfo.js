const { SlashCommandBuilder } = require('@discordjs/builders');
const { color, APIKey } = require('../data/config/config.json');
const Discord = require('discord.js');
const got = require('got')
module.exports = {
    detailedDescription: "ping",
    category: "Destiny",
    data: new SlashCommandBuilder()
        .setName('dinfo')
        .setDescription('dinfo')
        .addStringOption((option) =>
            option
                .setName('item')
                .setDescription('dinfo')
                .setRequired(true)
                .addChoice('Event', 'event')
                .addChoice('Advisors', 'advisors')
        ),
    async execute(interaction) {
        async function getAPI(link) {
            let url = await got.get(link, {
                headers: {
                    "X-API-key": APIKey
                }
            })
            return JSON.parse(url.body)
        }
        let item = interaction.options.getString('item')
        let embed = new Discord.MessageEmbed()
            .setColor(color)
            .setTimestamp()
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.avatarURL({ dynamic: true }) })
        if (item == 'event') {
            const body = await getAPI('https://www.bungie.net/platform/Destiny/Events')
            embed
                .setTitle('Events')
            body.Response.data.events.map(async e => {
                embed.setDescription(`Event: ${e.friendlyIdentifier}\nStarted at: ${e.startDate}\nWill end at: ${e.expirationDate}\nCurrently running: ${e.active ? "Yes" : "No"}`)

                for (let i = 0; i < e.vendor.saleItemCategories.length; i++) {
                    let str = "e";
                    e.vendor.saleItemCategories[i].saleItems.map(async j => {
                        const body = await getAPI(`https://www.bungie.net/platform/Destiny/Manifest/InventoryItem/${j.item.itemHash}`)
                        str += body.Response.data.inventoryItem.itemName + "\n"
                        console.log(str)
                    })
                    console.log(str)
                    embed.addField(e.vendor.saleItemCategories[i].categoryTitle, str)
                    str = "e";
                }
            })
        }
        if (item == 'advisors') {
            const body = await getAPI('https://www.bungie.net/platform/Destiny/Stats/LeaderboardsForPsn').then(response => {
                embed
                    .setTitle('Events')
                console.log(body)
                // body.Response.data.events.map(async e => {
                //     embed.setDescription(`e`)

                // })
            })
        }
        await interaction.reply({ embeds: [embed] })
    },
};