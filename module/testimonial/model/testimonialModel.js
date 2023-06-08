const mongoose = require('mongoose');

const testimonialModel = mongoose.model(
    'testimonial',
    new mongoose.Schema({
        testimonialId: { type: mongoose.Types.ObjectId, auto: true },
        name: String,
        desc: String,
        country: String,
        status: {
            type: String,
            enum: ['ACTIVE', 'DEACTIVE', 'DELETE'],
            default: 'ACTIVE',
        },
        createdAt: Number,
        updatedAt: Number,
    }, { timestamps: true })
);

module.exports = { testimonialModel };