const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema(
    {
        uid: {
            type: mongoose.Types.ObjectId,
            ref: 'users',
            required: true,
        },
        plan_id: {
            type: mongoose.Types.ObjectId,
            ref: 'plan',
            required: true,
        },
        draw_id: {
            type: mongoose.Types.ObjectId,
            ref: 'draw',
        },
        client_secret: {
            type: String,
            required: true,
        },
        subcription_id: {
            type: String,
            required: true,
        },
        invoice_id: {
            type: String,
            required: true,
        },
        entries: {
            type: Number,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        description: {
            type: String,
            default: 'subscription',
        },
        status: {
            type: String,
            enum: ['pending', 'active', 'cancel', 'update','resume'],
            default: 'pending',
            required: true,
        },
        updatesThisMonth: {
            type: Number,
            default: 0,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

const subcriptionModel = mongoose.model('subcription', dataSchema)
module.exports = subcriptionModel
