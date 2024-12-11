const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
        },
        value: {
            type: Number,
            minLength: 0,
            required: true,
        },
        discountType: {
            type: String,
            enum: ['fixed', 'percentage'],
            default: 'fixed',
            required: true,
        },
        description: {
            type: String,
        },
        expirDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'blocked'],
            default: 'active',
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

const CouponsModel = mongoose.model('coupon', dataSchema)
module.exports = CouponsModel
