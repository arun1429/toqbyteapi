const mongoose = require("mongoose")

const contactInfoModel = mongoose.model('contact-info',
    new mongoose.Schema({
        contactUsId: { type: mongoose.Types.ObjectId, auto: true },
        address: String,
        phoneNumber: String,
        mobileNumber: String,
        email: String,

        createdAt: Number,
        updatedAt: Number
    }, { timestamps: true }))

module.exports = { contactInfoModel }