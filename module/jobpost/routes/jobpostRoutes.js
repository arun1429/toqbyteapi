const jobpostRoutes = require('express').Router();
const { jwtVerifyAdmin } = require('../../../helper/authHandler');
const {
    addJobpost,
    updateJobpost,
    jobpostList,
    changeStatus,
    jobpostDetails
} = require('../controller/jobpostHandler');

jobpostRoutes.post('/add',jwtVerifyAdmin, addJobpost);
jobpostRoutes.post('/update',jwtVerifyAdmin, updateJobpost);
jobpostRoutes.get('/list',jobpostList);
jobpostRoutes.put('/status', jwtVerifyAdmin, changeStatus);
jobpostRoutes.get('/details/:jobpostId', jobpostDetails);
module.exports = jobpostRoutes;