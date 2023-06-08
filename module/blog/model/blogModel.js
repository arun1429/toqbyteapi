const mongoose = require('mongoose');

const blogModel = mongoose.model(
    'blog',
    new mongoose.Schema({
        blogId: { type: mongoose.Types.ObjectId, auto: true },
        blogImg: { type: String },
        title: String,
        details: String,
        shortDetails: String,
        status: {
            type: String,
            enum: ['ACTIVE', 'DEACTIVE', 'DELETE'],
            default: 'ACTIVE',
        },
        createdAt: Number,
        updatedAt: Number,
    }, { timestamps: true })
);

module.exports = { blogModel };