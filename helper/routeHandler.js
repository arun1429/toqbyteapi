const { Router } = require('express');
const baseRouter = Router();
const basePath = '/api/admin';
const {
    employee,
     carrer,
     requestsubmit,
     portfolio,
    contactUs,
    testimonial,
    jobpost,
    blog,
   
} = require('../config/baseUrl');

const adminRoutes = require('../module/adminEmployee/routes/adminRoutes');
const carrerRoutes = require('../module/carrer/routes/carrerRoutes');
const requestsubmitRoutes = require('../module/contactus/routes/contactusRoutes');
const portfolioRoutes = require('../module/portfolio/routes/portfolioRoutes');
const contactInfoRoutes = require('../module/contact-info/routes/contactInfoRoutes');
const blogRoutes = require('../module/blog/routes/blogRoutes');
const testimonialRoutes = require('../module/testimonial/routes/testimonialRoutes');
const jobpostRoutes = require('../module/jobpost/routes/jobpostRoutes');

baseRouter.use(employee, adminRoutes);
baseRouter.use(carrer, carrerRoutes);
baseRouter.use(requestsubmit, requestsubmitRoutes);
baseRouter.use(portfolio, portfolioRoutes);
baseRouter.use(contactUs, contactInfoRoutes);
baseRouter.use(blog, blogRoutes);
baseRouter.use(testimonial, testimonialRoutes);
baseRouter.use(jobpost, jobpostRoutes);


module.exports = { baseRouter, basePath };