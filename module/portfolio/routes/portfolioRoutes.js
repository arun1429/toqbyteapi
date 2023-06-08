const portfolioRoutes = require('express').Router();
const { jwtVerifyAdmin } = require('../../../helper/authHandler');
const { uploadImagesS3 } = require('../../../helper/comFunction');
const {
    addPorfolio,
    portfolioList,
    updatePortfolio,
    portfolioDetails,
    changeStatus,
    portfolioListWeb
} = require('../controller/portfolioHandler');

portfolioRoutes.post('/add', jwtVerifyAdmin, uploadImagesS3.single('portfolioImg'), addPorfolio);
portfolioRoutes.get('/list', jwtVerifyAdmin, portfolioList);
portfolioRoutes.get('/listweb', portfolioListWeb);
portfolioRoutes.put('/update', jwtVerifyAdmin, uploadImagesS3.single('portfolioImg'), updatePortfolio);
portfolioRoutes.put('/status', jwtVerifyAdmin, changeStatus);
portfolioRoutes.get('/details/:portfolioId', jwtVerifyAdmin, portfolioDetails);
module.exports = portfolioRoutes;