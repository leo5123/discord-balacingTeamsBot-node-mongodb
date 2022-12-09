const pug = require('../../schemas/pugone')
const Player = require('../../schemas/player')
const { Types } = require('mongoose')
const { SlashCommandBuilder, EmbedBuilder, Client, Message, GuildMember } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const moongose = require('mongoose');
const fetchElo = require('../../functions/pug/fetchElo');
const pugone = require('../../schemas/pugone');


module.exports = {
    data: {
        name: 'done'
    },
    async execute(interaction, client) {

        // const selectedUser = interaction.options.getMember('target');
        // 
        // console.log(selectedUser)


        let discordId = []
        let redTeam = []
        let blueTeam = []

        client.channels.cache.filter((c) => c.name === 'Add up').forEach(channel => {
            channel.fetch().then(async (channel) => {
                console.log(channel.name);
                for (let [snowflake, guildMember] of channel.members) {
                    console.log(`${guildMember.displayName} (${guildMember.id})`);
                    discordId.push(guildMember.id)
                }
                const storedPug = await pugone.find({ pugId: '1' })
                // db.searchArrayDemo.find({EmployeeDetails:{$elemMatch:{EmployeePerformanceArea : "C++", Year : 1998}}}).pretty()
                client.channels.cache.filter((c) => c.name === 'red🔴').forEach(channel => {
                    channel.fetch().then(async (channel) => {

                        for (let i = 0; i < storedPug.length; i++) {
                            storedPug.forEach(async team => {
                                let guild = client.guilds.cache.get('1047949204061954078');
                                let member = guild.members.cache.get(team.redPlayers[i]);
                                try {

                                    await member.voice.setChannel(`${channel.id}`)
                                } catch (error) {
                                    console.log(error);
                                }







                            })
                        }
                    })
                })

                client.channels.cache.filter((c) => c.name === 'blue🔵').forEach(channel => {
                    channel.fetch().then(async (channel) => {

                        for (let i = 0; i < storedPug.length; i++) {
                            storedPug.forEach(async team => {

                                let guild = client.guilds.cache.get('1047949204061954078');
                                let member = guild.members.cache.get(team.bluePlayers[i]);


                                try {

                                    await member.voice.setChannel(`${channel.id}`)
                                } catch (error) {
                                    console.log(error);
                                }




                            })

                        }

                    })
                })

            });

        });



        const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('endpug')
                    .setLabel('End pug')
                    .setStyle(ButtonStyle.Primary),
            );



        interaction.reply({
            content: 'Pugs started, have fun!',
            components: [button],
            ephemeral: true
        })

    }
}