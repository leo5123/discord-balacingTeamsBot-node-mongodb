const Player = require('../../schemas/player');
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { Types } = require('mongoose');



module.exports = {
    data: new SlashCommandBuilder()
        .setName('editelo')
        .setDescription('Edits a players elo')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The member you\'d like to edit')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('elo')
                .setDescription('The new elo you\'d like to provide for this player')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),


    async execute(interaction, client) {
        const user = interaction.options.getUser('target')
        const elo = interaction.options.getString('elo')

        const storedElo = await Player.findOne({ discordId: user.id })

        if (elo > 10) {
            return interaction.reply({
                content: 'The elo must be lower then 10',
                ephemeral: true
            })
        }

        if (!storedElo) {
            storedElo = await new Player({
                _id: Types.ObjectId(),
                discordId: user.id,
                elo: 1
            })

            return await storedElo.save().then(async Elo => {
                console.log(`[Elo Created]: UserID: ${Elo.discordId}`)
            })
                .catch(console.error)

        }


        await Player.findOneAndUpdate(
            { discordId: user.id },
            {
                elo: elo
            })

        const embed = new EmbedBuilder()
            .setTitle(`${user.username}'s updated elo: `)
            .setTimestamp()
            .setFields([
                {
                    name: elo,
                    value: '\u200b'
                }
            ])
            .setFooter({
                text: client.user.tag,
                iconURL: client.user.displayAvatarURL(),
            })

        return await interaction.reply({
            embeds: [embed],
            ephemeral: true,
        })








    }
}