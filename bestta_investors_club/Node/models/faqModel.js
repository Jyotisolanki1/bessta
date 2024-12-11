const mongoose = require('mongoose')

let dataSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
        },
        answer: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

const FaqModel = mongoose.model('faq', dataSchema)

module.exports = FaqModel
