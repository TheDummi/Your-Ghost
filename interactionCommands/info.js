const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { color, owners, contributors, guildID } = require('../data/config/config.json');

const Package = require('../package.json');
const destiny = require('../data/game/destiny.json');
const options = require('../data/config/options.json');

const { getColor, getUptime } = require('../funcs.js')

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
        if (item == 'bot' || item == 'ghost' || item == `<@!${interaction.client.id}>` || item == `<@!${interaction.client.id}>`) {
            let leadDev = await interaction.client.users.fetch(owners[0]);
            let devArray = [];
            for (let dev of owners) {
                let thedev = await interaction.client.users.fetch(dev);
                devArray.push(thedev.tag)
            }
            let guilds = await interaction.client.guilds.fetch();
            let memberCount = 0;
            for (let guild of guilds.values()) {
                memberCount += (await guild.fetch()).approximateMemberCount;
            }
            let infoEmbed = new Discord.MessageEmbed()
                .setAuthor({ name: `Info on ${interaction.client.user.username}`, iconURL: interaction.client.user.avatarURL({ dynamic: true }) })
                .setDescription(`Official ${interaction.client.user.username} info, Join [${interaction.client.guilds.cache.get(guildID)}](https://discord.gg/apKmGsM9mb) for help.`)
                .addField('Credits', `Lead Developer: ${leadDev.tag}\nDevelopers: ${devArray.join(', ')}\nDirector: ${leadDev.tag}\nGroup: [Dummi Studios](https://discord.gg/apKmGsM9mb})`)
                .addField('Technical Info', `Version: ${Package.version}\nLanguage: JavaScript\nLibrary: Discord.js\nLibrary Version: ${Discord.version}`)
                .addField('Bot Info', `Users: ${memberCount}\nServers: ${guilds.size}\nPing: ${String(interaction.client.ws.ping)}ms\nUptime: ${getUptime(interaction.client).noSecUptime}\nDocumentation: [here]()`)
                .setFooter({ text: '© 2022 Dummi Studios. All rights reserved.' })
                .setColor(color)
            return await interaction.reply({ embeds: [infoEmbed] })
        }
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
                    .setFooter({ text: `You searched for \`${item}\`, if this wasn't what you were looking for please be more specific.`, iconURL: interaction.user.avatarURL({ dynamic: true }) })

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
                if (d.rank || d.tag || d.class || d.tag || d.modes || d.slot || d.character) {
                    let infoEmbed = new Discord.MessageEmbed()
                        .setTitle('General Info')
                        .setDescription(`General info of ${d.name}`)
                    if (d.rank) infoEmbed.addField('Rank', d.rank, true)
                    if (d.tag) infoEmbed.addField('Tag', d.tag, true)
                    if (typeof d.class == 'string') infoEmbed.addField('Class', d.class, true)
                    if (d.max) infoEmbed.addField('Max', String(d.max), true)
                    if (d.modes) infoEmbed.addField('Modes', Array.from(d.modes).join('\n'), true)
                    if (d.slot) infoEmbed.addField('Slot', d.slot, true)
                    if (d.character) infoEmbed.addField('Character', d.character, true)
                    title.push('General Info')
                    embeds.push(infoEmbed)
                }
                if (d.obtainable || d.requirements) {
                    let obtainEmbed = new Discord.MessageEmbed()
                        .setTitle('How to obtain')
                        .setDescription(`How to obtain ${d.name} and it's requirements.`)
                    if (d?.obtainable.year1 || d?.requirements.year1) obtainEmbed.addField('Year 1', '\u200b')
                    if (d?.obtainable.year1) obtainEmbed.addField('How to obtain', ">>> " + Array.from(d.obtainable.year1).join('\n'), true)
                    if (d?.requirements.year1) obtainEmbed.addField('Requirements', ">>> " + Array.from(d.requirements.year1).join('\n'), true)
                    if (d?.obtainable.year2 || d?.requirements.year2) obtainEmbed.addField('Year 2', '\u200b')
                    if (d?.obtainable.year2) obtainEmbed.addField('How to obtain', ">>> " + Array.from(d.obtainable.year2).join('\n'), true)
                    if (d?.requirements.year2) obtainEmbed.addField('Requirements', ">>> " + Array.from(d.requirements.year2).join('\n'), true)
                    title.push('How to Obtain')
                    embeds.push(obtainEmbed)
                }

                if (d.name == "Warlock" || d.name == "Hunter" || d.name == "Titan") {
                    let subclassEmbed = new Discord.MessageEmbed()
                        .setTitle('Subclasses')
                        .setDescription(`Subclasses of ${d.name}.`)
                    for (const data in destiny) {
                        let e = destiny[data];
                        if (e.character == d.name && e.tag == "Subclass") {
                            subclassEmbed.addField(e.name, ">>> " + e.description)
                        }
                    }
                    title.push('Subclasses')
                    embeds.push(subclassEmbed)
                }

                if (d.tag == "Subclass") {
                    if (d.grenade) {
                        let embed = new Discord.MessageEmbed()
                            .setTitle('Grenades')
                            .setDescription(`Grenades of ${d.name}.`)
                            .addField(d.grenade.one.name, d.grenade.one.description)
                            .addField(d.grenade.two.name, d.grenade.two.description)
                            .addField(d.grenade.three.name, d.grenade.three.description)
                        embeds.push(embed)
                        title.push('Grenade')
                    }
                    if (d.movement) {
                        let obtainEmbed = new Discord.MessageEmbed()
                            .setTitle(d.movement.name)
                            .setDescription(d.movement.description)
                            .addField(d.movement.modifiers.one.name, d.movement.modifiers.one.description)
                            .addField(d.movement.modifiers.two.name, d.movement.modifiers.two.description)
                            .addField(d.movement.modifiers.three.name, d.movement.modifiers.three.description)
                        embeds.push(obtainEmbed)
                        title.push('Movement')
                    }
                    if (d.super) {
                        let embed = new Discord.MessageEmbed()
                            .setTitle(d.super.name)
                            .setDescription(d.super.description)
                            .addField(d.super.modifiers.one.name, d.super.modifiers.one.description)
                            .addField(d.super.modifiers.two.name, d.super.modifiers.two.description)
                            .addField(d.super.modifiers.three.name, d.super.modifiers.three.description)
                        embeds.push(embed)
                        title.push('Super')
                    }
                    if (d.melee) {
                        let embed = new Discord.MessageEmbed()
                            .setTitle(d.melee.name)
                            .setDescription(d.melee.description)
                            .addField(d.melee.modifiers.one.name, d.melee.modifiers.one.description)
                            .addField(d.melee.modifiers.two.name, d.melee.modifiers.two.description)
                            .addField(d.melee.modifiers.three.name, d.melee.modifiers.three.description)
                        embeds.push(embed)
                        title.push('Melee')
                    }
                    if (d.class) {
                        let embed = new Discord.MessageEmbed()
                            .setTitle("Class")
                            .setDescription(`Class upgrades for ${d.name}`)
                            .addField(d.class.one.name, d.class.one.description)
                            .addField(d.class.two.name, d.class.two.description)
                            .addField(d.class.three.name, d.class.three.description)
                        embeds.push(embed)
                        title.push('Class')
                    }
                    if (d.ability) {
                        let embed = new Discord.MessageEmbed()
                            .setTitle("Ability")
                            .setDescription(`Ability upgrades for ${d.name}`)
                            .addField(d.ability.one.name, d.ability.one.description)
                            .addField(d.ability.two.name, d.ability.two.description)
                            .addField(d.ability.three.name, d.ability.three.description)
                        embeds.push(embed)
                        title.push('Ability')
                    }
                    if (d.attribute) {
                        let embed = new Discord.MessageEmbed()
                            .setTitle("Attribute")
                            .setDescription(`Attribute upgrades for ${d.name}`)
                            .addField(d.attribute.one.name, d.attribute.one.description)
                            .addField(d.attribute.two.name, d.attribute.two.description)
                            .addField(d.attribute.three.name, d.attribute.three.description)
                        embeds.push(embed)
                        title.push('Attribute')
                    }
                    if (d.abilityTwo) {
                        let embed = new Discord.MessageEmbed()
                            .setTitle("Ability")
                            .setDescription(`Ability upgrades for ${d.name}`)
                            .addField(d.abilityTwo.one.name, d.abilityTwo.one.description)
                            .addField(d.abilityTwo.two.name, d.abilityTwo.two.description)
                            .addField(d.abilityTwo.three.name, d.abilityTwo.three.description)
                        embeds.push(embed)
                        title.push('Ability')
                    }
                }

                if (d.stats || d.light) {
                    let statsEmbed = new Discord.MessageEmbed()
                        .setTitle('Stats')
                        .setDescription(`Stats for ${d.name}`)
                    if (d?.light?.min || d?.light?.max) statsEmbed.addField('Light', '\u200b')
                    if (d?.light?.min) statsEmbed.addField('Base', ">>> " + Array.from(d.light.min).join('\n'), true)
                    if (d?.light?.max) statsEmbed.addField('Max', ">>> " + Array.from(d.light.max).join('\n'), true)
                    if (d?.stats) {
                        statsEmbed.addField('Stats', '\u200b')
                        if (d?.stats?.intellect) statsEmbed.addField('Intellect', ">>> " + d.stats.intellect, true)
                        if (d?.stats?.discipline) statsEmbed.addField('Discipline', ">>> " + d.stats.discipline, true)
                        if (d?.stats?.strength) statsEmbed.addField('Strength', ">>> " + d.stats.strength, true)
                        let str = ">>> ";
                        if (d?.stats?.rof) str += "**Rate of Fire**: " + d.stats.rof + "\n";
                        if (d?.stats?.impact) str += "**Impact**: " + d.stats.impact + "\n";
                        if (d?.stats?.range) str += "**Range**: " + d.stats.range + "\n";
                        if (d?.stats?.stability) str += "**Stability**: " + d.stats.stability + "\n";
                        if (d?.stats?.reload) str += "**Reload**: " + d.stats.reload;
                        if (d?.stats?.rof || d?.stats?.impact || d?.stats?.range || d?.stats?.stability || d?.stats?.reload) statsEmbed.addField('In-game Stats', str, true)
                        str = ">>> ";
                        if (d?.stats?.magazine) str += "**Magazine**: " + d.stats.magazine + "\n";
                        if (d?.stats?.zoom) str += "**Zoom**: " + d.stats.zoom + "\n";
                        if (d?.stats?.aim) str += "**Aim Assist**: " + d.stats.aim + "\n";
                        if (d?.stats?.recoil) str += "**Recoil Control**: " + d.stats.recoil + "\n";
                        if (d?.stats?.speed) str += "**Equip Speed**: " + d.stats.speed;
                        if (d?.stats?.magazine || d?.stats?.zoom || d?.stats?.aim || d?.stats?.recoil || d?.stats?.speed) statsEmbed.addField('Other Stats', str, true)
                        str = ">>> ";
                        if (d?.stats?.defense) str += "**Defense**: " + d.stats.defense + "\n"
                        if (d?.stats?.efficiency) str += "**Efficiency**: " + d.stats.efficiency + "\n"
                        if (d?.stats?.defense || d?.stats?.efficiency) statsEmbed.addField('Stats only for this weapon', str, true)
                    }
                    title.push('Stats')
                    embeds.push(statsEmbed)
                }

                if (d.perks) {
                    if (d.perks.year1) {
                        let yearOnePerks = new Discord.MessageEmbed()
                            .setTitle('Year 1 Perks')
                            .setDescription(`year 1 perks of ${d.name}.`)
                        if (d.perks.year1.base) yearOnePerks.addField('Base', ">>> " + Array.from(d.perks.year1.base).join("\n"));
                        if (d.perks.year1.one) yearOnePerks.addField('Tier 1', ">>> " + Array.from(d.perks.year1.one).join('\n'), true);
                        if (d.perks.year1.two) yearOnePerks.addField('Tier 2', ">>> " + Array.from(d.perks.year1.two).join("\n"), true);
                        if (d.perks.year1.three) yearOnePerks.addField('Tier 3', ">>> " + Array.from(d.perks.year1.three).join("\n"), true);
                        if (d.perks.year1.four) yearOnePerks.addField('Tier 4', ">>> " + Array.from(d.perks.year1.four).join("\n"), true);
                        if (d.perks.year1.five) yearOnePerks.addField('Tier 5', ">>> " + Array.from(d.perks.year1.five).join("\n"), true);
                        if (d.perks.year1.six) yearOnePerks.addField('Tier 6', ">>> " + Array.from(d.perks.year1.six).join("\n"), true);
                        if (d.perks.year1.seven) yearOnePerks.addField('Tier 7', ">>> " + Array.from(d.perks.year1.seven).join("\n"), true);
                        title.push('Perks (Y1)')
                        embeds.push(yearOnePerks)
                    }
                    if (d.perks.year2) {
                        let yearTwoPerks = new Discord.MessageEmbed()
                            .setTitle('Year 2 Perks')
                            .setDescription(`Year 2 perks of ${d.name}.`)
                        if (d.perks.year2.base) yearTwoPerks.addField('Base', ">>> " + Array.from(d.perks.year2.base).join("\n"));
                        if (d.perks.year2.one) yearTwoPerks.addField('Tier 1', ">>> " + Array.from(d.perks.year2.one).join('\n'), true);
                        if (d.perks.year2.two) yearTwoPerks.addField('Tier 2', ">>> " + Array.from(d.perks.year2.two).join("\n"), true);
                        if (d.perks.year2.three) yearTwoPerks.addField('Tier 3', ">>> " + Array.from(d.perks.year2.three).join("\n"), true);
                        if (d.perks.year2.four) yearTwoPerks.addField('Tier 4', ">>> " + Array.from(d.perks.year2.four).join("\n"), true);
                        if (d.perks.year2.five) yearTwoPerks.addField('Tier 5', ">>> " + Array.from(d.perks.year2.five).join("\n"), true);
                        if (d.perks.year2.six) yearTwoPerks.addField('Tier 6', ">>> " + Array.from(d.perks.year2.six).join("\n"), true);
                        if (d.perks.year2.seven) yearTwoPerks.addField('Tier 7', ">>> " + Array.from(d.perks.year2.seven).join("\n"), true);
                        title.push('Perks (Y2)')
                        embeds.push(yearTwoPerks)
                    }
                }

                if (d.bestUsePVE || d.bestUsePVP) {
                    let perksEmbed = new Discord.MessageEmbed()
                        .setTitle('Best Perks')
                        .setDescription(`Perks of ${d.name}.`)
                    if (d.bestUsePVE) perksEmbed.addField('Best PVE perks', ">>> " + Array.from(d.bestUsePVE).join('\n'), true)
                    if (d.bestUsePVP) perksEmbed.addField('Best crucible perks', ">>> " + Array.from(d.bestUsePVP).join('\n'), true)
                    title.push('Best perks')
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
                            if (d.chapters[i].description) chapterEmbeds[i].setDescription(d.chapters[i].description)
                            if (d.chapters[i].icon) chapterEmbeds[i].setImage(d.chapters[i].icon)
                            if (d.chapters[i].hardMode) chapterEmbeds[i].addField('Hard mode', d.chapters[i].hardMode)
                            if (d.chapters[i].rewards) chapterEmbeds[i].addField('Rewards', Array.from(d.chapters[i].rewards).join('\n'), true)
                            if (d.chapters[i].requiredPlayers) chapterEmbeds[i].addField('Required Players', String(d.chapters[i].requiredPlayers), true)

                            title.push("Chapter " + d.chapters[i].chapter + ": " + d.chapters[i].name)
                            embeds.push(chapterEmbeds[i])
                        }
                    }
                    if (d.chests) {
                        let chestsEmbed = [];
                        for (let i = 0; i < d.chests.length; i++) {
                            chestsEmbed[i] = new Discord.MessageEmbed()
                                .setTitle("Chest " + d.chests[i].name)
                                .setDescription(d.chests[i].description)
                                .setImage(d.chests[i].icon)
                                .addField('Rewards', Array.from(d.chests[i].rewards).join('\n'), true)
                            title.push("Chest " + d.chests[i].name)
                            embeds.push(chestsEmbed[i])
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
                if (d.tag == "Species") {
                    let enemies = []
                    let vehicles = [];
                    let detachments = [];
                    let ultras = [];
                    let armyEmbed = new Discord.MessageEmbed()
                        .setTitle('Army')
                        .setDescription(`The army of ${d.name}`)
                    for (const data in destiny) {
                        if (destiny[data].tag == "Enemy" && d.name == "The " + destiny[data].species) enemies.push(destiny[data].name)
                        if (destiny[data].tag == "Vehicle" && d.name == "The " + destiny[data].species) vehicles.push(destiny[data].name)
                        if (destiny[data].tag == "Detachment" && d.name == "The " + destiny[data].species) detachments.push(destiny[data].name)
                        if (destiny[data].tag == "Ultra" && d.name == "The " + destiny[data].species) ultras.push(destiny[data].name)
                    }
                    armyEmbed.addField('Ranks', Array.from(enemies).join('\n') || "None", true)
                    armyEmbed.addField('Vehicles', Array.from(vehicles).join('\n') || "None", true)
                    armyEmbed.addField('\u200b', '\u200b')
                    armyEmbed.addField('Detachments', Array.from(detachments).join('\n') || "None", true)
                    armyEmbed.addField('Ultras', Array.from(ultras).join('\n') || "None", true)
                    title.push('Army')
                    embeds.push(armyEmbed)
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
                    if (d.rewards) {
                        if (String(Array.from(d.rewards.join('\n')).length > 1024)) {
                            rewardEmbed
                                .addField('Rewards 1', Array.from(d.rewards.slice(0, (d.rewards.length / 2))).join('\n'), true)
                                .addField('Rewards 2', Array.from(d.rewards.slice((d.rewards.length / 2))).join('\n'), true)
                        }
                        else rewardEmbed.addField('Rewards', Array.from(d.rewards).join('\n'), true)
                    }
                    title.push('Rewards')
                    embeds.push(rewardEmbed)
                }

                for (let i = 0; i < title.length; i++) {
                    comp.addOptions({ label: (title[i] || "Error title not provided: " + options[i]), value: options[i] })
                }
                break;
            }
        }
        changeEmbed = embed;
        if (comp.options.length <= 1) return interaction.reply({ embeds: [changeEmbed] })
        else interaction.reply({ embeds: [changeEmbed], components: [row] })
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
                .setFooter({ text: "All info is based on the latest Update of The Taken King DLC.", iconURL: interaction.user.avatarURL({ dynamic: true }) })
            if (d.logo) changeEmbed.setThumbnail(d.logo)
            await newInteraction.update({ embeds: [changeEmbed], components: [row] })
        })

        collector.on('end', () => {
            interaction.editReply({ embeds: [changeEmbed], components: [] });
        })
    }
}