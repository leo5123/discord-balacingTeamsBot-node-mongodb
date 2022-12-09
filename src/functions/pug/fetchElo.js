const Elo = require('../../schemas/player')
const { Types } = require('mongoose')

module.exports = (client) => {
    client.fetchElo = async (userId) => {
        const storedElo = await new Elo.findOne({ discordId: userId })

        if (!storedElo) {
            storedElo = await new Elo({
                _id: Types.ObjectId(),
                discordId: userId,
                elo: 1500
            })

            await storedElo.save().then(async Elo => {
                console.log(`[Elo Created]: UserID: ${Elo.discordId}`)
            })
                .catch(console.error)
            return storedElo
        } else return storedElo;
    }
}