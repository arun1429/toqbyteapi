const mongoose = require('mongoose');

const carrerModel = mongoose.model(
    'carrer',
    new mongoose.Schema({
        carrerId: { type: mongoose.Types.ObjectId, auto: true },
        carrerAttachment: { type: String },
        fullName: String,
        email: String,
        mobile: String,
        message: String,
        status: {
            type: String,
            enum: ['ACTIVE', 'DEACTIVE', 'DELETE'],
            default: 'ACTIVE',
        },
        createdAt: Number,
        updatedAt: Number,
    }, { timestamps: true })
);

module.exports = { carrerModel };