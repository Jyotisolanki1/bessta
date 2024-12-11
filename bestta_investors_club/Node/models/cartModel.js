const mongoose = require('mongoose')

const productLineItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Types.ObjectId,
            ref: 'products',
            required: true,
        },
        variation: {
            type: mongoose.Types.ObjectId,
            default: null,
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        attributes: {
            type: [
                {
                    label: {
                        type: String,
                    },
                    value: {
                        type: String,
                    },
                },
            ],
        },
    },
    {
        versionKey: false,
        _id: false,
    }
)

const cartSchema = new mongoose.Schema(
    {
        cartItems: {
            type: [productLineItemSchema],
            required: true,
        },
        totalCartPrice: {
            type: Number,
            required: true,
        },
        totalPriceAfterDiscount: {
            type: Number,
        },
        coupons: {
            type: String,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Cart', cartSchema)
