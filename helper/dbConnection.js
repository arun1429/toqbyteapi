const mongoose = require('mongoose');
const { DbSetUp } = require('../config/env');

const dbConnect = async function() {
    mongoose.set('useCreateIndex', true);
    const mongoUrl = DbSetUp();
    try {
        console.log('Establishing Mongo DB Connection...');
        const x = await mongoose.connect(mongoUrl, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        console.log('Mongo DB Connected :)');
        return false;
    } catch (error) {
        console.log('==== DB Connection Error ====', error.message);
        throw error;
    }
};

module.exports = { dbConnect };