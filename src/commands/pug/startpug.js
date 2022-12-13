const Player = require('../../schemas/player');
const { SlashCommandBuilder, EmbedBuilder, Client, Message, GuildMember, PermissionFlagsBits, SlashCommandSubcommandBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const moongose = require('mongoose');
const fetchElo = require('../../functions/pug/fetchElo');
const pugone = require('../../schemas/pugone');




module.exports = {
    data: new SlashCommandBuilder()
        .setName('startpug')
        .setDescription('Start a pug!!')
        .addUserOption(option =>
            option
                .setName('runner')
                .setDescription('Select the pug runner:')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),


    async execute(interaction, client) {


        await pugone.findOneAndUpdate(
            { pugId: '1' },
            {
                redPlayers: [''],
                bluePlayers: ['']

            }

        );


        let channelParticipants = []
        const array = [];


        client.channels.cache.filter((c) => c.name === 'Add up').forEach(channel => {
            channel.fetch().then(async (channel) => {
                console.log(channel.name);
                for (let [snowflake, guildMember] of channel.members) {

                    array.push(guildMember.id)

                    console.log(guildMember.id, 'teste')

                }
                const storedElo = await Player.find({ discordId: array })



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

                let result = []
                // the values are sent randomized so we can scramble teams.
                while (storedElo.length) {
                    const index = Math.floor(Math.random() * storedElo.length);
                    result.push(storedElo.splice(index, 1)[0]);

                }
                let arrayID = []
                let nextGamePlayers = []
                let throwInNextGame = []
                client.channels.cache.filter((c) => c.name === 'Next game').forEach(channel => {
                    channel.fetch().then(async (channel) => {
                        console.log(channel.name);
                        for (let [snowflake, guildMember] of channel.members) {

                            arrayID.push(guildMember.id)
                        }
                        const storedEloNext = await Player.find({ discordId: arrayID })

                        while (storedEloNext.length) {
                            const index = Math.floor(Math.random() * storedEloNext.length);
                            nextGamePlayers.push(storedEloNext.splice(index, 1)[0]);

                        }
                        nextGamePlayers = nextGamePlayers.slice(0, 12)
                        result = [...nextGamePlayers, ...result]
                        throwInNextGame = result.slice(12, 50)

                        for (let i = 0; i < throwInNextGame.length; i++) {
                            let guild = client.guilds.cache.get('1047949204061954078');
                            let playersId = []
                            throwInNextGame.forEach(player => {
                                playersId.push(player.discordId)
                            })
                            let member = guild.members.cache.get(playersId[i]);
                            try {
                                await member.voice.setChannel(`${channel.id}`)
                                console.log('we tried')
                            } catch (error) {
                                console.log(error);
                            }
                        }
                        result = result.slice(0, 12)

                        // sample data
                        let presentPlayers = result
                        console.log(throwInNextGame)
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


                        await interaction.reply({
                            content: `If a player doesnt show up here use /elo on him: 
                    ${channelParticipants}`,
                            components: [button, button2],

                            ephemeral: true,
                        })


                    });
                });

            });
        });




    }
}