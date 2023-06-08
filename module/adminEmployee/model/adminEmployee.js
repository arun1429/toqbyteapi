const mongoose = require('mongoose');

const adminEmployeeSchema = new mongoose.Schema({
    empId: { type: mongoose.Schema.Types.ObjectId, auto: true },
    empName: String,
    empEmailID: String,
    empPassword: String,
    departmentId: String,
    empDepartment: String,
    roleId: String,
    empRole: String,
    gender: {
        type: String,
        enum: ['MALE', 'FEMALE', 'OTHER'],
        default: 'MALE',
    },
    profilePic: { type: String },
    isLogin: { type: Boolean, default: false },
    status: {
        type: String,
        enum: ['ACTIVE', 'BLOCK', 'DELETE'],
        default: 'ACTIVE',
    },
    typeOfAdmin: {
        type: String,
        enum: ['SUPERADMIN', 'SUBADMIN'],
        default: 'SUBADMIN',
    },
    createdBy: { type: mongoose.Types.ObjectId },
    createdAt: Number,
    updatedAt: Number,
}, { timestamps: true });

const adminEmployeesModel = mongoose.model(
    'adminEmployee',
    adminEmployeeSchema,
    'adminEmployees'
);

module.exports = { adminEmployeesModel };