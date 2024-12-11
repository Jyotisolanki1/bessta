const mongoose = require('mongoose')

let dataSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

const BusinessCategoryModel = mongoose.model('businessCategory', dataSchema)

module.exports = BusinessCategoryModel
