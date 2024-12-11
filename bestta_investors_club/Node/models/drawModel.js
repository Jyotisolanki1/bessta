const mongoose = require('mongoose')

const prizesSchema = new mongoose.Schema(
    {
        quantity: {
            type: Number,
        },
        reserves: {
            type: Number,
        },
        description: {
            type: String,
        },
    },
    {
        _id: false,
        versionKey: false,
    }
)

let dataSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: '',
        },
        scheduleDate: {
            type: Date,
            required: true,
        },
        prizes: {
            type: [prizesSchema],
        },
        timezone: {
            type: String,
            default: 'Australia/Sydney',
        },
        discription: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
        randomDrawId: {
            type: String,
            default: '',
        },
        randomData: {},
        winner: [],
        reserve: [],
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

const drawModel = mongoose.model('draw', dataSchema)

module.exports = drawModel
