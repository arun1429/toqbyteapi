const jwt = require('jsonwebtoken');
const {
    adminEmployeesModel,
} = require('../module/adminEmployee/model/adminEmployee');
const { config } = require('../config/env');

/**********************************************************************************************************
 *                                              Admin [ x-auth-key ]
 **********************************************************************************************************/

const jwtVerifyAdmin = async(req, res, next) => {
    if (
        req.headers.authkey == 'null' ||
        req.headers.authkey == '' ||
        req.headers.authkey == 'undefined' ||
        req.headers.authkey == null ||
        req.headers.authkey == undefined
    ) {
        return res.status(401).json({
            meta: { msg: 'Unauthorized Access', status: true },
        });
    }
    jwt.verify(req.headers.authkey, config.jwtSecretKey, function(err, decoded) {
        if (err) {
            return res.status(401).json({
                meta: { msg: 'Unauthorized Access', status: false },
            });
        } else {
            adminEmployeesModel.findOne({ empId: decoded.empId }).then((result) => {
                if (result && result.isLogin == false) {
                    return res.status(440).json({
                        meta: { msg: 'Session Expired.', status: false },
                    });
                }
                req.decoded = decoded;
                next();
            });
        }
    });
};

module.exports = { jwtVerifyAdmin };