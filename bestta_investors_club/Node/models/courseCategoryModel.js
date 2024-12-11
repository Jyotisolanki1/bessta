const mongoose = require('mongoose')

let dataSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
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

const courseCategoryModel = mongoose.model('courseCategory', dataSchema)

module.exports = courseCategoryModel
