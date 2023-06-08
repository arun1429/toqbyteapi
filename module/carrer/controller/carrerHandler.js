const { Types } = require('mongoose');
const { carrerModel } = require('../model/carrerModel');
const { imageSetUp } = require('../../../config/env');
const imageUrl = imageSetUp();

/********************************************************************************************************
 *                                        Carrer API [ AddCarrer-GetCarrer ]
 ********************************************************************************************************/

const addCarrer = async function(req, res) {
    try {
        const { fullName,email,mobile,message } = req.body;
        if (!fullName || !email || !mobile || !message) {
            return res.json({
                meta: { msg: 'Parameters Missing', status: false },
            });
        }
        const addObj = {
            fullName,
            email,
            mobile,
            message,
            ...(req.file) && { carrerAttachment: req.file.location },
        };
        const addCarrer = await carrerModel(addObj).save();
        return res.json({
            meta: { msg: 'Carrer added successfully.', status: true },
            data: addCarrer,
          
        });
    } catch (error) {
        return res.json({
            meta: { msg: error.message, status: false },
        });
    }
};

const carrerList = async function(req, res) {
    try {
        const carrerData = await carrerModel.find({ status: { $ne: 'DELETE' } });
        if (carrerData.length) {
            return res.json({
                meta: { msg: 'Carrer found successfully.', status: true },
                data: carrerData,
            });
        } else {
            return res.json({
                meta: { msg: 'Carrer not found.', status: false },
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
        const { carrerId, status } = req.body;
        if (!carrerId) {
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
            carrerId: Types.ObjectId(carrerId),
        };
        const update = await carrerModel.updateOne(findQuery, {
            $set: {
                status: orderStatus.status,
            },
        });
        if (update.nModified > 0 && update.n > 0) {
            return res.json({
                meta: {
                    msg: `Carrer ${status.toLowerCase()} successfully.`,
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
const careerDetails = async function(req, res) {
    try {
        const { carrerId } = req.params;
        if (!carrerId) {
            return res.json({
                meta: { msg: 'Parameters Missing', status: false },
            });
        }
        let findQuery = {
            status: { $ne: 'DELETE' },
            carrerId: Types.ObjectId(carrerId),
        };
        const careerData = await carrerModel.findOne(findQuery);
        if (careerData) {
            return res.json({
                meta: { msg: 'Product details found successfully.', status: true },
                data: careerData,
            });
        } else {
            return res.json({
                meta: { msg: 'Product not found.', status: false },
            });
        }
    } catch (error) {
        return res.json({
            meta: { msg: error.message, status: false },
        });
    }
};
module.exports = {
    addCarrer,
    carrerList,
    changeStatus,
    careerDetails,
};