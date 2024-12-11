const mongoose = require('mongoose')

let dataSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
            required: true,
        },
        tags: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: ['enabled', 'disabled'],
            default: 'enabled',
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

const CategoryModel = mongoose.model('category', dataSchema)

module.exports = CategoryModel
