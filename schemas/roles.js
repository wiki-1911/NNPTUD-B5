let mongoose = require('mongoose');

let roleSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "name khong duoc rong"],
        unique: true
    },
    description: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

module.exports = new mongoose.model('role', roleSchema);