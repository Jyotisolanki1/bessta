const mongoose = require('mongoose')

let dataSchema = new mongoose.Schema(
    {
     
       image: {
        type: String,
        required: true,
       },
        winners : {
            type: [
                {
                    name: {
                        type: String
                    },
                    prize : {
                        type: String
                    }
                }
            ],
            required: true,
        },
        year :{
            type: Date,
            required : true,
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

const PastWinnerModel = mongoose.model('pastWinner', dataSchema)

module.exports = PastWinnerModel
