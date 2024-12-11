const mongoose = require('mongoose')

let dataSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        intervalType: {
            type: String,
            enum: ['fixed', 'day', 'week', 'month', 'year'],
            required: true,
        },
        intervalCount: {
            type: Number,
            required: true,
        },
        entries: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        discription: {
            type: String,
        },
        category: {
            type: mongoose.Types.ObjectId,
            ref: 'planCategory',
            required: true,
        },
        stripePlanId: {
            type: String,
            required: true,
        },
        mostPopuler: {
            type: String,
            default: 'false',
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
        isdeleted: {
            type: String,
            default: 'false',
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

const planModel = mongoose.model('plan', dataSchema)

module.exports = planModel
