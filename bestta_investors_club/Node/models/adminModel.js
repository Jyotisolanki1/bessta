const mongoose = require('mongoose')

let adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: '',
        },
        email: {
            type: String,
        },
        mobile: {
            type: String,
        },
        user_type: {
            type: String,
            default: 'subadmin',
        },
        gender: {
            type: String, // 0- male, 1- female
        },
        password: {
            type: String,
        },
        status: {
            type: String,
            default: '1', // 0 - inactive, 1- active
        },
        profile_pic: {
            type: String,
            default: '0',
        },
    },
    { timestamps: true, versionKey: false }
)

module.exports = mongoose.model('admins', adminSchema)
