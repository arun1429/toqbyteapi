const carrerRoutes = require('express').Router();
const { jwtVerifyAdmin } = require('../../../helper/authHandler');
const { uploadImagesS3 } = require('../../../helper/comFunction');
const {
    addCarrer,
    carrerList,
    changeStatus,
    careerDetails
} = require('../controller/carrerHandler');

carrerRoutes.post('/add', uploadImagesS3.single('carrerAttachment'), addCarrer);
carrerRoutes.get('/list', jwtVerifyAdmin,carrerList);
carrerRoutes.put('/status', jwtVerifyAdmin, changeStatus);
carrerRoutes.get('/details/:carrerId', jwtVerifyAdmin, careerDetails);
module.exports = carrerRoutes;