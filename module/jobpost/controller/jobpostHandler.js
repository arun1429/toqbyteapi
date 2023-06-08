const { Types } = require('mongoose');
const { jobpostModel } = require('../model/jobpostModel');

/********************************************************************************************************
 *                                        jobpostModel API [ Addtestimonial-Gettestimonial ]
 ********************************************************************************************************/

const addJobpost = async function(req, res) {
    try {
        const { title,location,department , decription,keyskils,desiredCandidate } = req.body;
        if (!title || !location  || !department || !decription || !keyskils  || !desiredCandidate) {
            return res.json({
                meta: { msg: 'Parameters Missing', status: false },
            });
        }
        const addObj = {
            title,
            location,
            department,
            decription,
            keyskils,
            desiredCandidate
        };
        const addTestimonial = await jobpostModel(addObj).save();
        return res.json({
            meta: { msg: 'Jobpost added successfully.', status: true },
            data: addTestimonial,
          
        });
    } catch (error) {
        return res.json({
            meta: { msg: error.message, status: false },
        });
    }
};
const updateJobpost = async function(req, res) {
    try {
        const { title,location,department, decription,keyskils,desiredCandidate , jobpostId} = req.body;
        if (!title || !location || !department  || !decription || !keyskils || !desiredCandidate || !jobpostId ) {
            return res.json({
                meta: { msg: 'Parameters Missing', status: false },
            });
        }
        const findQuery = {
            jobpostId: Types.ObjectId(jobpostId),
        };
        const updateQuery = {
            title,
            location,
            department,
            decription,
            keyskils,
            desiredCandidate
        };
        const updateTestimonial = await jobpostModel.updateOne(findQuery, {
            $set: updateQuery,
        });
        return res.json({
            meta: { msg: 'Jobpost updated successfully.', status: true },
            data: updateTestimonial,
          
        });
    } catch (error) {
        return res.json({
            meta: { msg: error.message, status: false },
        });
    }
};
const jobpostList = async function(req, res) {
    try {
        const jobpostData = await jobpostModel.find({ status: { $ne: 'DELETE' } });
        if (jobpostData.length) {
            return res.json({
                meta: { msg: 'Jobpost found successfully.', status: true },
                data: jobpostData,
            });
        } else {
            return res.json({
                meta: { msg: 'Jobpost not found.', status: false },
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
        const { jobpostId, status } = req.body;
        if (!jobpostId) {
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
            jobpostId: Types.ObjectId(jobpostId),
        };
        const update = await jobpostModel.updateOne(findQuery, {
            $set: {
                status: orderStatus.status,
            },
        });
        if (update.nModified > 0 && update.n > 0) {
            return res.json({
                meta: {
                    msg: `jobpost ${status.toLowerCase()} successfully.`,
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
const jobpostDetails = async function(req, res) {
    try {
        const { jobpostId } = req.params;
        if (!jobpostId) {
            return res.json({
                meta: { msg: 'Parameters Missing', status: false },
            });
        }
        let findQuery = {
            status: { $ne: 'DELETE' },
            jobpostId: Types.ObjectId(jobpostId),
        };
        const jobpostData = await jobpostModel.findOne(findQuery);
        if (jobpostData) {
            return res.json({
                meta: { msg: 'Jobpost details found successfully.', status: true },
                data: jobpostData,
            });
        } else {
            return res.json({
                meta: { msg: 'Jobpost not found.', status: false },
            });
        }
    } catch (error) {
        return res.json({
            meta: { msg: error.message, status: false },
        });
    }
};
module.exports = {
    addJobpost,
    updateJobpost,
    jobpostList,
    changeStatus,
    jobpostDetails,
};