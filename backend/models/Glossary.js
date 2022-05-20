const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
        term: {
            type: String,
            required: true,
        },
        definition: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

module.exports = User = mongoose.model('glossaries', UserSchema);
