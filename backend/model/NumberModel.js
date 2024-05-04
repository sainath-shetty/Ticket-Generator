const mongoose = require('mongoose');

const numberSchema = new mongoose.Schema({
    numberPlate: String,
    timeEntered: String,
    entered: {
        type: Boolean,
        default: false
    }

});

module.exports = mongoose.model('User', numberSchema);