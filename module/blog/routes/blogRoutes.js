const blogRoutes = require('express').Router();
const { jwtVerifyAdmin } = require('../../../helper/authHandler');
const { uploadImagesS3 } = require('../../../helper/comFunction');
const {
    addBlog,
    blogList,
    blogWebList,
    blogDetails,
    updateBlog,
    changeStatus,
} = require('../controller/blogHandler');

blogRoutes.post('/add', jwtVerifyAdmin, uploadImagesS3.single('blogImg'), addBlog);
blogRoutes.get('/listweb', blogWebList);
blogRoutes.get('/list', jwtVerifyAdmin, blogList);
blogRoutes.get('/details/:blogId', blogDetails);
blogRoutes.put('/update', jwtVerifyAdmin,uploadImagesS3.single('blogImg'), updateBlog);
blogRoutes.put('/status', jwtVerifyAdmin, changeStatus);

module.exports = blogRoutes;