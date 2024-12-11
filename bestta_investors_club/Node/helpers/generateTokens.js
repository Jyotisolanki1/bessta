const jwt = require('jsonwebtoken')
const generateTokens = async (payload) => {
    try {
        const accessToken = jwt.sign(
            payload,
            process.env.JWT_ACCESSTOKEN_SECRET,
            { expiresIn: '90d' }
        )

        return Promise.resolve({ accessToken })
    } catch (err) {
        return Promise.reject(err)
    }
}
const generateTempTokens = async (payload) => {
    console.log('payload', payload)
    try {
        const accessToken = jwt.sign(
            payload,
            process.env.JWT_TEMPTOKEN_SECRET,
            { expiresIn: '10m' }
        )

        return Promise.resolve({ accessToken })
    } catch (err) {
        return Promise.reject(err)
    }
}

module.exports = {
    generateTokens,
    generateTempTokens,
}
