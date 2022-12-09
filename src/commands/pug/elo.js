const Player = require('../../schemas/player');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moongose = require('mongoose');
const player = require('../../schemas/player')
const { Types } = require('mongoose')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('elo')
        .setDescription('Returns the elo of the player you mentioned')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The elo of this user is:')
                .setRequired(true)
        ),


    async execute(interaction, client) {

        const selectedUser = interaction.options.getUser('target');
        let storedElo = await client.getElo(selectedUser.id);

        if (!storedElo) {
            console.log(selectedUser)
            let newPlayer = await new player({
                _id: Types.ObjectId(),
                discordId: selectedUser.id,
                lastUsername: selectedUser.username,
                elo: 1
            })

            await newPlayer.save().then(async Elo => {
                console.log(`[Elo Created]: UserID: ${Elo.discordId}`)
            })
                .catch(console.error)



            const embed = new EmbedBuilder()
                .setTitle(`${selectedUser.username}'s elo: `)
                .setTimestamp()
                .setFields([
                    {
                        name: `Elo: 1 (Created now)`,
                        value: '\u200b'
                    }
                ])
                .setFooter({
                    text: client.user.tag,
                    iconURL: client.user.displayAvatarURL(),
                })

            return await interaction.reply({
                embeds: [embed],

            })
        }

        else {
            const embed = new EmbedBuilder()
                .setTitle(`${selectedUser.username}'s elo: `)
                .setTimestamp()
                .setFields([
                    {
                        name: `Elo: ${storedElo.elo}`,
                        value: '\u200b'
                    }
                ])
                .setFooter({
                    text: client.user.tag,
                    iconURL: client.user.displayAvatarURL(),
                })

            await interaction.reply({
                embeds: [embed],

            })

        }
    }
}