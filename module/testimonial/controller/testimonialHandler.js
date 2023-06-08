const { Types } = require('mongoose');
const { testimonialModel } = require('../model/testimonialModel');

/********************************************************************************************************
 *                                        testimonialModel API [ Addtestimonial-Gettestimonial ]
 ********************************************************************************************************/

const addTestimonial = async function(req, res) {
    try {
        const { name,desc,country } = req.body;
        if (!name || !desc  || !country) {
            return res.json({
                meta: { msg: 'Parameters Missing', status: false },
            });
        }
        const addObj = {
            name,
            desc,
            country
        };
        const addTestimonial = await testimonialModel(addObj).save();
        return res.json({
            meta: { msg: 'Testimonial added successfully.', status: true },
            data: addTestimonial,
          
        });
    } catch (error) {
        return res.json({
            meta: { msg: error.message, status: false },
        });
    }
};
const updateTestimonial = async function(req, res) {
    try {
        const { name,desc,country, testimonialId} = req.body;
        if (!name || !desc || !country || !testimonialId ) {
            return res.json({
                meta: { msg: 'Parameters Missing', status: false },
            });
        }
        const findQuery = {
            testimonialId: Types.ObjectId(testimonialId),
        };
        const updateQuery = {
            name,
            desc,
            country
        };
        const updateTestimonial = await testimonialModel.updateOne(findQuery, {
            $set: updateQuery,
        });
        return res.json({
            meta: { msg: 'Testimonial updated successfully.', status: true },
            data: updateTestimonial,
          
        });
    } catch (error) {
        return res.json({
            meta: { msg: error.message, status: false },
        });
    }
};
const testimonialList = async function(req, res) {
    try {
        const testimonialData = await testimonialModel.find({ status: { $ne: 'DELETE' } });
        if (testimonialData.length) {
            return res.json({
                meta: { msg: 'Testimonial found successfully.', status: true },
                data: testimonialData,
            });
        } else {
            return res.json({
                meta: { msg: 'Testimonial not found.', status: false },
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
        const { testimonialId, status } = req.body;
        if (!testimonialId) {
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
            testimonialId: Types.ObjectId(testimonialId),
        };
        const update = await testimonialModel.updateOne(findQuery, {
            $set: {
                status: orderStatus.status,
            },
        });
        if (update.nModified > 0 && update.n > 0) {
            return res.json({
                meta: {
                    msg: `Testimonial ${status.toLowerCase()} successfully.`,
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
const testimonialDetails = async function(req, res) {
    try {
        const { testimonialId } = req.params;
        if (!testimonialId) {
            return res.json({
                meta: { msg: 'Parameters Missing', status: false },
            });
        }
        let findQuery = {
            status: { $ne: 'DELETE' },
            testimonialId: Types.ObjectId(testimonialId),
        };
        const testimonialData = await testimonialModel.findOne(findQuery);
        if (testimonialData) {
            return res.json({
                meta: { msg: 'Testimonial details found successfully.', status: true },
                data: testimonialData,
            });
        } else {
            return res.json({
                meta: { msg: 'Testimonial not found.', status: false },
            });
        }
    } catch (error) {
        return res.json({
            meta: { msg: error.message, status: false },
        });
    }
};
module.exports = {
    addTestimonial,
    updateTestimonial,
    testimonialList,
    changeStatus,
    testimonialDetails,
};