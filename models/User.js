const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    user_events: [{type: Types.ObjectId, ref: 'Event'}],
    followedEvents: [{ type: Types.ObjectId, ref: 'Event' }],
    willBePresent: [{ type: Types.ObjectId, ref: 'Event' }]
})

module.exports = model('User', schema)