const mongoose = require('mongoose')
const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const skipAuthPath = [
    '/register',
    '/login',
    '/social-login-register',
    '/forget-password',
    '/category',
    '/product',
    '/add-cart',
    '/remove-cart-item',
    '/product-by-id',
    '/banner/',
    '/get-cart',
    '/apply-coupon',
    '/remove-coupon',
    '/plan-category',
    '/plans',
    '/draw',
    '/send-query',
    '/stripe_webhook',
    '/admin/login',
    '/admin/forgot-password',
    '/admin/verifyadmin',
    '/add-partner',
    '/get-partner',
    '/partner-status',
    '/admin-partner-status',
    '/get-static-content',
    '/past-winner',
    '/faq',
    '/get-business-category',
    '/store-status',
]

const tempAuthPath = [
    '/verify-otp',
    '/resend-otp',
    '/reset-password',
    '/admin/verify-otp',
    '/admin/resend-otp',
    '/admin/reset-password',
]

const JWTAuthantication = async (req, res, next) => {
    try {
        let urlPath = req._parsedUrl.pathname
        let token = ''
        // console.log('urlPath', req._parsedUrl)
        // Auth not checked
        if (skipAuthPath.indexOf(urlPath.toLowerCase()) > -1) {
            token = req.headers.authorization
            if (token && token != null) {
                token = token.split(' ')[1]
                let privatekey1 = process.env.JWT_ACCESSTOKEN_SECRET
                jwt.verify(token, privatekey1, async (err, decoded) => {
                    if (!err) req.user = decoded
                    return next()
                })
            } else {
                return next()
            }
        }
        // temp auth checked
        else if (
            tempAuthPath.indexOf(urlPath.toLowerCase()) > -1 &&
            req.headers.authorization
        ) {
            token = req.headers.authorization
            token = token.split(' ')[1]
            if (token && token != null) {
                let tempKey = process.env.JWT_TEMPTOKEN_SECRET
                jwt.verify(token, tempKey, async (err, decoded) => {
                    if (err) {
                        console.error('JWTAuthantication', err)
                        return res.status(200).json({
                            success: false,
                            message: res.__('Invalid token'),
                            data: { token },
                        })
                    } else {
                        console.info('JWTAuthantication token decode', decoded)
                        req.userTemp = decoded
                        return next()
                    }
                })
            } else {
                return res.status(200).json({
                    success: false,
                    message: res.__('Invalid token'),
                    data: { token },
                })
            }
        }
        // auth checked
        else if (req.headers.authorization) {
            token = req.headers.authorization
            token = token.split(' ')[1]
            if (token && token != null) {
                let privatekey = process.env.JWT_ACCESSTOKEN_SECRET
                jwt.verify(token, privatekey, async (err, decoded) => {
                    if (err) {
                        // console.error('JWTAuthantication', err)
                        return res.status(200).json({
                            success: false,
                            message: res.__('Invalid token'),
                            data: { token },
                        })
                    } else {
                        req.user = decoded
                        if (decoded.role == 'user') {
                            const user = await userModel.findOne({
                                _id: new mongoose.Types.ObjectId(req.user.id),
                            })
                            if (!user) {
                                return res.json({
                                    success: false,
                                    message: req.__('Invalid token'),
                                    data: {},
                                })
                            }
                            if (user && user.isStatus == 'blocked') {
                                return res.json({
                                    success: false,
                                    message: req.__(
                                        'Your account is deactivated by admin, please contact admin.'
                                    ),
                                    data: { isBlocked: true },
                                })
                            }
                        }
                        return next()
                    }
                })
            } else {
                return res.status(200).json({
                    success: false,
                    message: res.__('Invalid token'),
                    data: { token },
                })
            }
        } else {
            return res.status(200).json({
                success: false,
                message: res.__(
                    'unauthorized access please contact the administrator'
                ),
                data: { token },
            })
        }
    } catch (err) {
        console.error('JWTAuthantication', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

module.exports = JWTAuthantication
