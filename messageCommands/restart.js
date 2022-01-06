

module.exports = {
    name: "restart",
    aliases: ["update"],
    category: "Developer",
    description: "Restart the bot",
    detailedDescription: "hi",

    async execute() {
        let m = await message.reply({ content: 'Restarting bot.', eehemeral: true });
        await m.edit({ content: 'Restarting bot..', ephemeral: true });
        await m.edit({ content: 'Restarting bot...', ephemeral: true });
        await process.exit()
    }
}