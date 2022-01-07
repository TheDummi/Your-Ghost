const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { color, owners, contributors } = require('../data/config/config.json');

const Package = require('../package.json');
const destiny = require('../data/game/destiny.json');
const options = require('../data/config/options.json');

const { getColor } = require('../funcs.js')

module.exports = {
    category: "Destiny",
    detailedDescription: "Get info on any Destiny item, find out if its registered in the ghost's archives if not enlighten him!\n\nrun `/info item: <any item>`.",
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get info about a certain thing in Destiny.')
        .addStringOption((option) =>
            option
                .setName('item')
                .setDescription('What would you like to get info for?')
                .setRequired(true)
        ),
    async execute(interaction) {
        let item = interaction.options.getString('item').toLowerCase();
        let embed;
        let changeEmbed;
        let embeds = [];
        let title = [];
        let d;
        let row = new Discord.MessageActionRow()
        let comp = new Discord.MessageSelectMenu()
            .setCustomId(`${interaction.id}-dropdownmenu`)
            .setPlaceholder('Select category')
            .setMaxValues(1)
            .setMinValues(1)
        row.addComponents(comp.addOptions({ label: "Picture", value: "index" }))
        for (const data in destiny) {
            embed = new Discord.MessageEmbed()
                .setTitle("Four-Oh-Four")
                .setDescription(`Couldn't find \`${item}\``)
                .setColor('#FF0000')

            d = destiny[data];
            if (!d.name.toLowerCase().includes(item)) {
                continue;
            }
            else {
                embed
                    .setTitle(d.name)
                    .setDescription('Use the dropdown menu below for info categories.')
                    .setImage(d.icon)
                    .setColor(getColor(d.rank))

                if (d.description) {
                    let descriptionEmbed = new Discord.MessageEmbed()
                        .setTitle('Description')
                    if (d.tag == "Species") { descriptionEmbed.setDescription("**Biology**\n\n" + d.biology).addField('Description', d.description) }
                    else descriptionEmbed.setDescription(d.description)
                    if (d.note) {
                        descriptionEmbed.addField('Note(s)', Array.from(d.note).join('\n'))
                    }
                    title.push('Description')
                    embeds.push(descriptionEmbed)
                }
                if (d.rank || d.tag || d.class || d.tag || d.modes) {
                    let infoEmbed = new Discord.MessageEmbed()
                        .setTitle('General Info')
                        .setDescription(`General info of ${d.name}`)
                    if (d.rank) infoEmbed.addField('Rank', d.rank, true)
                    if (d.tag) infoEmbed.addField('Tag', d.tag, true)
                    if (d.class) infoEmbed.addField('Class', d.class, true)
                    if (d.max) infoEmbed.addField('Max', String(d.max), true)
                    if (d.modes) infoEmbed.addField('Modes', Array.from(d.modes).join('\n'), true)
                    title.push('General Info')
                    embeds.push(infoEmbed)
                }
                if (d.obtainable || d.requirements || d.baseLight || d.maxLight) {
                    let obtainEmbed = new Discord.MessageEmbed()
                        .setTitle('How to obtain')
                        .setDescription(`How to obtain ${d.name} and it's requirements.`)
                    if (d.obtainable) obtainEmbed.addField('How to obtain', Array.from(d.obtainable).join('\n'), true)
                    if (d.requirements) obtainEmbed.addField('Requirements', Array.from(d.requirements).join('\n'), true)
                    if (d.baseLight) obtainEmbed.addField('Base light', Array.from(d.baseLight).join('\n'))
                    if (d.maxLight) obtainEmbed.addField('Max light', Array.from(d.maxLight).join('\n'))
                    title.push('How to Obtain')
                    embeds.push(obtainEmbed)
                }

                if ((d.magazine && d.zoom && d.aim && d.recoil && d.speed) || (d.rof && d.impact && d.range && d.stability && d.reload) || d.baseLight || d.maxLight) {
                    let statsEmbed = new Discord.MessageEmbed()
                        .setTitle('Stats')
                        .setDescription(`Stats fro ${d.name}.`)

                    if (d.rof && d.impact && d.range && d.stability && d.reload) statsEmbed.addField('In-Game stats', `**Rate of Fire:** ${d.rof}\n**Impact:** ${d.impact}\n**Range:** ${d.range}\n**Stability:** ${d.stability}\n**Reload:** ${d.reload}`, true)
                    if (d.magazine && d.zoom && d.aim && d.recoil && d.speed) statsEmbed.addField('Extra stats', `**Magazine:** ${d.magazine}\n**Zoom:** ${d.zoom}\n**Aim Assist:** ${d.aim}\n**Recoil:** ${d.recoil}\n**Equip Speed:** ${d.speed}`, true)
                    if (d.baseLight || d.maxLight) statsEmbed.addField('\u200b', '\u200b')
                    title.push('Stats')
                    embeds.push(statsEmbed)
                }

                if ((d.basePerks && d.firstTierPerks && d.secondTierPerk && d.thirdTierPerks && d.fourthTierPerk) || d.bestUsePVE || d.bestUsePVP) {
                    let perksEmbed = new Discord.MessageEmbed()
                        .setTitle('Perks')
                        .setDescription(`Perks of ${d.name}.`)
                    if (d.basePerks && d.firstTierPerks && d.secondTierPerk && d.thirdTierPerks && d.fourthTierPerk) {
                        if (d.rank == "Exotic") {
                            perksEmbed.addField('Perks', `**Base:** ${Array.from(d.basePerks).join(', ')}\n**Tier 1:** ${Array.from(d.firstTierPerks).join(', ')}\n**Tier 2:** ${Array.from(d.secondTierPerk).join(', ')}\n**Tier 3:** ${Array.from(d.thirdTierPerks).join(', ')}\n**Tier 4:** ${Array.from(d.fourthTierPerk).join(', ')}`)
                        }
                        else {
                            perksEmbed
                                .addField('Base', Array.from(d.basePerks).join('\n'), true)
                                .addField('Tier 1', Array.from(d.firstTierPerks).join('\n'), true)
                                .addField('Tier 2', Array.from(d.secondTierPerk).join('\n'), true)
                                .addField('\u200b', '\u200b')
                                .addField('Tier 3', Array.from(d.thirdTierPerks).join('\n'), true)
                                .addField('Tier 4', Array.from(d.fourthTierPerk).join('\n'), true)
                                .addField('\u200b', '\u200b')
                        }
                    }
                    if (d.bestUsePVE) perksEmbed.addField('Best PVE perks', Array.from(d.bestUsePVE).join('\n'), true)
                    if (d.bestUsePVP) perksEmbed.addField('Best crucible perks', Array.from(d.bestUsePVP).join('\n'), true)
                    title.push('Perks')
                    embeds.push(perksEmbed)
                }

                if (d.homePlanet || d.appearance) {
                    let planetEmbed = new Discord.MessageEmbed()
                        .setTitle('Appearances')
                        .setDescription(`${d.name} can appear in these places`)
                    if (d.homePlanet) planetEmbed.addField('Home Planet', d.homePlanet, true)
                    if (d.appearance) planetEmbed.addField('Appearances', Array.from(d.appearance).join('\n'), true)
                    title.push("Appearance")
                    embeds.push(planetEmbed)
                }

                if (d.bestWeapons || (d.tag == "Mechanic")) {
                    let weaponsEmbed = new Discord.MessageEmbed()
                        .setTitle('Weapons')
                        .setDescription(`Weapons of ${d.name}s`)
                    if (d.tag == "Mechanic") {
                        let tempArray = [];
                        for (const data in destiny) {
                            if (destiny[data].class == d.name) {
                                tempArray.push(destiny[data].name)
                            }
                            else continue;
                        }
                        weaponsEmbed.addField(`${d.name}s registered`, Array.from(tempArray).join('\n'), true)
                    }
                    if (d.bestWeapons) {
                        let str = "";
                        let i = 1;
                        d.bestWeapons.forEach(perk => {
                            str += String(i) + ": " + String(perk) + "\n"
                            i++
                        })
                        weaponsEmbed.addField(`Top ${d.bestWeapons.length} ${d.name}s`, str, true)
                    }

                    title.push('Weapons')
                    embeds.push(weaponsEmbed)
                }
                if (d.tag == 'Raid') {
                    if (d.chapters) {
                        let chapterEmbeds = [];
                        for (let i = 0; i < d.chapters.length; i++) {
                            chapterEmbeds[i] = new Discord.MessageEmbed()
                                .setTitle("Chapter " + d.chapters[i].chapter + ": " + d.chapters[i].name)
                                .setDescription(d.chapters[i].description)
                                .setImage(d.chapters[i].icon)
                                .addField('Required Players', String(d.chapters[i].requiredPlayers))
                            title.push("Chapter " + d.chapters[i].chapter + ": " + d.chapters[i].name)
                            embeds.push(chapterEmbeds[i])
                        }
                    }
                    if (d.tips) {
                        let tipsEmbed = [];
                        for (let i = 0; i < d.tips.length; i++) {
                            tipsEmbed[i] = new Discord.MessageEmbed()
                                .setTitle("Tip: " + d.tips[i].name)
                                .setDescription(d.tips[i].description)
                                .setImage(d.tips[i].icon)
                            title.push("Tip: " + d.tips[i].name)
                            embeds.push(tipsEmbed[i])
                        }
                    }
                    if (d.challenges) {
                        let challengeEmbed = new Discord.MessageEmbed()
                            .setTitle('Challenges')
                            .setDescription('Raid challenges.')
                            .addField('Challenges', Array.from(d.challenges).join('\n\n'))
                        title.push('Challenges')
                        embeds.push(challengeEmbed)
                    }
                }

                if (d.hardMode || d.modes) {
                    let hardModeEmbed = new Discord.MessageEmbed()
                        .setTitle('Hard Mode')
                        .setDescription('Additional changes when playing hard mode.')
                    if (d.hardMode) hardModeEmbed.addField('Changes', Array.from(d.hardMode).join('\n\n'))
                    if (d.modes[1]) hardModeEmbed.addField('Level', d.modes[1], true)
                    title.push('Hard Mode')
                    embeds.push(hardModeEmbed)
                }

                if (d.rewards) {
                    let rewardEmbed = new Discord.MessageEmbed()
                        .setTitle('Rewards')
                        .setDescription('Possible rewards you can obtain.')
                    if (d.rewards) rewardEmbed.addField('Rewards', Array.from(d.rewards).join('\n'), true)
                    title.push('Rewards')
                    embeds.push(rewardEmbed)
                }

                for (let i = 0; i < title.length; i++) {
                    comp.addOptions({ label: (title[i] || "Error title not provided: " + options[i]), value: options[i] })
                }

                break;
            }
        }

        if (comp.options.length <= 1) return interaction.reply({ embeds: [embed] })
        else interaction.reply({ embeds: [embed], components: [row] })
        let filter = (inter) => inter.isSelectMenu();
        let collector = interaction.channel.createMessageComponentCollector({ filter, time: 300000 });

        collector.on("collect", async (newInteraction) => {
            if (newInteraction.customId != `${interaction.id}-dropdownmenu`) return;
            let chosen = newInteraction.values[0]
            changeEmbed = embeds[options.indexOf(chosen)]
            if (chosen == 'index') {
                changeEmbed = embed;
            }
            changeEmbed
                .setColor(getColor(d.rank))
                .setFooter({ text: "All info is based on the latest Update of The Taken King DLC" })
            await newInteraction.update({ embeds: [changeEmbed], components: [row] })
        })

        collector.on('end', () => {
            interaction.editReply({ embeds: [changeEmbed], components: [] });
        })
    }
}