const contactusRoutes = require('express').Router();
const { jwtVerifyAdmin } = require('../../../helper/authHandler');
const { uploadImagesS3 } = require('../../../helper/comFunction');
const {
    addContactus,
    contactusList,
    changeStatus,
    contactusDetails,
    
} = require('../controller/contactusHandler');

contactusRoutes.post('/add', uploadImagesS3.single('contactusAttachment'), addContactus);
contactusRoutes.get('/list', jwtVerifyAdmin,contactusList);
contactusRoutes.put('/status', jwtVerifyAdmin, changeStatus);
contactusRoutes.get('/details/:contactusId', jwtVerifyAdmin, contactusDetails);
module.exports = contactusRoutes;