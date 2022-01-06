const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../data/config/config.json');
const Discord = require('discord.js')

module.exports = {
    category: "Config",
    detailedDescription: "Set the new weekly content\n\nNightfall: set the nightfall\nModifiers: set the modifiers of the nightfall\nHeroic: set the heroic strikes modifiers\nCrucible: set the 2 weekly Crucible gamemodes\nCoE: set the modifiers for Challenge of the Elders\nPoE: set the playlist names for the Prison of Elders\nKf: set the Challenge for King's Fall",
    contributor: true,
    homeGuild: true,
    data: new SlashCommandBuilder()
        .setName('setweekly')
        .setDescription('Replies with weekly events in destiny.')
        .addStringOption((option) =>
            option
                .setName('nightfall')
                .setDescription('What is the nightfall strike?')
                .setRequired(true)
                .addChoice('The Will of Crota', 'The Will of Crota')
                .addChoice('Fallen S.A.B.E.R.', 'Fallen S.A.B.E.R.')
                .addChoice('Shadow\'s Thief', 'Shadow\'s Thief')
                .addChoice('Blighted Chalice', 'Blighted Chalice')
                .addChoice('Winter\'s Run', 'Winter\'s Run')
                .addChoice('Echo Chamber', 'Echo Chamber')
                .addChoice('Undying Mind', 'Undying Mind')
                .addChoice('Cerberus Vae VIII', 'Cerberus Vae VIII')
                .addChoice('Dust Palace', 'Dust Palace')
                .addChoice('Shield Brothers', 'Shield Brothers')
                .addChoice('Sunless Cell', 'Sunless Cell')
        )
        .addStringOption((option) =>
            option
                .setName('modifiers')
                .setDescription('What are the modifiers of the nightfall')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('heroic')
                .setDescription('What are the modifiers for the heroic strikes?')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('crucible')
                .setDescription('What are the weekly Crucible?')
                .setRequired(true)
                .addChoice('Meyham Clash, Mayhem Rumble', 'Mayhem Clash,\nMayhem Rumble')
                .addChoice('Meyham Clash, Doubles', 'Mayhem Clash,\nDoubles')
                .addChoice('Meyham Clash, Inferno Rumble', 'Mayhem Clash\,nInferno Rumble')
                .addChoice('Inferno, Mayhem Rumble', 'Inferno,\nMayhem Rumbl')
                .addChoice('Inferno, Doubles', 'Inferno\,nDoubles')
                .addChoice('Inferno, Inferno Rumble', 'Inferno,\nInferno Rumble')
                .addChoice('Zone Control, Mayhem Rumble', 'Zone Control,\nMayhem Rumble')
                .addChoice('Zone Control, Doubles', 'Zone Control,\nDoubles')
                .addChoice('Zone Control, Inferno Rumble', 'Zone Control,\nInferno Rumble')
        )
        .addStringOption((option) =>
            option
                .setName('coe')
                .setDescription('What are the weekly modifiers of Challenge of the Elders?')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('poe')
                .setDescription('What are the weekly playlists of Prison of Elders?')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('kf')
                .setDescription('What is the King\'s Fall Challenge?')
                .setRequired(true)
                .addChoice('Warpriest Challenge', 'Warpriest Challenge')
                .addChoice('Golgoroth Challenge', 'Golgoroth Challenge')
                .addChoice('Oryx Challenge', 'Oryx Challenge')
        ),

    async execute(interaction) {
        let options = interaction.options
        let nightfall = options.getString('nightfall')
        let modifiers = options.getString('modifiers')
        let heroic = options.getString('heroic')
        let crucible = options.getString('crucible')
        let coe = options.getString('coe')
        let poe = options.getString('poe')
        let kf = options.getString('kf')

        let embed = new Discord.MessageEmbed()
            .setTitle('Weekly events')
            .setColor(color)
            .setDescription(`**Nightfall:** ${nightfall}\n**Modifiers:** ${modifiers}`)
            .addFields({ name: "Heroic Strike Modifiers", value: heroic, inline: true }, { name: "Weekly crucible", value: crucible, inline: true }, { name: "Challenge of the Elders Modifiers", value: coe, inline: true }, { name: "Prison of Elders Playlists", value: poe, inline: true }, { name: "King's Fall Challenge", value: kf, inline: true })
        await interaction.client.channels.cache.get('862861968955408386').send({ content: "<@&858281169884020786>", embeds: [embed] });
        await interaction.reply({ content: "The embed has been posted in <#862861968955408386>!", ephemeral: true })
    },
};