const Player = require('../../schemas/player');
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { Types } = require('mongoose');



module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('A list of all commands!')

    ,


    async execute(interaction, client) {

        interaction.reply({
            content: `
              Admin commands: 
                /editelo: Edit a players elo
                /startpug: Balance teams and start a pug

            Players commands: 
                /elo: Show's a players elo
        
                        `,
            ephemeral: true
        })





    }
}