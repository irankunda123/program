const mongoose = require("mongoose");

const newEvent = mongoose.Schema({
    eventName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        data: Buffer,
        content_Type: String
    },
    picture: {
        type: String
    }
});

const Event = mongoose.model('event', newEvent);

module.exports = Event;