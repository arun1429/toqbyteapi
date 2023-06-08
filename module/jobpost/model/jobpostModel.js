const mongoose = require('mongoose');

const jobpostModel = mongoose.model(
    'jobpost',
    new mongoose.Schema({
        jobpostId: { type: mongoose.Types.ObjectId, auto: true },
        title: String,
        location: String,
        department: String,
        decription: String,
        keyskils: String,
        desiredCandidate: String,
        status: {
            type: String,
            enum: ['ACTIVE', 'DEACTIVE', 'DELETE'],
            default: 'ACTIVE',
        },
        createdAt: Number,
        updatedAt: Number,
    }, { timestamps: true })
);

module.exports = { jobpostModel };