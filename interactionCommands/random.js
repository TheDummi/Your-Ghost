const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../data/config/config.json');
const Discord = require('discord.js');
const destiny = require('../data/game/destiny.json');
const { getRandomNumber } = require('../funcs');
module.exports = {
    detailedDescription: "random",
    category: "Destiny",
    data: new SlashCommandBuilder()
        .setName('random')
        .setDescription('random')
        .addStringOption((option) =>
            option
                .setName('type')
                .setDescription('type')
                .addChoice('Weapon', 'Weapon')
                .addChoice('Armor', 'Armor')
                .addChoice('Strike', 'Strike')
                .addChoice('Mission', 'Mission')
                .addChoice('Raid', 'Raid')
                .addChoice('Loadout', 'Loadout')
                .addChoice('Loadout-with-mod', 'Loadout-with-mod')
                .addChoice('Loadout-with-handicap', 'Loadout-with-handicap')
                .addChoice('Full-loadout', 'Full-loadout')
                .addChoice('Character', 'Character')
        )
        .addStringOption((option) =>
            option
                .setName('rank')
                .setDescription('rank')
                .addChoice('Exotic', 'Exotic')
                .addChoice('Legendary', 'Legendary')
                .addChoice('Rare', 'Rare')
                .addChoice('Common', 'Common')
                .addChoice('Uncommon', 'Uncommon')
        ).addStringOption((option) =>
            option
                .setName('slot')
                .setDescription('slot')
                .addChoice('Primary', 'Primary')
                .addChoice('Special', 'Special')
                .addChoice('Heavy', 'Heavy')
                .addChoice('Helmet', 'Helmet')
                .addChoice('Gauntlets', 'Gauntlets')
                .addChoice('Chest', 'Chest')
                .addChoice('Legs', 'Legs')
                .addChoice('Class-item', 'Class-item')
                .addChoice('Artifact', 'Artifact')
        )
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription('user')
        )
        .addStringOption((option) =>
            option
                .setName('users')
                .setDescription('users')
        ),
    async execute(interaction) {
        let type = interaction.options.getString('type')
        let rank = interaction.options.getString('rank')
        let slot = interaction.options.getString('slot')
        let user = interaction.options.getUser('user')
        let users = interaction.options.getString('users')?.split(" ")
        if (user?.bot) user = interaction.user;
        member = user || interaction.user;
        let embed = new Discord.MessageEmbed()
            .setColor(color)
        if (type == null && slot == null && type == null) embed.setTitle('Please select an option.');
        function randomize() {
            let items = []
            let characters = [];
            let subclasses = [];
            let weapons = [];
            let armor = [];
            let mods = [
                "No Grenade",
                "No Primary",
                "No Special",
                "No Heavy"
            ]
            let handicaps = {
                "Hunter": { "Nightstalker": ["Evade"], "Gunslinger": ["Chain of Woe"], "Bladedancer": ["Skip Grenade"] },
                "Titan": { "Defender": ["Weapons of Light"], "Sunbreaker": ["Fusion Grenade"], "Striker": ["Shoulder Charge"] },
                "Warlock": { "Voidwalker": ["Scatter Grenade"], "Sunsinger": ["Solar Grenade"], "Stormcaller": ["Stormtrance"] }
            }
            let handicap;
            let mod;
            let char;
            let subclass;
            for (const data in destiny) {
                let d = destiny[data]
                if (d.tag == type && d.rank == rank && d.slot == slot) items.push(d.name);
                if (d.tag == type && d.rank == rank && slot == null) items.push(d.name);
                if (d.tag == type && rank == null && d.slot == slot) items.push(d.name);
                if (type == null && d.rank == rank && d.slot == slot) items.push(d.name);
                if (d.tag == type && rank == null && slot == null) items.push(d.name);
                if (type == null && d.rank == rank && slot == null) items.push(d.name);
                if (type == null && rank == null && d.slot == slot) items.push(d.name);
                if (type == null && rank == null && slot == null) items = [];
                if (type?.toLowerCase().includes('loadout')) {
                    if (d.tag == "Character") characters.push(d.name)
                    if (d.tag == "Subclass") { subclasses.push({ [d.character.toString()]: d.name }); }
                    subclass = subclasses[getRandomNumber(subclasses.length)];
                    if (d.tag == "Weapon" && d.rank == "Exotic") weapons.push(d.name)
                    if (d.tag == 'Armor' && d.character == char) armor.push(d.name)
                }

            }
            if (type?.includes('mod') || type?.toLowerCase().includes('full')) {
                mod = mods[getRandomNumber(mods.length)]
            }
            if (type?.includes('handicap') || type?.toLowerCase().includes('full')) {
                handicap = "soon"
            }
            char = characters[getRandomNumber(characters.length)];

            let newSubclasses = [];
            subclasses.map(s => { if (s[char] != undefined) newSubclasses.push(s[char]) })
            subclass = newSubclasses[getRandomNumber(newSubclasses.length)];
            let weapon = weapons[getRandomNumber(weapons.length)];
            if ((weapon == 'Tlaloc' && char != "Warlock") || (weapon == 'Ace of Spades' && char != "Hunter") || (weapon == 'The Fabian Strategy' && char != "Titan")) weapon = weapons[getRandomNumber(weapons.length)]
            if (type?.toLowerCase()?.includes('loadout')) return `Character: ${char || 'none'}\nSubclass: ${subclass || 'none'}\nWeapon: ${weapon || 'none'}\nArmor piece: ${armor[getRandomNumber(armor.length)] || 'none'} (soon) ${mod ? (`\nModifier: ` + mod) : ""} ${handicap ? `\nHandicap ` + handicap : ""}`;
            if (users) return users = users[getRandomNumber(users.length)]
            else return items.length > 0 ? items[getRandomNumber(items.length)] : "No items found to randomize.";
        }

        embed
            .setTitle(('Random ' + type || rank || slot) + (user != null ? ` for ${user?.username}` : ""))
            .setDescription(String(randomize()) || 'error')
            .setThumbnail(member.avatarURL({ dynamic: true }))
        interaction.reply({ embeds: [embed] })
    },
};