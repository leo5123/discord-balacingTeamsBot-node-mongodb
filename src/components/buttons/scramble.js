const Player = require('../../schemas/player');
const { SlashCommandBuilder, EmbedBuilder, Client, Message, GuildMember } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const moongose = require('mongoose');
const fetchElo = require('../../functions/pug/fetchElo');
const pugone = require('../../schemas/pugone');


module.exports = {
    data: {
        name: 'scramble'
    },
    async execute(interaction, client) {



        let channelParticipants = []
        const array = [];
        let name = []
        let storedElo
        client.channels.cache.filter((c) => c.name === 'Add up').forEach(channel => {
            channel.fetch().then(async (channel) => {
                console.log(channel.name);
                for (let [snowflake, guildMember] of channel.members) {
                    console.log(`${guildMember.displayName} (${guildMember.id})`);
                    array.push(guildMember.id)
                    name.push(guildMember.name)
                }
                const storedElo = await Player.find({ discordId: array })

                console.log(storedElo)

                // utility functions
                const sum = (ns) => ns.reduce((a, b) => a + b, 0)

                const combinations = (xs, n) =>
                    xs.flatMap((x, i) =>
                        n == 1
                            ? [[x]]
                            : combinations(xs.slice(i + 1), n - 1)
                                .map(combo => [x, ...combo])
                    )

                const complement = (xs, ys) => xs.filter(x => !ys.includes(x))

                const splits = (fn, xs) =>
                    combinations(xs, Math.ceil(xs.length / 2))
                        .map(c => [c, complement(xs, c)])
                        .reduce(
                            ({ all, uniq }, [a, b], _, __, ka = fn(a), kb = fn(b)) =>
                                uniq.has(ka) || uniq.has(kb)
                                    ? { all, uniq }
                                    : { all: all.concat([[a, b]]), uniq: uniq.add(ka).add(kb) },
                            { all: [], uniq: new Set() }
                        ).all


                // helper function
                const skillTotal = (players) =>
                    sum(players.map(p => p.elo))


                // main function
                const nClosestSplits = (n, players) =>
                    splits(xs => xs.map(x => x.lastUsername).join('~'), players).map(([a, b]) => ({
                        teamA: a,
                        teamB: b,
                        scoreDiff: Math.abs(skillTotal(a) - skillTotal(b))
                    }))
                        .sort(({ scoreDiff: a }, { scoreDiff: b }) => a - b)
                        .slice(0, n)

                const result = []
                while (storedElo.length) {
                    const index = Math.floor(Math.random() * storedElo.length);
                    result.push(storedElo.splice(index, 1)[0]);
                }
                // sample data

                const presentPlayers = result

                let redTeam = []
                let blueTeam = []

                // demo
                const display = (splits) =>
                    splits.map(({ teamA, teamB, scoreDiff }) => `(Player: ${teamA.map(a => `${a.lastUsername}`).join(', ')}, elo: ${skillTotal(teamA)}) vs (Player: ${teamB.map(b => `${b.lastUsername}`).join(', ')}, elo: ${skillTotal(teamB)}),  diff = ${scoreDiff
                        }`).join('\n')

                const displayIds = (splits) =>
                    splits.map(({ teamA, teamB, scoreDiff }) => {
                        teamA.map(async (a) => {
                            redTeam.push(a.discordId)


                            await pugone.findOneAndUpdate(
                                { pugId: '1' },
                                {
                                    redPlayers: redTeam
                                })
                        })

                        teamB.map(async (b) => {
                            blueTeam.push(b.discordId)


                            await pugone.findOneAndUpdate(
                                { pugId: '1' },
                                {
                                    bluePlayers: blueTeam
                                })
                        })
                    })


                displayIds((nClosestSplits(1, presentPlayers)))


                channelParticipants.push(display(nClosestSplits(1, presentPlayers)))
                console.log(channelParticipants)

                const button2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('done')
                            .setLabel('Done!')
                            .setStyle(ButtonStyle.Primary)
                    )

                const button = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('scramble')
                            .setLabel('Scramble')
                            .setStyle(ButtonStyle.Primary),
                    );

                return await interaction.reply({
                    content: `${channelParticipants}`,
                    components: [button, button2],

                    ephemeral: true,
                })


            });
        });


    }
}