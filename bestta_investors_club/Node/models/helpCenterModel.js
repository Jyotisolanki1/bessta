const mongoose = require('mongoose')

let helpCentersSchema = new mongoose.Schema(
    {
        // uid: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'User',
        // },
        name: {
            type: String,
        },
        email: {
            type: String,
        },
        mobile: {
            type: String,
        },
        message: {
            type: String,
        },
        reply: {
            type: String,
            default :  "false"
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

module.exports = mongoose.model('helpCenters', helpCentersSchema)
