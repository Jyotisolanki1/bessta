const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema(
    {
        status: {
            type: String,
            enum: ['enable', 'disable'],
            default: 'enable',
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

const storeStatusModel = mongoose.model('storeStatus', dataSchema)
module.exports = storeStatusModel
