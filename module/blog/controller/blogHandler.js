const { Types } = require('mongoose');
const { blogModel } = require('../model/blogModel');
const { imageSetUp } = require('../../../config/env');
const imageUrl = imageSetUp();

/********************************************************************************************************
 *                                        Blog API [ AddBlog-GetBlog ]
 ********************************************************************************************************/

const addBlog = async function(req, res) {
    try {
        const { title,details,shortDetails } = req.body;
        if (!title || !details || !shortDetails) {
            return res.json({
                meta: { msg: 'Parameters Missing', status: false },
            });
        }
        const addObj = {
            title,
            details,
            shortDetails,
            ...(req.file) && { blogImg: req.file.location },
        };
        const addBlog = await blogModel(addObj).save();
        return res.json({
            meta: { msg: 'Blog added successfully.', status: true },
            data: addBlog,
          
        });
    } catch (error) {
        return res.json({
            meta: { msg: error.message, status: false },
        });
    }
};

const blogList = async function(req, res) {
    try {
        const blogData = await blogModel.find({ status: { $ne: 'DELETE' } });
        if (blogData.length) {
            return res.json({
                meta: { msg: 'Blog found successfully.', status: true },
                data: blogData,
            });
        } else {
            return res.json({
                meta: { msg: 'Blog not found.', status: false },
            });
        }
    } catch (error) {
        return res.json({
            meta: { msg: error.message, status: false },
        });
    }
};
const blogWebList = async function(req, res) {
    try {
        const blogData = await blogModel.find({ status: { $ne: 'DELETE' } }).sort({ _id: -1 }).limit(3);
        if (blogData.length) {
            return res.json({
                meta: { msg: 'Blog found successfully.', status: true },
                data: blogData,
            });
        } else {
            return res.json({
                meta: { msg: 'Blog not found.', status: false },
            });
        }
    } catch (error) {
        return res.json({
            meta: { msg: error.message, status: false },
        });
    }
};
const blogDetails = async function(req, res) {
    try {
        const { blogId } = req.params;
        if (!blogId) {
            return res.json({
                meta: { msg: 'Parameters Missing', status: false },
            });
        }
        let findQuery = {
            status: { $ne: 'DELETE' },
            blogId: Types.ObjectId(blogId),
        };
        const blogData = await blogModel.findOne(findQuery);
        if (blogData) {
            return res.json({
                meta: { msg: 'Blog details found successfully.', status: true },
                data: blogData,
            });
        } else {
            return res.json({
                meta: { msg: 'Blog not found.', status: false },
            });
        }
    } catch (error) {
        return res.json({
            meta: { msg: error.message, status: false },
        });
    }
};

const updateBlog = async function(req, res) {
    try {
        const { blogId, title, details ,shortDetails} = req.body;
        if (!blogId || !title || !details || !shortDetails) {
            return res.json({
                meta: { msg: 'Parameters Missing', status: false },
            });
        }
        const findQuery = {
            blogId: Types.ObjectId(blogId),
        };
        const updateQuery = {
            title,
            shortDetails,
            details,
            ...(req.file) && { blogImg: req.file.location },
        };
        const updateBlog = await  blogModel.updateOne(findQuery, {
            $set: updateQuery,
        });
        if (updateBlog) {
            return res.json({
                meta: { msg: 'Blog updated successfully.', status: true },
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
        const { Id, status } = req.body;
        if (!blogId) {
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
            blogId: Types.ObjectId(blogId),
        };
        const update = await blogModel.updateOne(findQuery, {
            $set: {
                status: orderStatus.status,
            },
        });
        if (update.nModified > 0 && update.n > 0) {
            return res.json({
                meta: {
                    msg: `Blog ${status.toLowerCase()} successfully.`,
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
    addBlog,
    blogList,
    blogWebList,
    blogDetails,
    updateBlog,
    changeStatus,
};