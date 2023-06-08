const mongoose = require("mongoose")
const { contactInfoModel } = require("../model/contactInfoModel")

const addContactInfo = async function(req, res) {
    try {
        const {
            address,
            phoneNumber,
            mobileNumber,
            email,
        } = req.body;
        if (!address ||
            !phoneNumber ||
            !mobileNumber ||
            !email) {
            return res.json({
                meta: { msg: "Parameter missing.", status: false }
            })
        }
        const addObj = {
            address,
            phoneNumber,
            mobileNumber,
            email,
        }
        const findContactUs = await contactInfoModel.find();
        if (findContactUs.length) {
            const findQuery = {
                contactUsId: findContactUs[0].contactUsId
            }
            const updateContactUs = await contactInfoModel.findOneAndUpdate(findQuery, { $set: addObj }, { new: true })
            if (updateContactUs) {
                return res.json({
                    meta: { msg: 'Contact info updated successsfully', status: true },
                    data: updateContactUs
                })
            } else {
                return res.json({
                    meta: { msg: 'Something went wrong.', status: false }
                })
            }
        } else {
            const addData = await contactInfoModel(addObj).save()
            return res.json({
                meta: { msg: 'Contact info added successsfully', status: true },
                data: addData
            })
        }
    } catch (error) {
        return res.json({
            meta: { msg: error.message, status: false }
        })
    }
}

const contactInfoDetails = async function(req, res) {
    try {
        const contactUsData = await contactInfoModel.find({});
        if (contactUsData.length) {
            return res.json({
                meta: { msg: 'Contact info details found Successfully.', status: true },
                data: contactUsData[0],
            });
        } else {
            return res.json({
                meta: { msg: 'Contact Info details not found.', status: false },
            });
        }
    } catch (error) {
        return res.json({
            meta: { msg: error.message, status: false },
        });
    }
};

module.exports = {
    addContactInfo,
    contactInfoDetails
}