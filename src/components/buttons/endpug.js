const pug = require('../../schemas/pugone')
const Player = require('../../schemas/player')
const { Types } = require('mongoose')
const { SlashCommandBuilder, EmbedBuilder, Client, Message, GuildMember } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const moongose = require('mongoose');
const fetchElo = require('../../functions/pug/fetchElo');
const pugone = require('../../schemas/pugone');
const { find } = require('../../schemas/player');


module.exports = {
    data: {
        name: 'endpug'
    },
    async execute(interaction, client) {

        let guildMemberID = []
        client.channels.cache.filter((c) => c.name === 'red🔴').forEach(channel => {
            channel.fetch().then(async (channel) => {
                console.log(channel.name);
                for (let [snowflake, guildMember] of channel.members) {

                    let guild = client.guilds.cache.get('1047949204061954078');
                    let member = guild.members.cache.get(`${guildMember.id}`);
                    console.log(member)

                    try {


                        await member.voice.setChannel(`1047949221820633201`)


                    } catch (error) {
                        console.log(error);
                    }
                }
            });
        });

        client.channels.cache.filter((c) => c.name === 'blue🔵').forEach(channel => {
            channel.fetch().then(async (channel) => {
                console.log(channel.name);
                for (let [snowflake, guildMember] of channel.members) {
                    let guild = client.guilds.cache.get('1047949204061954078');
                    let member = guild.members.cache.get(`${guildMember.id}`);
                    console.log(member)

                    try {


                        await member.voice.setChannel(`1047949221820633201`)


                    } catch (error) {
                        console.log(error);
                    }

                }
            });
        });

        await pugone.findOneAndUpdate(
            { pugId: '1' },
            {
                redPlayers: [''],
                bluePlayers: ['']

            }

        );

        interaction.reply({
            content: 'The pug has ended, if you want to start another one use /startpug',
            ephemeral: true
        })

    }
}