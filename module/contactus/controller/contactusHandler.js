const { Types } = require('mongoose');
const { contactusModel } = require('../model/contactusModel');
const { imageSetUp } = require('../../../config/env');
const imageUrl = imageSetUp();

/********************************************************************************************************
 *                                        Contactus API [ AddContactus-GetContactus ]
 ********************************************************************************************************/

const addContactus = async function(req, res) {
    try {
        const { fullName,email,mobile,message,address } = req.body;
        if (!fullName || !email || !mobile || !message  || !address) {
            return res.json({
                meta: { msg: 'Parameters Missing', status: false },
            });
        }
        const addObj = {
            fullName,
            email,
            mobile,
            message,
            address,
        };
        const addCarrer = await contactusModel(addObj).save();
        return res.json({
            meta: { msg: 'Request added successfully.', status: true },
            data: addCarrer,
          
        });
    } catch (error) {
        return res.json({
            meta: { msg: error.message, status: false },
        });
    }
};

const contactusList = async function(req, res) {
    try {
        const contactusData = await contactusModel.find({ status: { $ne: 'DELETE' } });
        if (contactusData.length) {
            return res.json({
                meta: { msg: 'Request found successfully.', status: true },
                data: contactusData,
            });
        } else {
            return res.json({
                meta: { msg: 'Request not found.', status: false },
            });
        }
    } catch (error) {
        return res.json({
            meta: { msg: error.message, status: false },
        });
    }
};



const changeStatus = async(req, res) => {
    try {
        const { contactusId, status } = req.body;
        if (!contactusId) {
            return res.json({
                meta: { msg: 'Parameter missing.', status: false },
            });
        }
        const orderStatus = {
            ...(status.toLowerCase() === 'active') && { status: 'ACTIVE' },
            ...(status.toLowerCase() === 'deactive') && { status: 'DEACTIVE' },
            ...(status.toLowerCase() === 'delete') && { status: 'DELETE' },
        };
        if (!orderStatus.status) {
            return res.json({
                meta: { msg: 'Invalid status.', status: false },
            });
        }
        const findQuery = {
            contactusId: Types.ObjectId(contactusId),
        };
        const update = await contactusModel.updateOne(findQuery, {
            $set: {
                status: orderStatus.status,
            },
        });
        if (update.nModified > 0 && update.n > 0) {
            return res.json({
                meta: {
                    msg: `Request ${status.toLowerCase()} successfully.`,
                    status: true,
                },
            });
        } else {
            return res.json({
                meta: { msg: 'Something went wrong', status: false },
            });
        }
    } catch (error) {
        return res.json({
            meta: { msg: error.message, status: false },
        });
    }
};
const contactusDetails = async function(req, res) {
    try {
        const { contactusId } = req.params;
        if (!contactusId) {
            return res.json({
                meta: { msg: 'Parameters Missing', status: false },
            });
        }
        let findQuery = {
            status: { $ne: 'DELETE' },
            contactusId: Types.ObjectId(contactusId),
        };
        const contactusData = await contactusModel.findOne(findQuery);
        if (contactusData) {
            return res.json({
                meta: { msg: 'Request details found successfully.', status: true },
                data: contactusData,
            });
        } else {
            return res.json({
                meta: { msg: 'Request not found.', status: false },
            });
        }
    } catch (error) {
        return res.json({
            meta: { msg: error.message, status: false },
        });
    }
};

module.exports = {
    addContactus,
    contactusList,
    changeStatus,
    contactusDetails,
};