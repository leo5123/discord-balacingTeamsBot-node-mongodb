const Elo = require('../../schemas/player')


module.exports = (client) => {
    client.getElo = async (userId, guildId) => {
        const storedElo = await Elo.findOne({ discordId: userId })

        if (!storedElo) return false;
        else return storedElo;
    }
}