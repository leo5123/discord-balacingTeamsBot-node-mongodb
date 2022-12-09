const { Schema, model } = require('mongoose')
const pugSchema = new Schema({
    _id: Schema.Types.ObjectId,
    pugId: { type: String, default: null, unique: true },
    redPlayers: { type: Array, default: null },
    bluePlayers: { type: Array, default: null },

});

module.exports = model('Pugone', pugSchema, 'pugone');