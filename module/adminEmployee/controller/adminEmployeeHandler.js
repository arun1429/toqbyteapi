const bcrypt = require('bcryptjs');
const { connection, Types } = require('mongoose');
const { adminEmployeesModel } = require('../model/adminEmployee');
const { jwtToken, bcryptfun } = require('../../../helper/comFunction');

/********************************************************************************************************
 *                                      Admin API [ AddAdmin-SignOut ]
 ********************************************************************************************************/

const addAdminEmployee = async function(req, res) {
    try {
        const {
            empName,
            empEmailID,
            empPassword,
            empDepartment,
            empRole,
            gender,
        } = req.body;
        if (!empName || !empEmailID || !empPassword || !empDepartment || !empRole) {
            return res.json({
                meta: { msg: 'Parameter Missing.', status: false },
            });
        }
        const result = await adminEmployeesModel.findOne({ empEmailID });
        if (result) {
            return res.json({
                meta: { msg: 'Email ID is already exist.', status: false },
            });
        }
        const hashPass = await bcryptfun(empPassword);
        let adminObj = {
            empName,
            empEmailID,
            empPassword: hashPass,
            empDepartment,
            empRole,
            gender,
            createdBy: req.headers['empid'],
        };
        const addAdminEmployee = await new adminEmployeesModel(adminObj).save();
        return res.json({
            meta: { msg: 'Employee Created Successfully.', status: true },
            data: addAdminEmployee,
        });
    } catch (error) {
        return res.json({
            meta: { msg: error.message, status: false },
        });
    }
};

const empSignIn = async function(req, res) {
    try {
        const { empEmailID, empPassword } = req.body;
        const admin = await adminEmployeesModel.findOne({ empEmailID });
        if (!admin) {
            throw new Error('Invalid Credential.');
        }
        const verify = await bcrypt.compare(empPassword, admin.empPassword);
        if (!verify) {
            throw new Error('Invalid Credential.');
        }
        const token = await jwtToken({
            empEmailID: admin.empEmailID,
            empId: admin.empId,
            empName: admin.empName,
        });
        const signInData = await adminEmployeesModel.findOneAndUpdate({ empEmailID }, { $set: { isLogin: true } }, { new: true, projection: { password: 0, createdAt: 0, updatedAt: 0 } });
        return res.json({
            meta: { msg: 'Employee SignIn Successfully.', status: true },
            data: signInData,
            token,
        });
    } catch (error) {
        return res.json({
            meta: { msg: error.message, status: false },
        });
    }
};

const getEmployeeList = async function(req, res) {
    try {
        let findQuery = {
            //$and: [{ status: 'ACTIVE' }, { typeOfAdmin: 'SUBADMIN' }],
            $and: [{ status: 'ACTIVE' }],
        };
        if (req.query.empId) {
            findQuery = {
                $and: [
                    { status: 'ACTIVE' },
                    { empId: Types.ObjectId(req.query.empId) },
                ],
            };
        }
        const data = await connection
            .collection('adminEmployees')
            .find(findQuery)
            .project({ empPassword: 0 })
            .toArray();
        let msg = req.query.empId ?
            'Employee Details Found.' :
            'Employees Details Found.';
        return res.json({
            meta: { msg: msg, status: true },
            data: data,
        });
    } catch (error) {
        return res.json({
            meta: { msg: error.message, status: false },
        });
    }
};

const deleteEmployee = async function(req, res) {
    try {
        await adminEmployeesModel.findOneAndUpdate({ empId: Types.ObjectId(req.params.empId) }, { $set: { status: 'DELETE' } });
        return res.json({
            meta: { msg: 'Employee Deleted Successfully.', status: true },
        });
    } catch (error) {
        return res.json({
            meta: { msg: error.message, status: false },
        });
    }
};

const empLogOut = async function(req, res) {
    try {
        await adminEmployeesModel.findOneAndUpdate({ empId: Types.ObjectId(req.decoded.empId) }, { $set: { isLogin: false } });
        return res.json({
            meta: { msg: 'Employee Successfully LogOut.', status: true },
        });
    } catch (error) {
        return res.json({
            meta: { msg: error.message, status: false },
        });
    }
};

const empProfile = async function(req, res) {
    try {
        const profile = await adminEmployeesModel.findOne({ empId: Types.ObjectId(req.decoded.empId) });
        if (profile) {
            return res.json({
                meta: { msg: 'Admin profile found successfully.', status: true },
                data: profile
            });
        } else {
            return res.json({
                meta: { msg: 'Admin profile not found.', status: false },
            });

        }
    } catch (error) {
        return res.json({
            meta: { msg: error.message, status: false },
        });
    }
};

module.exports = {
    addAdminEmployee,
    empSignIn,
    getEmployeeList,
    deleteEmployee,
    empLogOut,
    empProfile
};