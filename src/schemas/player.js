const { Schema, model } = require('mongoose')
const playerSchema = new Schema({
    _id: Schema.Types.ObjectId,
    discordId: { type: String, default: null, unique: true },
    lastUsername: { type: String, default: null },
    elo: { type: Number }
});

module.exports = model('Player', playerSchema, 'players');