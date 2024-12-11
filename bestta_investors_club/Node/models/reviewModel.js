const mongoose = require('mongoose')

let dataSchema = new mongoose.Schema(
    {
        comment: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['approved', 'rejected'],
            default: 'approved',
        },
        uid: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        orderId: {
            type: mongoose.Types.ObjectId,
            ref: 'Order',
            required: true,
        },
        productId: {
            type: mongoose.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

const ReviewModel = mongoose.model('Review', dataSchema)
module.exports = ReviewModel
