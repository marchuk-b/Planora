const { Schema, model, Types } = require('mongoose');

const followedEventSchema = new Schema({
    user: { type: Types.ObjectId, ref: 'User', required: true },
    event: { type: Types.ObjectId, ref: 'Event', required: true },
    followedAt: { type: Date, default: Date.now }
});

module.exports = model('FollowedEvent', followedEventSchema);