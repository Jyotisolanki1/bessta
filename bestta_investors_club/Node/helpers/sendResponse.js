const pickFunction = require('./pickFunction')

const successResponse = (res, data) => {
    const property = pickFunction(data, ['message', 'data', 'statusCode'])

    res.status(data.statusCode).json({
        success: true,
        ...property,
        // message: data.message || null,
        // data: data.data,
        // meta: data?.meta || null
    })
}

const errorResponse = (res, data) => {
    const property = pickFunction(data, ['message', 'data', 'statusCode'])
    res.status(data.statusCode).json({
        success: false,
        ...property,
    })
}

module.exports = {
    success: successResponse,
    error: errorResponse,
}
