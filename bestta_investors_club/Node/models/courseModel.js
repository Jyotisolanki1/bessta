const mongoose = require('mongoose')

let dataSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        video: {
            type: String,
            required: true,
        },
        videoType: {
            type: String,
            enum: ['upload', 'youtube', 'vimeo'],
            required: true,
        },
        category: {
            type: mongoose.Types.ObjectId,
            ref: 'courseCategory',
            required: true,
        },
        instructor: {
            type: String,
        },
        instructor_intro: {
            type: String,
        },
        tags: {
            type: [String],
            default: [],
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

const courseModel = mongoose.model('course', dataSchema)

module.exports = courseModel
