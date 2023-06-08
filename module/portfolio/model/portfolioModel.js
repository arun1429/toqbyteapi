const mongoose = require('mongoose');

const portfolioModel = mongoose.model(
    'portfolio',
    new mongoose.Schema({
        portfolioId: { type: mongoose.Types.ObjectId, auto: true },
        name: String,
        details : String,
        portfolioImg: { type: String },
        projectType: {
            type: String,
            enum: ['WEBSITE', 'APP'],
            default: 'WEBSITE',
        },
        status: {
            type: String,
            enum: ['ACTIVE', 'DEACTIVE', 'DELETE'],
            default: 'ACTIVE',
        },
        createdAt: Number,
        updatedAt: Number,
    }, { timestamps: true })
);

module.exports = { portfolioModel };