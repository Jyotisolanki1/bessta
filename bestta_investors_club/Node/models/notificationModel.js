const mongoose = require('mongoose')
let dataSchema = new mongoose.Schema(
    {
        uid: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        data: {},
        type: {
            type: String,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

const notificationModel = mongoose.model('notification', dataSchema)

module.exports = notificationModel
