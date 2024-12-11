const mongoose = require('mongoose')
require('dotenv').config()
let DBurl = process.env.MONGO_URI
mongoose.connect(DBurl, {}).then((result) => {
    if (result) {
        console.info('Database connected successfully')
    } else {
        console.error('Database something went wrong')
    }
})
