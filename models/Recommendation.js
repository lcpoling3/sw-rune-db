var mongoose = require('mongoose');

var recSchema = new mongoose.Schema({
    monster: {
        type: String,
        required: true
    },
    sets: {
        type: [String],
        required: true
    },
    stats: {
    	type: [String],
    	required: true
    },
    rating: {
    	type: Number,
    	min: 1,
    	max: 100
    },
    description: String
});

var Rec = mongoose.model('Rec', recSchema);

module.exports = Rec;
