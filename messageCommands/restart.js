

module.exports = {
    owner: true,
    name: "restart",
    aliases: ["update"],
    category: "Developer",
    description: "Restart the bot",
    detailedDescription: "hi",

    async execute(message) {
        let str = "Restarting bot."
        let m = await message.reply({ content: str, eehemeral: true });
        let row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId(`${m.id}-yes`)
                    .setStyle("SUCCESS")
                    .setLabel("Yes")
            )
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId(`${m.id}-no`)
                    .setStyle("DANGER")
                    .setLabel("No")
            )
        m.edit({ content: str += "." })
        m.edit({ content: str += "." })
        if (global == true) await m.edit({ content: "\n**!Warning you're registering global commands!**\nWould you like to continue restarting?", components: [row] })
        message.client.on('interactionCreate', async interaction => {
            if (!interaction.isButton()) return;
            if (interaction.customId == `${m.id}-yes`) {
                await m.edit({ content: "Restarted!", components: [] })
                return await process.exit()
            }
            else return await m.edit({ content: "Cancelled restart!", components: [] })
        })
    }
}
