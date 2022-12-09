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

        const storedPlayers = await pugone.find({ pugId: '1' })

        for (let i = 0; i < storedPlayers.length; i++) {


            let guild = client.guilds.cache.get('1047949204061954078');
            storedPlayers.forEach(async (team) => {
                try {
                    let blueMember = guild.members.cache.get(team.bluePlayers[i]);
                    let redMember = guild.members.cache.get(team.redPlayers[i]);

                    await blueMember.voice.setChannel(`1048334415970975795`)
                    await redMember.voice.setChannel(`1048325545101897739`)


                } catch (error) {
                    console.log(error);
                }
            })
        }




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