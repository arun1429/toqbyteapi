const { Types } = require('mongoose');
const { portfolioModel } = require('../model/portfolioModel');
/********************************************************************************************************
 *                                        Porfolio API [  ]
 ********************************************************************************************************/

const addPorfolio = async function(req, res) {
    try {
        const { name, details ,projectType} = req.body;
        if (!name || !details  || !projectType) {
            return res.json({
                meta: { msg: 'Parameters Missing', status: false },
            });
        }
        const addObj = {
            name,
            details,
            ...(req.file) && { portfolioImg: req.file.location },
        };
        const addPortfolio = await portfolioModel(addObj).save();
        return res.json({
            meta: { msg: 'Portfolio added successfully.', status: true },
            data: addPortfolio,
          
        });
    } catch (error) {
        return res.json({
            meta: { msg: error.message, status: false },
        });
    }
};

const portfolioList = async function(req, res) {
    try {
        const portfolioData = await portfolioModel.find({ status: { $ne: 'DELETE' } });
        if (portfolioData.length) {
            return res.json({
                meta: { msg: 'Portfolio type found successfully.', status: true },
                data: portfolioData,
            });
        } else {
            return res.json({
                meta: { msg: 'Portfolio type not found.', status: false },
            });
        }
    } catch (error) {
        return res.json({
            meta: { msg: error.message, status: false },
        });
    }
};
const portfolioListWeb = async function(req, res) {
    try {
        const { projecttype } = req.query;
        if (!projecttype) {
            return res.json({
                meta: { msg: 'Parameters Missing', status: false },
            });
        }
        const portfolioData = await portfolioModel.find({ status: { $ne: 'DELETE' } });
        if (portfolioData.length) {
            return res.json({
                meta: { msg: 'Portfolio type found successfully.', status: true },
                data: portfolioData,
            });
        } else {
            return res.json({
                meta: { msg: 'Portfolio type not found.', status: false },
            });
        }
    } catch (error) {
        return res.json({
            meta: { msg: error.message, status: false },
        });
    }
};
const portfolioDetails = async function(req, res) {
    try {
        const { portfolioId } = req.params;
        if (!portfolioId) {
            return res.json({
                meta: { msg: 'Parameters Missing', status: false },
            });
        }
        let findQuery = {
            status: { $ne: 'DELETE' },
            portfolioId: Types.ObjectId(portfolioId),
        };
        const portfolioData = await portfolioModel.findOne(findQuery);
        if (portfolioData) {
            return res.json({
                meta: { msg: 'Portfolio details found successfully.', status: true },
                data: portfolioData,
            });
        } else {
            return res.json({
                meta: { msg: 'Portfolio type not found.', status: false },
            });
        }
    } catch (error) {
        return res.json({
            meta: { msg: error.message, status: false },
        });
    }
};
const updatePortfolio = async function(req, res) {
    try {
        const { portfolioId, name, details } = req.body;
        if (!portfolioId || !name || !details) {
            return res.json({
                meta: { msg: 'Parameters Missing', status: false },
            });
        }
        const findQuery = {
            portfolioId: Types.ObjectId(portfolioId),
        };
        const updateQuery = {
            name,
            details,
            ...(req.file) && { portfolioImg: req.file.location },
        };
        const updatePortfolio = await portfolioModel.updateOne(findQuery, {
            $set: updateQuery,
        });
        if (updatePortfolio) {
            return res.json({
                meta: { msg: 'Portfolio type updated successfully.', status: true },
            });
        } else {
            return res.json({
                meta: { msg: 'Something went wrong.', status: false },
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
        const { portfolioId, status } = req.body;
        if (!portfolioId) {
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
            portfolioId: Types.ObjectId(portfolioId),
        };
        const update = await portfolioModel.updateOne(findQuery, {
            $set: {
                status: orderStatus.status,
            },
        });
        if (update.nModified > 0 && update.n > 0) {
            return res.json({
                meta: {
                    msg: `Portfolio ${status.toLowerCase()} successfully.`,
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

module.exports = {
    addPorfolio,
    portfolioList,
    updatePortfolio,
    changeStatus,
    portfolioDetails,
    portfolioListWeb
};