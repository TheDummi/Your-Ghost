const { setPresence } = require('../funcs.js')
const fs = require('fs');
const uses = require('../data/user/uses.json')
module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (!interaction.isCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
            await setPresence(interaction.client, 'WATCHING', `${interaction.user.username} use ${interaction.commandName}!`)
            let com = interaction.commandName;
            if (!uses[interaction.user.id]) {
                uses[interaction.user.id] = {
                    name: interaction.user.username,
                    uses: { [com]: 1 }
                }
            }
            if (com == 'uses') return;
            else {
                uses[interaction.user.id].name = interaction.user.username;
                let use = [];
                use = uses[interaction.user.id].uses
                if (Object.keys(use).includes(com)) {
                    use = use[com]++
                }
                else {
                    use[com] = 1;
                }
            }
            fs.writeFile('data/user/uses.json', JSON.stringify(uses), (err) => { if (err) console.error })
        }
        catch (error) {
            console.error(error);
            try {
                await interaction.reply(
                    {
                        content: `There was an error executing ${interaction.commandName}.`,
                        ephemeral: true
                    });
            }
            catch { }
        }
    }
}