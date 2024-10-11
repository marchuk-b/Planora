const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    owner: {type: Types.ObjectId, ref: 'User'},
    name: {type: String},
    place: {type: String},
    date: {type: Number},
    description: {type: String},
    numberOfPeople: {type: Number}
})

module.exports = model('Event', schema)