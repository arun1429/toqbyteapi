const testimonialRoutes = require('express').Router();
const { jwtVerifyAdmin } = require('../../../helper/authHandler');
const {
    addTestimonial,
    updateTestimonial,
    testimonialList,
    changeStatus,
    testimonialDetails
} = require('../controller/testimonialHandler');

testimonialRoutes.post('/add',jwtVerifyAdmin, addTestimonial);
testimonialRoutes.post('/update',jwtVerifyAdmin, updateTestimonial);
testimonialRoutes.get('/list',testimonialList);
testimonialRoutes.put('/status', jwtVerifyAdmin, changeStatus);
testimonialRoutes.get('/details/:testimonialId', testimonialDetails);
module.exports = testimonialRoutes;