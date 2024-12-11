const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            default: 'Guest',
        },
        lastname: {
            type: String,
            default: '',
        },
        bussiness_name: {
            type: String,
            default: '',
        },
        bussiness_url: {
            type: String,
            default: '',
        },
        email: {
            type: String,
            default: '',
        },
        phone: {
            type: String,
            default: '',
        },
        password: {
            type: String,
        },
        abn: {
            type: String,
            default: '',
        },
        image: {
            type: String,
            default: '',
        },
        address: {
            type: String,
            default: '',
        },
        city: {
            type: String,
            default: '',
        },
        state: {
            type: String,
            default: '',
        },
        country: {
            type: String,
            default: '',
        },
        zip_code: {
            type: String,
            default: '',
        },
        stripeCustomerId: {
            type: String,
            default: '',
        },
        category: {
            type: mongoose.Types.ObjectId,
            ref: 'businessCategory',
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'active', 'inactive'],
            default: 'pending',
            required: true,
        },
         uid: {
            type: mongoose.Types.ObjectId,
            ref: 'users',
        },
        webPartner : {
            type: String,
            default: "false",
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

const partnerModel = mongoose.model('partner', dataSchema)
module.exports = partnerModel
