const mongoose = require('mongoose')

const AddressSchema = new mongoose.Schema(
    {
        streetAddress: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        zipCode: {
            type: Number,
            required: true,
        },
    },
    {
        _id: false,
        versionKey: false,
    }
)

const orderActivitySchema = new mongoose.Schema(
    {
        time: {
            type: Date,
            required: true,
        },
        activity: {
            type: String,
            required: true,
        },
        actionBy: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
    },
    {
        versionKey: false,
    }
)

const OrderLineItemSchema = new mongoose.Schema(
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

const dataSchema = new mongoose.Schema(
    {
        uid: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        cart_id: { type: mongoose.Types.ObjectId, required: true },
        lineItems: {
            type: [OrderLineItemSchema],
            required: true,
        },
        billingAddress: {
            type: AddressSchema,
            required: true,
        },
        shippingAddress: {
            type: AddressSchema,
            required: true,
        },
        subTotal: {
            type: Number,
            required: true,
        },
        shippingCost: {
            type: Number,
            required: true,
        },
        total: {
            type: Number,
            required: true,
        },
        paymentIntent: {},
        status: {
            type: String,
            enum: [
                'pending',
                'hold',
                'paid',
                'shipped',
                'delivered',
                'cancelled',
            ],
            default: 'pending',
            required: true,
        },
        activities: {
            type: [orderActivitySchema],
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

const OrderModel = mongoose.model('Order', dataSchema)
module.exports = OrderModel
