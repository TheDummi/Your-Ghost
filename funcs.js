const fs = require("fs");
const config = require('./data/config/config.json')
const Discord = require('discord.js');
const destiny = require('./data/game/destiny.json');
const got = require('got')
const hasteURLs = [
    "https://hst.sh",
    "https://hastebin.com",
    "https://haste.clicksminuteper.net",
    "https://haste.tyman.tech"
]


module.exports = {
    randColor() {
        let letters = '0123456789ABCDEF';
        let color = '';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },
    getColor(rank) {
        if (rank) {
            let newColor = config.color
            if (rank == "Exotic") return newColor = "#FFF000";
            if (rank == "Legendary") return newColor = "#3B0054";
            if (rank == "Rare") return newColor = '#02198B';
            if (rank == "Uncommon") return newColor = "#99EBCB";
            if (rank == "Common") return newColor = '#FFFFFF';
            return newColor;
        }
        else return config.color
    },
    randomNumber(min, max) {
        if (max == undefined) {
            max = min
            min = 0
        }
        let random = Math.floor(Math.random() * Math.floor(max) + min);
        return random;
    },
    exotics(tag, slot, rank) {
        let exotics = [];
        for (const data in destiny) {
            let des = destiny[data];
            if (des.tag == tag && des.slot == slot && des.rank == rank) {
                exotics.push(des.name)
            }
            else continue;
        }
        return exotics;
    },
    setPresence(client, argType, argName, argStatus) {
        client.user.setPresence({
            status: String(argStatus),
            activities: [{
                type: String(argType),
                name: String(argName),
                url: "https://www.youtube.com/watch?v=ciqUEV9F0OY&list=RDRbslF7GISf0&index=28"
            }],

        })
    },
    toArray(args) {
        let tempArray = [];
        for (const data in destiny) {
            if (destiny[data].tag == args) {
                tempArray.push(destiny[data].name)
            }
            else continue;
        }
        return tempArray;
    },
    randomUser(client) {
        let users = client.users.cache;
        let usersArray = [];
        users.forEach(user => {
            if (user.bot) return;
            else {
                usersArray.push(user.username)
            }
        })
        let randomUser = usersArray[randomNumber(usersArray.length)];
        return randomUser;
    },
    randomEmojis(args) {
        let choices = new Discord.Collection()
        let choicesLeft = message.guild.emojis.cache.filter(e => e.animated)
        let curChoice = "";
        for (let i = 0; i < Number(args[0]); i++) {
            curChoice = choicesLeft.randomKey()
            choices.set(curChoice, choicesLeft.get(curChoice))
            choicesLeft.delete(curChoice)
        }
        return choices
    },
    shuffle(array) {
        let shuffled = [];
        array = Array.from(array);
        while (array.length > 0) {
            shuffled.push(array.splice(randomNumber(array.length), 1)[0]);
        }
        return shuffled;
    },
    getUptime(client) {
        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
        let noSecUptime = `${days} days, ${hours} hours and ${minutes} minutes`;
        return { uptime: uptime, noSecUptime: noSecUptime };
    },
    async haste(text) {
        for (const url of hasteURLs) {
            try {
                const resp = await got.post(url + "/documents", {
                    body: text
                }).json()
                return `${url}/${resp.key}`
            } catch (e) {
                console.log(e)
                continue
            }
        }
        throw new Error("Haste failure")
    },
    capitalize(name) {
        name = name.toLowerCase();
        return name.charAt(0).toUpperCase() + name.slice(1)
    },
    commandError(action, error) {
        action.client.channels.fetch('916283556928557056')
            .then(channel => {
                let embed = new Discord.MessageEmbed()
                    .setTitle("ERROR")
                    .setDescription(`\`\`\`js\n${error.stack}\`\`\``)
                    .setColor(config.color)
                    .addField('Extra info', `Server: ${action.guild.name}\nChannel: ${action.channel}\nUser: ${action.author.tag || action.user.tag}\nCommand: ${String(action).length < 200 ? action : String(action).slice(200)}`, true)
                channel.send({ embeds: [embed] })
            }).catch((err) => {
                console.error(err, error)
            })
    },
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    validURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(str);
    },
    async paginate(message, embeds) {
        embeds.forEach((e, i) => {
            embeds[i] = embeds[i].setFooter(`Page ${i + 1}/${embeds.length} | Click ❔ for help!`)
        })
        let curPage = 0;
        if ((typeof embeds) !== "object") return
        const m = await message.util.reply("Use the emotes to navigate.", embeds[curPage])
        m.react("⏪")
        m.react("◀")
        m.react("⏹")
        m.react("▶")
        m.react("⏩")
        m.react("🔢")
        m.react("❔")
        const filter = (r, u) => ["⏪", "◀", "⏹", "▶", "⏩", "🔢", "❔"].includes(r.emoji.toString())
        coll = m.createReactionCollector(filter)
        let timeout = setTimeout(async () => {
            await m.edit("Timed out.", { embed: null })
            try {
                await m.reactions.removeAll()
            }
            catch { }
            coll.stop()
        }, 300000)
        coll.on("collect", async (r, u) => {
            if (u.id == message.client.user.id) return
            const userReactions = m.reactions.cache.filter(reaction => reaction.users.cache.has(u.id));
            for (const reaction of userReactions.values()) {
                try {
                    await reaction.users.remove(u.id);
                }
                catch { }
            }
            if (u.id != message.author.id) return
            clearTimeout(timeout)
            timeout = setTimeout(async () => {
                await m.edit("Timed out.", { embed: null })
                try {
                    await m.reactions.removeAll()
                }
                catch { }
                coll.stop()
            }, 300000)
            if (r.emoji.toString() == "◀") {
                if (curPage - 1 < 0) return
                if (!embeds[curPage - 1]) return
                curPage--
                await m.edit(embeds[curPage])
            }
            else if (r.emoji.toString() == "▶") {
                if (!embeds[curPage + 1]) return
                curPage++
                m.edit(embeds[curPage])
            }
            else if (r.emoji.toString() == "⏹") {
                clearTimeout(timeout)
                m.delete()
                try {
                    await m.edit("Command closed by user.", { embed: null })
                    await m.reactions.removeAll()
                }
                catch { }
                coll.stop()
            }
            else if (r.emoji.toString() == "⏪") {
                curPage = 0
                await m.edit(embeds[curPage])
            }
            else if (r.emoji.toString() == "⏩") {
                curPage = embeds.length - 1
                await m.edit(embeds[curPage])
            }
            else if (r.emoji.toString() == "🔢") {
                const filter = m => m.author.id == message.author.id && !(isNaN(Number(m.content)))
                const m1 = await message.reply("What page would you like to see? (Must be a number)")
                message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
                    .then(async messages => {
                        let resp = messages.array()[0]
                        resp = Number(resp.content)
                        const embedChange = embeds[resp - 1] || null
                        if (embedChange === null) {
                            const mErr = await message.channel.send("Invalid page.")
                            try {
                                await messages.array()[0].delete()
                            }
                            catch { }
                            setTimeout(async () => {
                                await mErr.delete()
                                await m1.delete()
                            }, 10000);
                            return
                        };
                        curPage = resp - 1
                        await m.edit(embedChange)
                        try {
                            await messages.array()[0].delete()
                        }
                        catch { }
                        await m1.delete()
                    })
                    .catch(async messages => {
                        const mErr = await message.channel.send(`Took too long.`)
                        setTimeout(async () => {
                            await mErr.delete()
                            await m1.delete()
                        }, 10000);
                    });
            }
            else if (r.emoji.toString() == "❔") {
                let embed4 = new Discord.MessageEmbed()
                    .setTitle('Legend')
                    .setDescription('⏪: first page\n\n◀: previous page\n\n⏹: close command\n\n▶: next page\n\n⏩: last page\n\n🔢: page picker\n\n❔: toggle help menu')
                    .setColor(randColor())
                const e = m.embeds[0]
                const isSame = e.title === embed4.title && e.footer === embed4.footer && e.description === embed4.description
                if (isSame) {
                    await m.edit(embeds[curPage])
                }
                else {
                    await m.edit(embed4)
                }

            }
        })
    }
};