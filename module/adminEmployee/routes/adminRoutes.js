const adminRoutes = require('express').Router();
const { jwtVerifyAdmin } = require('../../../helper/authHandler');
const {
    empSignIn,
    addAdminEmployee,
    getEmployeeList,
    deleteEmployee,
    empLogOut,
    empProfile
} = require('../controller/adminEmployeeHandler');

/** **********************************************************************************************************
 *                                             [ Admin Routes ]
 ************************************************************************************************************/

adminRoutes.post('/login', empSignIn);
adminRoutes.post('/addadmin', jwtVerifyAdmin,addAdminEmployee);
adminRoutes.get('/profile', jwtVerifyAdmin, empProfile);
adminRoutes.get('/getemp',jwtVerifyAdmin, getEmployeeList);
adminRoutes.delete('/deleteemp/:empId', deleteEmployee);
adminRoutes.get('/logout', jwtVerifyAdmin, empLogOut);


module.exports = adminRoutes;