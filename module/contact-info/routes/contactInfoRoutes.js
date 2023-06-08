const contactInfoRoutes = require("express").Router();
const { jwtVerifyAdmin } = require("../../../helper/authHandler");
const {
    addContactInfo,
    contactInfoDetails
} = require("../controller/contactInfoController");

contactInfoRoutes.post('/add', jwtVerifyAdmin, addContactInfo);
contactInfoRoutes.get('/details', contactInfoDetails);

module.exports = contactInfoRoutes