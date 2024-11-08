const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    owner: {type: Types.ObjectId, ref: 'User'},
    name: {type: String, required: true},
    place: {type: String, required: true},
    date: {type: Date, required: true},
    time: {type: String, required: true},
    category: {type: String, required: true},
    description: {type: String},
    follows: [{type: Types.ObjectId, ref: 'User'}],
    willBePresent: {type: Boolean, default: false}
})

module.exports = model('Event', schema)