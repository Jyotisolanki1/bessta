const mongoose = require('mongoose')

const MetaDataSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        description: { type: String },
    },
    {
        _id: false,
        versionKey: false,
    }
)
const productAttributeSchema = new mongoose.Schema(
    {
        label: {
            type: String,
        },
        values: {
            type: [String],
            default: [],
        },
    },
    {
        _id: false,
        versionKey: false,
    }
)

const variableProductAttr = new mongoose.Schema(
    {
        label: {
            type: String,
        },
        value: {
            type: String,
        },
    },
    {
        _id: false,
        versionKey: false,
    }
)

const variableProductAttributeSchema = new mongoose.Schema(
    {
        image: {
            type: String,
            default: null,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        stock: {
            type: Number,
            required: true,
        },
        attributes: {
            type: [variableProductAttr],
            required: true,
        },
    },
    {
       _id: mongoose.Schema.Types.ObjectId,
        versionKey: false,
    }
)

const discountSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ['percentage', 'fixed'],
            required: true,
        },
        value: {
            type: Number,
            required: true,
        },
    },
    {
        _id: false,
        versionKey: false,
    }
)

const dataSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        short_description: {
            type: String,
            default: null,
        },
        category: {
            type: mongoose.Types.ObjectId,
            ref: 'category',
            required: true,
        },
        price: {
            type: Number,
            default: null,
        },
        stock: {
            type: Number,
            default: null,
        },
        images: {
            type: [String],
            default: [],
        },
        reviews: {
            type: [mongoose.Types.ObjectId],
            ref: 'Review',
            default: [],
        },
        productType: {
            type: String,
            enum: ['simple_product', 'variable_product'],
            required: true,
        },
        tags: {
            type: String,
            default: '',
        },
        attributes: {
            type: [productAttributeSchema],
        },
        discount: {
            type: discountSchema,
            default: null,
        },
        status: {
            type: String,
            enum: ['published', 'unpublished'],
            default: 'published',
        },
        variableProducts: {
            type: [variableProductAttributeSchema],
            default: null,
        },
        metadata: {
            type: MetaDataSchema,
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)
const ProductModel = mongoose.model('Product', dataSchema)
module.exports = ProductModel
