const mongoose = require('mongoose');

const contactusModel = mongoose.model(
    'contactus',
    new mongoose.Schema({
        contactusId: { type: mongoose.Types.ObjectId, auto: true },
        fullName: String,
        email: String,
        mobile: String,
        message: String,
        address: String,
        status: {
            type: String,
            enum: ['ACTIVE', 'DEACTIVE', 'DELETE'],
            default: 'ACTIVE',
        },
        createdAt: Number,
        updatedAt: Number,
    }, { timestamps: true })
);

module.exports = { contactusModel };