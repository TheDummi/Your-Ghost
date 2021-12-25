const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const { color, owners, contributors } = require('../data/config/config.json')

const Package = require('../package.json')
const destiny = require('../data/game/destiny.json');
const { setPresence, getUptime, capitalize, toArray } = require('../funcs.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get info about a certain thing in Destiny.')
        .addStringOption((option) =>
            option
                .setName('item')
                .setDescription('What would you like to get info for?')
                .setRequired(true)
        ),
    async execute(interaction, client) {
        let item = interaction.options.getString('item').toLowerCase();
        let embed;
        if (item == 'bot' || item == `<@!${interaction.client.user}>` || item == `<@${interaction.client.user}>` || item == 'client') {
            embed = new Discord.MessageEmbed()
                .setTitle('Info about me')
                .setDescription(`I'm your personal assistant on helping you in situtions of need! Well as far as I can do that as I'm an inorganic life form with little to no mechanics to physically help... Anyways I'm getting carried away. `)
                .setColor(color)
        }
        else {
            for (const data in destiny) {
                let d = destiny[data];
                embed = new Discord.MessageEmbed()
                    .setTitle('Four-Oh-Four')
                    .setDescription(`Couldn't find \`${item}\``)
                    .setURL('https://www.bungie.net/en/Activities/Detail/1/4611686018429652360/2305843009443065575?activity=weeklycrucible')
                    .setColor('#FF0000')
                if (!d.name.toLowerCase().includes(item)) {
                    continue;
                }
                else {
                    function getColor() {
                        if (d.rank) {
                            let newColor = color
                            if (d.rank == "Exotic") return newColor = "#FFF000";
                            if (d.rank == "Legendary") return newColor = "#3B0054";
                            if (d.rank == "Rare") return newColor = '#02198B';
                            if (d.rank == "Uncommon") return newColor = "#99EBCB";
                            if (d.rank == "Common") return newColor = '#FFFFFF';
                            return newColor;
                        }
                        else return color
                    }
                    embed
                        .setTitle(d.name)

                        .setColor(getColor())
                        .setFooter(`You searched for "${item}" if this wasn't what you were looking for please try to be more detailed.\nAll info is based on the latest update of The Taken King DLC.`)
                    if (d.icon) {
                        embed
                            .setImage(d.icon)
                            .setURL(d.icon)
                    }
                    if (d.description) {
                        if (d.tag == "Species" && d.description) {
                            embed
                                .addField('Description', d.description)
                                .setDescription(d.biology)
                        }
                        else {
                            embed.setDescription(d.description)
                        }
                    }
                    if (d.note) {
                        let str = "";
                        d.note.forEach(perk => {
                            str += String(perk) + "\n"
                        })
                        embed.addField('Note(s)', str)
                    }
                    if (d.rank) {
                        if (d.tag == 'Weapon' && d.rank) {
                            embed.addField('Rarity', d.rank, true)
                        }
                        else {
                            embed.addField('Rank', d.rank, true)
                        }
                    }
                    if (d.homePlanet) {
                        embed.addField('Home Planet', d.homePlanet, true)
                    }
                    if (d.appearance) {
                        let str = "";
                        d.appearance.forEach(perk => {
                            str += String(perk) + "\n"
                        })
                        embed.addField('Appearance', str, true)
                    }
                    if (d.tag) {
                        if (d.tag == "Mechanic" && d.slot) {
                            embed
                        }
                        else if (d.tag && d.slot) {
                            embed.addField('Slot', `${d.slot} ${d.tag}`, true)
                        }
                        else {
                            embed.addField('Tag', d.tag, true)
                        }
                    }
                    if (d.class) {
                        embed.addField('Class', d.class, true)
                    }
                    if (d.obtainable) {
                        let str = "";
                        d.obtainable.forEach(perk => {
                            str += String(perk) + "\n"
                        })
                        embed.addField('How to obtain', str, true)
                    }
                    if (d.baseLight && d.maxLight) {
                        let str = "";
                        d.baseLight.forEach(perk => {
                            str += String(perk) + " "
                        })
                        str += "-"
                        d.maxLight.forEach(perk => {
                            str += String(perk) + " "
                        })
                        embed.addField('Min-max light', str, true)

                    }
                    if (d.requirements) {
                        let str = "";
                        d.requirements.forEach(perk => {
                            str += String(perk) + "\n"
                        })
                        embed.addField('Requirements', str, true)
                    }
                    if (d.rof && d.impact && d.range && d.stability && d.reload) {
                        embed.addField('In-Game stats', `**Rate of Fire:** ${d.rof}\n**Impact:** ${d.impact}\n**Range:** ${d.range}\n**Stability:** ${d.stability}\n**Reload:** ${d.reload}`, true)
                    }
                    if (d.magazine && d.zoom && d.aim && d.recoil && d.speed) {
                        embed.addField('Extra stats', `**Magazine:** ${d.magazine}\n**Zoom:** ${d.zoom}\n**Aim Assist:** ${d.aim}\n**Recoil:** ${d.recoil}\n**Equip Speed:** ${d.speed}`, true)
                    }
                    if (d.basePerks && d.firstTierPerks && d.secondTierPerk && d.thirdTierPerks && d.fourthTierPerk) {
                        if (d.rank == 'Exotic') {
                            let str = "";
                            str += "**Base:** "
                            d.basePerks.forEach(perk => {
                                str += String(perk) + ", "
                            })
                            str += "\n**Tier 1:** "
                            d.firstTierPerks.forEach(perk => {
                                str += String(perk) + ", "
                            })
                            str += "\n**Tier 2:** "
                            d.secondTierPerk.forEach(perk => {
                                str += String(perk) + ", "
                            })
                            str += "\n**Tier 3:** "
                            d.thirdTierPerks.forEach(perk => {
                                str += String(perk) + ", "
                            })
                            str += "\n**Tier 4:** "
                            d.fourthTierPerk.forEach(perk => {
                                str += String(perk) + ", "
                            })
                            embed.addField('Perks', str)
                        }
                        else {
                            let str = "";
                            d.basePerks.forEach(perk => {
                                str += String(perk) + ", "
                            })

                            embed.addField('Default perks', str)
                            str = "";
                            d.firstTierPerks.forEach(perk => {
                                str += String(perk) + "\n"
                            })
                            embed.addField('Possible Tier 1 perks', str, true)
                            str = "";
                            d.secondTierPerk.forEach(perk => {
                                str += String(perk) + "\n"
                            })
                            embed.addField('Possible Tier 2 perks', str, true)
                            str = "";
                            d.thirdTierPerks.forEach(perk => {
                                str += String(perk) + "\n"
                            })
                            embed.addField('Possible Tier 3 perks', str, true)
                            str = "";
                            d.fourthTierPerk.forEach(perk => {
                                str += String(perk) + "\n"
                            })
                            embed.addField('Possible Tier 4 perks', str)
                        }
                    }
                    if (d.bestUsePVP) {
                        let str = "";
                        d.bestUsePVP.forEach(perk => {
                            str += String(perk) + "\n"
                        })
                        embed.addField('Best crucible perks', str, true)

                    }
                    if (d.bestUsePVE) {
                        let str = "";
                        d.bestUsePVE.forEach(perk => {
                            str += String(perk) + "\n"
                        })
                        embed.addField('Best PVE perks', str, true)
                    }
                    if (d.tag == "Mechanic") {
                        let str = "";
                        let tempArray = [];
                        for (const data in destiny) {
                            if (destiny[data].class == d.name) {
                                tempArray.push(destiny[data].name)
                            }
                            else continue;
                        }
                        tempArray.forEach(thing => {
                            str += thing + "\n"
                        })
                        embed.addField(`Full list of ${d.name}s registered`, str.length > 1012 ? str : str.slice(0, 1012) || "none", true)
                    }
                    if (d.bestWeapons) {
                        let str = "";
                        let i = 1;
                        d.bestWeapons.forEach(perk => {
                            str += String(i) + ": " + String(perk) + "\n"
                            i++
                        })
                        embed.addField(`Top ${d.bestWeapons.length} ${d.name}s`, str, true)
                    }

                    break;
                }
            }
        }
        await interaction.reply({ embeds: [embed] })
    }
}