const {
    addCartValidation,
    applyCouponValidation,
    removeCouponValidation,
    placeOrderValidation,
    paymentStatusValidation,
    removeCartItemValidation,
    subscriptionCheckoutValidation,
    reviewRatingValidation,
    addPartnerValidation,
} = require('../helpers/validationSchema')

const productModel = require('../models/productModel')
const categoryModel = require('../models/categoryModel')
const cartModel = require('../models/cartModel')
const courseModel = require('../models/courseModel')
const courseCategoryModel = require('../models/courseCategoryModel')
const couponModel = require('../models/couponModel')
const orderModel = require('../models/orderModel')
const planCategoryModel = require('../models/planCategoryModel')
const planModel = require('../models/planModel')
const drawModel = require('../models/drawModel')
const reviewModel = require('../models/reviewModel')
const subcriptionModel = require('../models/subcriptionModel')
const notificationModel = require('../models/notificationModel')
const userModel = require('../models/userModel')
const staticContentModel = require('../models/staticContentModel')
const partnerModel = require('../models/partnerModel')
const pastWinnerModel = require('../models/pastWinnerModel')
const faqModel = require('../models/faqModel')
const businessCategoryModel = require('../models/businessCategoryModel')
const storeStatusModel = require('../models/storeStatusModel')

const pushNotification = require('../librarys/pushNotification')
const { sendEmail } = require('../librarys/sendEmail')
const drawEntry = require('../helpers/drawEntry')

const exportCsv = require('fast-csv')
const fs = require('fs')
const bcrypt = require('bcrypt')
const axios = require('axios')
const mongoose = require('mongoose')
const moment = require('moment')
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const getProduct = async (req, res) => {
    try {
        let match = {
            status: 'published',
        }
        if (req.query.category) {
            match['category'] = new mongoose.Types.ObjectId(req.query.category)
        }
        // console.log('category', match)
        let productList = await productModel.aggregate([
            { $match: match },
            {
                $addFields: {
                    stock: { $sum: '$variableProducts.stock' },
                },
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            { $unwind: '$category' },
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'productId',
                    as: 'reviews',
                },
            },
            { $match: { 'category.status': 'enabled' } },
            {
                $addFields: {
                    avgRating: { $avg: '$reviews.rating' },
                },
            },
        ])
        // console.log(productList)
        if (productList && productList.length > 0) {
            return res.json({
                success: true,
                message: req.__('get Product list successfully.'),
                data: productList,
            })
        } else {
            return res.json({
                success: true,
                message: req.__('No data found.'),
                data: {},
            })
        }
    } catch (err) {
        console.error('getProduct', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const getSuggestedProduct = async (req, res) => {
    try {
        let match = {
            status: 'published',
            _id: { $nin: [new mongoose.Types.ObjectId(req.query.id)] },
        }
        if (req.query.category) {
            match['category'] = new mongoose.Types.ObjectId(req.query.category)
        }
        // console.log('category', match)
        let productList = await productModel.aggregate([
            { $match: match },
            {
                $addFields: {
                    stock: { $sum: '$variableProducts.stock' },
                },
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            { $limit: 5 },
            { $unwind: '$category' },
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'productId',
                    as: 'reviews',
                },
            },
            {
                $addFields: {
                    avgRating: { $avg: '$reviews.rating' },
                },
            },
        ])
        // console.log(productList)
        if (productList && productList.length > 0) {
            return res.json({
                success: true,
                message: req.__('get Product list successfully.'),
                data: productList,
            })
        } else {
            return res.json({
                success: true,
                message: req.__('No data found.'),
                data: {},
            })
        }
    } catch (err) {
        console.error('getProduct', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const getProductById = async (req, res) => {
    try {
        let match = {
            _id: new mongoose.Types.ObjectId(req.query.id),
            status: 'published',
        }
        let productList = await productModel.aggregate([
            { $match: match },
            {
                $addFields: {
                    stock: { $sum: '$variableProducts.stock' },
                },
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            { $unwind: '$category' },
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'productId',
                    as: 'reviews',
                },
            },
            {
                $addFields: {
                    avgRating: { $avg: '$reviews.rating' },
                },
            },
        ])
        return res.json({
            success: true,
            message: req.__('get Product successfully.'),
            data: productList,
        })
    } catch (err) {
        console.error('getProductById', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const getCategory = async (req, res) => {
    try {
        let categoryList = await categoryModel.find({ status: 'enabled' })
        return res.json({
            success: true,
            message: req.__('Get category list successfully.'),
            data: categoryList,
        })
    } catch (err) {
        console.error('getCategory', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const getCart = async (req, res) => {
    try {
        let match = {}
        if (!req.query.cart_id && req?.user?.id) {
            match = { user: new mongoose.Types.ObjectId(req?.user?.id) }
        } else if (req.query.cart_id) {
            match = { _id: new mongoose.Types.ObjectId(req.query.cart_id) }
        }
        if (Object.keys(match).length < 1) {
            return res.json({
                success: true,
                message: req.__('No data found'),
                data: {},
            })
        }
        let cartInfo = await cartModel.findOne(
            match,
            {},
            { sort: { createdAt: -1 } }
        )

        if (!cartInfo)
            return res.json({
                success: true,
                message: req.__('get cart successfully'),
                data: {},
            })

        cartInfo = JSON.parse(JSON.stringify(cartInfo))
        if (
            req?.user?.id &&
            (cartInfo.user == null ||
                cartInfo.user == undefined ||
                cartInfo.user == '')
        )
            await cartModel.updateOne(match, {
                $set: {
                    user: req?.user?.id,
                },
            })
        // console.log('cartInfo', cartInfo)
        for (const key in cartInfo.cartItems) {
            if (Object.hasOwnProperty.call(cartInfo.cartItems, key)) {
                const cartObj = cartInfo.cartItems[key]
                const productData = await productModel.findOne(
                    {
                        _id: cartObj.product,
                        'variableProducts._id': cartObj.variation,
                    },
                    {
                        name: 1,
                        images: 1,
                        status: 1,
                        'variableProducts.$': 1,
                    }
                )
                // console.log('productData', productData)
                cartInfo['cartItems'][key]['productInfo'] = productData
                cartInfo['cartItems'][key]['is_available'] =
                    productData.variableProducts[0].stock >
                    cartInfo['cartItems'][key]['quantity']
                        ? true
                        : false
            }
        }
        return res.json({
            success: true,
            message: req.__('get cart successfully'),
            data: cartInfo,
        })
    } catch (err) {
        console.error('getCart', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const addCart = async (req, res) => {
    try {
        const { error } = addCartValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })

        let cart_id = req.body?.cart_id
        if (req.body.quantity == 0) {
            return await removeCartItem(req, res)
        }
        if (cart_id) {
            let cartExit = await cartModel.findById(cart_id)
            if (!cartExit) cart_id = ''
        }

        if (!cart_id && req?.user?.id) {
            let cartTemp = await cartModel.findOne({
                user: new mongoose.Types.ObjectId(req?.user?.id),
            })
            cart_id = cartTemp?._id
        }

        let productExist = await productModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(req.body.product_id),
                    variableProducts: {
                        $elemMatch: {
                            _id: new mongoose.Types.ObjectId(
                                req.body.variable_id
                            ),
                        },
                    },
                },
            },
            {
                $project: {
                    variableProducts: {
                        $filter: {
                            input: '$variableProducts',
                            as: 'variableProduct',
                            cond: {
                                $eq: [
                                    '$$variableProduct._id',
                                    new mongoose.Types.ObjectId(
                                        req.body.variable_id
                                    ),
                                ],
                            },
                        },
                    },
                },
            },
        ])

        if (!productExist[0])
            return res.json({
                success: false,
                message: req.__('product not found'),
                data: {},
            })

        let price = productExist[0].variableProducts[0].price
        let stock = productExist[0].variableProducts[0].stock

        if (cart_id) {
            let cartProductExist = await cartModel.findOne({
                _id: new mongoose.Types.ObjectId(cart_id),
                'cartItems.product': new mongoose.Types.ObjectId(
                    req.body.product_id
                ),
                'cartItems.variation': new mongoose.Types.ObjectId(
                    req.body.variable_id
                ),
            })
            if (cartProductExist && cartProductExist.cartItems[0].quantity)
                req.body.quantity =
                    cartProductExist.cartItems[0].quantity + req.body.quantity
            console.log('cartProductExist', req.body.quantity)
        }
        if (stock < req.body.quantity)
            return res.json({
                success: false,
                message: req.__('No more quantity available'),
                // message: req.__(
                //     'You can only add ' +
                //         productExist[0].variableProducts[0].stock +
                //         " stock units of your cart, we don't have more in stock. Please re-adjust the quantity."
                // ),
                data: {},
            })

        let productObj = {
            product: req.body.product_id,
            variation: req.body.variable_id,
            price: price,
            quantity: req.body.quantity,
        }

        if (!cart_id) {
            let totalCartPrice = price * req.body.quantity

            let cartInfo = await cartModel({
                cartItems: [productObj],
                totalCartPrice: totalCartPrice,
                totalPriceAfterDiscount: totalCartPrice,
                user: req?.user?.id,
            }).save()
            cartInfo = JSON.parse(JSON.stringify(cartInfo))
            for (const key in cartInfo.cartItems) {
                if (Object.hasOwnProperty.call(cartInfo.cartItems, key)) {
                    const cartObj = cartInfo.cartItems[key]
                    const productData = await productModel.findOne(
                        {
                            _id: cartObj.product,
                            'variableProducts._id': cartObj.variation,
                        },
                        {
                            name: 1,
                            image: 1,
                            'variableProducts.$': 1,
                        }
                    )
                    // console.log('productData', productData)
                    cartInfo['cartItems'][key]['productInfo'] = productData
                }
            }

            return res.json({
                success: true,
                message: req.__('Item added to cart'),
                data: cartInfo,
            })
        } else {
            let cartExit = await cartModel.findById(cart_id)
            if (!cartExit)
                return res.json({
                    success: false,
                    message: req.__('cart id not found'),
                    data: {},
                })

            let totalCartPrice = 0
            let totalPriceAfterDiscount = 0

            for (const cartItem of cartExit.cartItems) {
                totalCartPrice +=
                    cartItem.variation.toString() ==
                    req.body.variable_id.toString()
                        ? price * req.body.quantity
                        : cartItem.price * cartItem.quantity
            }
            totalPriceAfterDiscount = totalCartPrice
            if (cartExit && cartExit.coupons) {
                let couponExit = await couponModel.findOne({
                    code: cartExit.coupons,
                })
                totalPriceAfterDiscount =
                    couponExit.discountType == 'percentage'
                        ? totalCartPrice -
                          (totalCartPrice * couponExit.value) / 100
                        : totalCartPrice - couponExit.value
            }

            let cartUpdate = await cartModel.findOneAndUpdate(
                {
                    _id: new mongoose.Types.ObjectId(cart_id),
                    'cartItems.product': new mongoose.Types.ObjectId(
                        req.body.product_id
                    ),
                    'cartItems.variation': new mongoose.Types.ObjectId(
                        req.body.variable_id
                    ),
                },
                {
                    $set: {
                        'cartItems.$.product': req.body.product_id,
                        'cartItems.$.variation': req.body.variable_id,
                        'cartItems.$.price': price,
                        'cartItems.$.quantity': req.body.quantity,
                        totalCartPrice: totalCartPrice,
                        totalPriceAfterDiscount: totalPriceAfterDiscount,
                        user: req?.user?.id,
                    },
                },
                { new: true }
            )
            if (!cartUpdate) {
                totalCartPrice += price * req.body.quantity
                totalPriceAfterDiscount = totalCartPrice
                if (cartExit && cartExit.coupons) {
                    let couponExit = await couponModel.findOne({
                        code: cartExit.coupons,
                    })
                    totalPriceAfterDiscount =
                        couponExit.discountType == 'percentage'
                            ? totalCartPrice -
                              (totalCartPrice * couponExit.value) / 100
                            : totalCartPrice - couponExit.value
                }

                cartUpdate = await cartModel.findOneAndUpdate(
                    { _id: new mongoose.Types.ObjectId(cart_id) },
                    {
                        $push: {
                            cartItems: {
                                product: req.body.product_id,
                                variation: req.body.variable_id,
                                price: price,
                                quantity: req.body.quantity,
                            },
                        },
                        $set: {
                            totalCartPrice: totalCartPrice,
                            totalPriceAfterDiscount: totalPriceAfterDiscount,
                            user: req?.user?.id,
                        },
                    },
                    {
                        new: true,
                    }
                )
            }

            cartUpdate = JSON.parse(JSON.stringify(cartUpdate))
            for (const key in cartUpdate.cartItems) {
                if (Object.hasOwnProperty.call(cartUpdate.cartItems, key)) {
                    const cartObj = cartUpdate.cartItems[key]
                    const productData = await productModel.findOne(
                        {
                            _id: cartObj.product,
                            'variableProducts._id': cartObj.variation,
                        },
                        {
                            name: 1,
                            image: 1,
                            'variableProducts.$': 1,
                        }
                    )
                    // console.log('productData', productData)
                    cartUpdate['cartItems'][key]['productInfo'] = productData
                }
            }

            return res.json({
                success: true,
                message: req.__('cart added successfully'),
                data: cartUpdate,
            })
        }
    } catch (err) {
        console.error('addCart', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const removeCartItem = async (req, res) => {
    try {
        const { error } = removeCartItemValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })

        let cartExit = await cartModel.findByIdAndUpdate(
            req.body.cart_id,
            {
                $pull: {
                    cartItems: {
                        product: req.body.product_id,
                        variation: req.body.variable_id,
                    },
                },
            },
            { new: true }
        )
        if (!cartExit)
            return res.json({
                success: false,
                message: req.__('cart id not found'),
                data: {},
            })

        let totalCartPrice = 0

        for (const cartItem of cartExit.cartItems) {
            totalCartPrice += cartItem.price * cartItem.quantity
        }
        let totalPriceAfterDiscount = totalCartPrice
        if (cartExit && cartExit.coupons) {
            let couponExit = await couponModel.findOne({
                code: cartExit.coupons,
            })
            totalPriceAfterDiscount =
                couponExit.discountType == 'percentage'
                    ? totalCartPrice - (totalCartPrice * couponExit.value) / 100
                    : totalCartPrice - couponExit.value
        }

        let cartUpdate = await cartModel.findOneAndUpdate(
            {
                _id: new mongoose.Types.ObjectId(req.body.cart_id),
            },
            {
                $set: {
                    totalCartPrice: totalCartPrice,
                    totalPriceAfterDiscount: totalPriceAfterDiscount,
                    coupons: totalCartPrice == 0 ? '' : cartExit.coupons,
                },
            },
            { new: true }
        )

        cartUpdate = JSON.parse(JSON.stringify(cartUpdate))
        for (const key in cartUpdate.cartItems) {
            if (Object.hasOwnProperty.call(cartUpdate.cartItems, key)) {
                const cartObj = cartUpdate.cartItems[key]
                const productData = await productModel.findOne(
                    {
                        _id: cartObj.product,
                        'variableProducts._id': cartObj.variation,
                    },
                    {
                        name: 1,
                        image: 1,
                        'variableProducts.$': 1,
                    }
                )
                // console.log('productData', productData)
                cartUpdate['cartItems'][key]['productInfo'] = productData
            }
        }

        return res.json({
            success: true,
            message: req.__('cart item remove successfully'),
            data: cartUpdate,
        })
    } catch (err) {
        console.error('addCart', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const applyCoupon = async (req, res) => {
    try {
        const { error } = applyCouponValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })

        let cartExit = await cartModel.findById(req.body.cart_id)
        if (!cartExit)
            return res.json({
                success: false,
                message: req.__('cart id not found'),
                data: {},
            })

        let couponExit = await couponModel.findOne({
            code: req.body.coupon_code,
            expirDate: { $gte: new Date() },
        })
        if (!couponExit)
            return res.json({
                success: false,
                message: req.__('Invalid coupon code'),
                data: {},
            })

        let totalPriceAfterDiscount =
            couponExit.discountType == 'percentage'
                ? cartExit.totalCartPrice -
                  (cartExit.totalCartPrice * couponExit.value) / 100
                : cartExit.totalCartPrice - couponExit.value

        let cartUpdate = await cartModel.findByIdAndUpdate(
            new mongoose.Types.ObjectId(req.body.cart_id),
            {
                $set: {
                    coupons: req.body.coupon_code,
                    totalPriceAfterDiscount:
                        totalPriceAfterDiscount > 0
                            ? totalPriceAfterDiscount
                            : 0,
                },
            },
            {
                new: true,
            }
        )

        return res.json({
            success: true,
            message: req.__('Coupon apply successfully'),
            data: cartUpdate,
        })
    } catch (err) {
        console.error('applyCoupon', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const removeCoupon = async (req, res) => {
    try {
        const { error } = removeCouponValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })

        let cartExit = await cartModel.findById(req.body.cart_id)
        if (!cartExit)
            return res.json({
                success: false,
                message: req.__('cart id not found'),
                data: {},
            })

        let totalPriceAfterDiscount = cartExit.totalCartPrice

        let cartUpdate = await cartModel.findByIdAndUpdate(
            new mongoose.Types.ObjectId(req.body.cart_id),
            {
                $set: {
                    coupons: '',
                    totalPriceAfterDiscount:
                        totalPriceAfterDiscount > 0
                            ? totalPriceAfterDiscount
                            : 0,
                },
            },
            {
                new: true,
            }
        )

        return res.json({
            success: true,
            message: req.__('Coupon remove successfully'),
            data: cartUpdate,
        })
    } catch (err) {
        console.error('removeCoupon', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const placeOrder = async (req, res) => {
    try {
        const { error } = placeOrderValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })

        let cartExit = await cartModel.findById(req.body.cart_id)
        if (!cartExit)
            return res.json({
                success: false,
                message: req.__('cart id not found'),
                data: {},
            })
        for (const items of cartExit.cartItems) {
            let productExist = await productModel.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(items.product),
                        variableProducts: {
                            $elemMatch: {
                                _id: new mongoose.Types.ObjectId(
                                    items.variation
                                ),
                            },
                        },
                    },
                },
                {
                    $project: {
                        variableProducts: {
                            $filter: {
                                input: '$variableProducts',
                                as: 'variableProduct',
                                cond: {
                                    $eq: [
                                        '$$variableProduct._id',
                                        new mongoose.Types.ObjectId(
                                            items.variation
                                        ),
                                    ],
                                },
                            },
                        },
                    },
                },
            ])
            if (!productExist[0])
                return res.json({
                    success: false,
                    message: req.__('product not found'),
                    data: {},
                })

            let stock = productExist[0].variableProducts[0].stock
            if (stock < items.quantity)
                return res.json({
                    success: false,
                    message: req.__('No more quantity available'),
                    data: items,
                })
        }
        let orderObj = {
            uid: req.user.id,
            cart_id: req.body.cart_id,
            lineItems: cartExit.cartItems,
            billingAddress: req.body.billingAddress,
            shippingAddress: req.body.shippingAddress,
            subTotal: cartExit.totalCartPrice,
            shippingCost: 0,
            total: cartExit.totalPriceAfterDiscount,
        }
        let orderInfo = await orderModel(orderObj).save()

        const paymentIntent = await stripe.paymentIntents.create({
            amount: cartExit.totalPriceAfterDiscount * 100,
            currency: 'AUD',
            payment_method_types: ['card'],
        })
        await orderModel.findByIdAndUpdate(orderInfo._id, {
            $set: { paymentIntent: paymentIntent },
        })
        return res.json({
            success: true,
            message: req.__('Place order successfully'),
            data: {
                orderInfo: orderInfo,
                order_id: orderInfo._id,
                client_secret: paymentIntent.client_secret,
                amount: cartExit.totalPriceAfterDiscount,
                publishable_key: process.env.STRIPE_PUBLISHABLE_key,
            },
        })
    } catch (err) {
        console.error('placeOrder', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const paymentStatus = async (req, res) => {
    try {
        const { error } = paymentStatusValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })

        let orderInfo = await orderModel.findOneAndUpdate(
            { 'paymentIntent.client_secret': req.body.client_secret },
            { $set: { status: 'paid' } }
        )
        // stoke remove
        for (const productInfo of orderInfo.lineItems) {
            await productModel.updateOne(
                {
                    _id: new mongoose.Types.ObjectId(productInfo.product),
                    'variableProducts._id': new mongoose.Types.ObjectId(
                        productInfo.variation
                    ),
                },
                { $inc: { 'variableProducts.$.stock': -productInfo.quantity } }
            )
        }
        await cartModel.updateOne(
            { _id: new mongoose.Types.ObjectId(orderInfo.cart_id) },
            {
                $set: {
                    cartItems: [],
                    totalCartPrice: 0,
                    totalPriceAfterDiscount: 0,
                    coupons: '',
                },
            }
        )
        if (orderInfo) {
            let userInfo = await userModel.findById(
                new mongoose.Types.ObjectId(orderInfo.uid)
            )
            // console.log('userInfo.fcmToken', orderInfo.uid, userInfo)
            if (userInfo && userInfo.fcmToken)
                // pushnotification
                pushNotification.sendPushNotification({
                    device_ids: [userInfo.fcmToken],
                    title: 'Place Order',
                    body: 'Your Order is placed successfully',
                    data: {},
                })
            new notificationModel({
                uid: orderInfo.uid,
                title: 'Place Order',
                body: 'Your Order is placed successfully',
                data: {},
                type: 'individual',
            }).save()

            return res.json({
                success: true,
                message: req.__('Payment received successfully'),
                data: orderInfo,
            })
        } else {
            return res.json({
                success: false,
                message: req.__('Payment intent not match'),
                data: orderInfo,
            })
        }
    } catch (err) {
        console.error('paymentStatus', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const getBanner = async (req, res) => {
    try {
        return res.json({
            success: true,
            message: req.__('successfully'),
            data: [
                'public/banner/banner1.jpg',
                'public/banner/banner2.png',
                'public/banner/banner1.jpg',
            ],
        })
    } catch (err) {
        console.error('getBanner', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const getCourseCategory = async (req, res) => {
    try {
        let categoryList = await courseCategoryModel.find({ status: 'enabled' })
        return res.json({
            success: true,
            message: req.__('Get course category list successfully.'),
            data: categoryList,
        })
    } catch (err) {
        console.error('getCourseCategory', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const getCourse = async (req, res) => {
    try {
        let match = {}
        if (req.query.category) match['category'] = req.query.category
        let couponList = await courseModel.find(match).populate('category')
        return res.json({
            success: true,
            message: req.__('Get course list successfully.'),
            data: couponList,
        })
    } catch (err) {
        console.error('getCourse', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const getPlanCategory = async (req, res) => {
    try {
        let match = {
            _id: {
                $ne: new mongoose.Types.ObjectId('65d875b906bd026f1d450fcb'),
            },
        }
        if (req.query.type == 'all') {
            match = {}
        }
        let categoryList = await planCategoryModel.find(match)
        return res.json({
            success: true,
            message: req.__('Get plan category list successfully.'),
            data: categoryList,
        })
    } catch (err) {
        console.error('getPlanCategory', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const getPlans = async (req, res) => {
    try {
        let match = {}
        if (!req.query.category)
            match = {
                intervalType: { $ne: 'fixed' },
                status: { $ne: 'inactive' },
            }
        // let match = {}
        if (req.query.plantype == 'fixed')
            match = { intervalType: 'fixed', status: { $ne: 'inactive' } }
        if (req.query.category) match['category'] = req.query.category
        let planList = await planModel
            .find(match, {}, { sort: { price: 1 } })
            .populate('category')
        return res.json({
            success: true,
            message: req.__('Get plan list successfully.'),
            data: planList,
        })
    } catch (err) {
        console.error('getPlans', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const getMyOrder = async (req, res) => {
    try {
        let match = { uid: new mongoose.Types.ObjectId(req.user.id) }
        if (req.query.order_id) {
            match['_id'] = new mongoose.Types.ObjectId(req.query.order_id)
        }
        let orderList = await orderModel.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: 'reviews',
                    localField: 'lineItems.product',
                    foreignField: 'productId',
                    as: 'reviews',
                },
            },
            {
                $lookup: {
                    from: 'reviews',
                    localField: 'lineItems.product',
                    foreignField: 'productId',
                    let: {
                        userId: '$uid',
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$uid', '$$userId'],
                                },
                            },
                        },
                    ],
                    as: 'reviewExist',
                },
            },
        ])
        orderList = JSON.parse(JSON.stringify(orderList))
        // console.log('orderList.lineItems', orderList)
        for (const key in orderList) {
            for (const key1 in orderList[key].lineItems) {
                // console.log('orderList.lineItems -- ', orderList[key].lineItems)
                if (
                    Object.hasOwnProperty.call(orderList[key].lineItems, key1)
                ) {
                    const orderObj = orderList[key].lineItems[key1]
                    const productData = await productModel.findOne(
                        {
                            _id: orderObj.product,
                            'variableProducts._id': orderObj.variation,
                        },
                        {
                            name: 1,
                            image: 1,
                            'variableProducts.$': 1,
                        }
                    )

                    orderList[key]['lineItems'][key1]['productInfo'] =
                        productData

                    const productData1 = await productModel.aggregate([
                        {
                            $match: {
                                _id: new mongoose.Types.ObjectId(
                                    orderObj.product
                                ),
                            },
                        },
                        {
                            $lookup: {
                                from: 'categories',
                                localField: 'category',
                                foreignField: '_id',
                                as: 'category',
                            },
                        },
                        { $unwind: '$category' },
                        {
                            $lookup: {
                                from: 'reviews',
                                localField: '_id',
                                foreignField: 'productId',
                                as: 'reviews',
                            },
                        },
                        {
                            $addFields: {
                                avgRating: { $avg: '$reviews.rating' },
                            },
                        },
                    ])
                    if (productData1 && productData1[0])
                        orderList[key]['lineItems'][key1]['productData'] =
                            JSON.parse(JSON.stringify(productData1[0]))
                }
            }
        }
        if (orderList) {
            return res.json({
                success: true,
                message: req.__('Get order list successfully.'),
                data: orderList,
            })
        } else {
            return res.json({
                success: false,
                message: req.__('No data found'),
                data: {},
            })
        }
    } catch (err) {
        console.error('getMyOrder', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const reviewRating = async (req, res) => {
    try {
        const { error } = reviewRatingValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })
        let match = {
            _id: new mongoose.Types.ObjectId(req.body.order_id),
            uid: new mongoose.Types.ObjectId(req.user.id),
        }
        let order = await orderModel.findOne(match)
        if (!order)
            return res.json({
                success: false,
                message: req.__('order not found'),
                data: {},
            })

        let reviewInfo = await reviewModel.updateOne(
            {
                orderId: new mongoose.Types.ObjectId(req.body.order_id),
                uid: new mongoose.Types.ObjectId(req.user.id),
                productId: new mongoose.Types.ObjectId(req.body.product_id),
            },
            {
                $set: {
                    orderId: new mongoose.Types.ObjectId(req.body.order_id),
                    uid: new mongoose.Types.ObjectId(req.user.id),
                    productId: new mongoose.Types.ObjectId(req.body.product_id),
                    comment: req.body.comment,
                    rating: req.body.rating,
                },
            },
            { new: true, upsert: true }
        )
        if (reviewInfo.upsertedCount == 1)
            await productModel.updateOne(
                { _id: new mongoose.Types.ObjectId(req.body.product_id) },
                { $push: { reviews: reviewInfo.upsertedId } }
            )

        return res.json({
            success: true,
            message: req.__('Review added successfully'),
            data: reviewInfo,
        })
    } catch (err) {
        console.error('reviewRating', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const subscriptionCheckout = async (req, res) => {
    try {
        const { error } = subscriptionCheckoutValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })

        let planInfo = await planModel.findOne({
            _id: new mongoose.Types.ObjectId(req.body.plan_id),
        })
        // get the price
        const price = await stripe.prices.retrieve(planInfo.stripePlanId)

        let subcriptionInfo = await subcriptionModel.findOne({
            uid: new mongoose.Types.ObjectId(req.user.id),
            status: 'active',
            type: 'recurring',
        })

        if (subcriptionInfo && price.recurring !== null)
            return res.json({
                success: false,
                message: req.__(
                    'you are already subscribed, you can upgrade the plan.'
                ),
                data: {},
            })

        let stripeCustomerId = ''
        let userInfo = await userModel.findById(
            new mongoose.Types.ObjectId(req.user.id)
        )
        if (!userInfo.stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: req.user.email,
            })
            stripeCustomerId = customer.id
            await userModel.findByIdAndUpdate(
                new mongoose.Types.ObjectId(req.user.id),
                { $set: { stripeCustomerId: stripeCustomerId } }
            )
        } else {
            stripeCustomerId = userInfo.stripeCustomerId
        }

        let subscription_id = ''
        let client_secret = ''
        let plan_type = ''
        let startDate = moment()
        let endDate = moment()
        let invoice_id = ''
        // check if the price is recurring or not
        if (price.recurring !== null) {
            let subscription = await stripe.subscriptions.create({
                customer: stripeCustomerId,
                items: [
                    {
                        price: planInfo.stripePlanId,
                    },
                ],
                payment_behavior: 'default_incomplete',
                expand: ['latest_invoice.payment_intent'],
                payment_settings: {
                    save_default_payment_method: 'on_subscription',
                },
            })
            // console.log('subscription -----', subscription)
            subscription_id = subscription.id
            client_secret =
                subscription.latest_invoice.payment_intent.client_secret
            plan_type = 'recurring'
            startDate = moment.unix(subscription.current_period_start)
            endDate = moment.unix(subscription.current_period_end)
            invoice_id = subscription.latest_invoice.id
        } else {
            let pi = await stripe.paymentIntents.create({
                customer: stripeCustomerId,
                currency: price.currency,
                amount: price.unit_amount,
            })
            subscription_id = pi.id
            client_secret = pi.client_secret
            plan_type = 'fixed'
            invoice_id = pi.client_secret
        }
        let obj = {
            uid: req.user.id,
            subcription_id: subscription_id,
            client_secret: client_secret,
            invoice_id: invoice_id,
            entries: planInfo.entries,
            amount: planInfo.price,
            plan_id: req.body.plan_id,
            type: plan_type,
            startDate: startDate,
            endDate: endDate,
            draw_id: req.body.draw_id,
        }
        let subscriptionData = await new subcriptionModel(obj).save()
        var myentries = await drawEntry.getUserEntry(req.user.id)

        return res.json({
            success: true,
            message: req.__('subscription checkout.'),
            data: {
                subscriptionId: subscription_id,
                clientSecret: client_secret,
            },
        })
    } catch (err) {
        console.error('subscriptionCheckout', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const subscriptionStatus = async (req, res) => {
    try {
        const { error } = paymentStatusValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })

        let subcriptionInfo = await subcriptionModel.findOneAndUpdate(
            { client_secret: req.body.client_secret },
            { $set: { status: 'active' } }
        )
        if (subcriptionInfo) {
            let userInfo = await userModel.findById(
                new mongoose.Types.ObjectId(subcriptionInfo.uid)
            )
            let planInfo = await planModel.findOne({
                _id: new mongoose.Types.ObjectId(subcriptionInfo.plan_id),
            })
            var myentries = await drawEntry.getUserEntry(
                new mongoose.Types.ObjectId(subcriptionInfo.uid)
            )
            //subscription upgrade invoice mail
            await sendEmail(
                userInfo.firstname + ' ' + userInfo.lastname,
                userInfo.email,
                'Subscription invoice mail',
                `<div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: right;">
                    <h1 style="margin: 0;">INVOICE</h1>
                    <p style="margin: 5px 0;">Invoice No. ${
                        subcriptionInfo._id
                    }</p>
                    <p style="margin: 5px 0;">${moment().format(
                        'DD MMMM YYYY'
                    )}</p>
                </div>

                <div style="margin: 20px 0;">
                    <h3 style="margin: 0;">Billed To:</h3>
                    <p style="margin: 5px 0;">${userInfo.firstname}  ${
                    userInfo.lastname
                }</p>
                    <p style="margin: 5px 0;">${userInfo.phone}</p>
                    <p style="margin: 5px 0;">${userInfo.billing_address}(${
                    userInfo.postcode
                })</p>
                </div>

                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="border-bottom: 2px solid #ddd; padding: 8px 0; text-align: left;">Plan name</th>
                            <th style="border-bottom: 2px solid #ddd; padding: 8px 0; text-align: right;">Quantity</th>
                            <th style="border-bottom: 2px solid #ddd; padding: 8px 0; text-align: right;">Entry</th>
                            <th style="border-bottom: 2px solid #ddd; padding: 8px 0; text-align: right;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${
                                planInfo.name
                            }( Interval - ${planInfo.intervalType})</td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">1</td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">${
                                planInfo.entries
                            }</td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">$${
                                planInfo.price
                            }</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" style="padding: 8px 0; text-align: right; font-weight: bold;">Total:-</td>
                            <td style="padding: 8px 0; text-align: right;">$${
                                planInfo.price
                            }</td>
                        </tr>
                    </tfoot>
                </table>
                <p>Total Entries - ${myentries}</p>
            </div>`
            )
            return res.json({
                success: true,
                message: req.__('Payment received successfully'),
                data: subcriptionInfo,
            })
        } else {
            return res.json({
                success: false,
                message: req.__('Payment intent not match'),
                data: subcriptionInfo,
            })
        }
    } catch (err) {
        console.error('subscriptionStatus', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const cancelSubscription = async (req, res) => {
    // Cancel the subscription
    try {
        let subcription = await subcriptionModel.findOne({
            uid: new mongoose.Types.ObjectId(req.user.id),
            status: 'active',
            type: 'recurring',
            
        })

        if (subcription) {
            const deletedSubscription = await stripe.subscriptions.cancel(
                subcription.subcription_id
            )

            await subcriptionModel.updateMany(
                {
                    uid: new mongoose.Types.ObjectId(req.user.id),
                    subcription_id: subcription.subcription_id,
                    status: { $in: ['active', 'resume'] },
                    type: 'recurring',
                },
                { $set: { status: 'cancel' } }
            )

            let userInfo = await userModel.findById(
                new mongoose.Types.ObjectId(req.user.id)
            )

            await sendEmail(
                userInfo.firstname + ' ' + userInfo.lastname,
                userInfo.email,
                'Your Cancellation Request is Confirmed',
                `<p>This email is to confirm that we’ve canceled your subscription.</p>`
            )
            return res.json({
                success: true,
                message: req.__('Cancel subscription'),
                data: deletedSubscription,
            })
        } else {
            return res.json({
                success: false,
                message: req.__('subscription not found'),
                data: {},
            })
        }
    } catch (err) {
        console.error('cancelSubscription', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

// const cancelSubscription = async (req, res) => {
//     // Cancel the subscription
//     try {
//         let subcriptions = await subcriptionModel.find({
//             uid: new mongoose.Types.ObjectId(req.user.id),
//             status: { $in: ['active', 'resume'] },
//             type: 'recurring',
//         })

//         console.log('subcriptions', subcriptions)

//         for (const subcription of subcriptions) {
//             console.log('testing', subcription._id)
//             if (subcription) {
//                 const deletedSubscription = await stripe.subscriptions.cancel(
//                     subcription.subcription_id
//                 )
//                 console.log(subcription._id)
//                 await subcriptionModel.findOneAndUpdate(
//                     {
//                         _id: subcription._id,
//                     },
//                     { $set: { status: 'cancel' } }
//                 )

//                 let userInfo = await userModel.findById(
//                     new mongoose.Types.ObjectId(req.user.id)
//                 )

//                 await sendEmail(
//                     userInfo.firstname + ' ' + userInfo.lastname,
//                     userInfo.email,
//                     'Your Cancellation Request is Confirmed',
//                     `<p>This email is to confirm that we’ve canceled your subscription.</p>`
//                 )
//                 return res.json({
//                     success: true,
//                     message: req.__('Cancel subscription'),
//                     data: deletedSubscription,
//                 })
//             } else {
//                 return res.json({
//                     success: false,
//                     message: req.__('subscription not found'),
//                     data: {},
//                 })
//             }
//         }
//     } catch (err) {
//         console.error('cancelSubscription', err)
//         return res.json({
//             success: false,
//             message: req.__('Internal Server Error'),
//             data: {},
//         })
//     }
// }
const deleteUserAcount = async (req, res) => {
    try {
        let subcription = await subcriptionModel.findOne({
            uid: new mongoose.Types.ObjectId(req.user.id),
            status: 'active',
            type: 'recurring',
        })

        if (subcription) {
            await stripe.subscriptions.cancel(subcription.subcription_id)
        }

        await subcriptionModel.updateMany(
            {
                uid: new mongoose.Types.ObjectId(req.user.id),
                status: 'active',
            },
            { $set: { status: 'cancel', description: 'Account Deleted' } }
        )

        const deletedUser = await userModel.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(req.user.id) },
            { $set: { isStatus: 'deleted' } },
            { new: true } // Option to return the updated document
        )

        if (deletedUser) {
            // await sendEmail(
            //     userInfo.firstname + ' ' + userInfo.lastname,
            //     userInfo.email,
            //     'Your Cancellation Request is Confirmed',
            //     `<p>This email is to confirm that we’ve canceled your subscription.</p>`
            // )

            return res.json({
                success: true,
                message: req.__('Account deleted successfully'),
                data: { isStatus: 'deleted' },
            })
        } else {
            return res.json({
                success: true,
                message: req.__('User not found'),
                data: {},
            })
        }
        // } else {
        //     return res.json({
        //         success: false,
        //         message: req.__('subscription not found'),
        //         data: {},
        //     })
        // }
    } catch (err) {
        console.error('cancelSubscription', err)
        return res.json({
            success: false,
            message: req.__('Internal server error'),
            data: {},
        })
    }
}

// const updateSubscription = async (req, res) => {
//     try {
//         console.log(req.body)
//         const { error } = subscriptionCheckoutValidation(req.body)
//         if (error)
//             return res.json({
//                 success: false,
//                 message: req.__(error.details[0].message),
//                 data: {},
//             })
//         let userInfo = await userModel.findById(
//             new mongoose.Types.ObjectId(req.user.id)
//         )

//         const currentDate = new Date();

//         const thirtyDaysAgo = new Date();
//         thirtyDaysAgo.setDate(currentDate.getDate() - 30);

//         const currentMonthDocCount = await subcriptionModel.countDocuments({
//             uid: new mongoose.Types.ObjectId(req.user.id),
//             type: 'recurring',
//             status: { $nin: ['active', 'cancel'] },
//             createdAt: {
//                 $gte: thirtyDaysAgo,
//                 $lt: currentDate
//             }
//         });
//         console.log(currentMonthDocCount)
//         if (currentMonthDocCount > 2) {
//             return res.json({
//                 success: false,
//                 message: req.__(
//                     'Downgrades/Upgrade is only allowed once in a billing cycle.'
//                 ),
//                 data: {},
//             })
//         }
//         let subcription = await subcriptionModel.findOne({
//             uid: new mongoose.Types.ObjectId(req.user.id),
//             status: 'active',
//             type: 'recurring',
//         })
//         const subscriptionInfo = await stripe.subscriptions.retrieve(
//             subcription.subcription_id
//         )

//         let planInfo = await planModel.findOne({
//             _id: new mongoose.Types.ObjectId(req.body.plan_id),
//         })

//         const updatedSubscription = await stripe.subscriptions.update(
//             subcription.subcription_id,
//             {
//                 proration_behavior: 'none',
//                 items: [
//                     {
//                         id: subscriptionInfo.items.data[0].id,
//                         price: planInfo.stripePlanId,
//                     },
//                 ],
//                 billing_cycle_anchor: 'now',
//                 payment_settings: {
//                     payment_method_types: ['card'],
//                 },
//             }
//         )

//         await subcriptionModel.updateMany(
//             {
//                 uid: new mongoose.Types.ObjectId(req.user.id),
//                 status: 'active',
//                 type: 'recurring',
//             },
//             {
//                 $set: {
//                     status: 'update',
//                 },
//             }
//         )
//         let startDate = moment.unix(updatedSubscription.current_period_start)
//         let endDate = moment.unix(updatedSubscription.current_period_end)
//         let obj = {
//             uid: req.user.id,
//             status: 'active',
//             subcription_id: subcription.subcription_id,
//             client_secret: subcription.client_secret,
//             invoice_id: updatedSubscription.latest_invoice,
//             amount: planInfo.price,
//             entries: planInfo.entries,
//             plan_id: req.body.plan_id,
//             type: 'recurring',
//             startDate: startDate,
//             endDate: endDate,
//         }
//         var subscriptionData = await new subcriptionModel(obj).save()
//         var myentries = await drawEntry.getUserEntry(req.user.id)
//         //subscription upgrade invoice mail
//         await sendEmail(
//             userInfo.firstname + ' ' + userInfo.lastname,
//             userInfo.email,
//             'Subscription upgrade invoice mail',
//             `<div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
//                 <div style="text-align: right;">
//                     <h1 style="margin: 0;">INVOICE</h1>
//                     <p style="margin: 5px 0;">Invoice No. ${
//                         subscriptionData._id
//                     }</p>
//                     <p style="margin: 5px 0;">${moment().format(
//                         'DD MMMM YYYY'
//                     )}</p>
//                 </div>

//                 <div style="margin: 20px 0;">
//                     <h3 style="margin: 0;">Billed To:</h3>
//                     <p style="margin: 5px 0;">${userInfo.firstname}  ${
//                 userInfo.lastname
//             }</p>
//                     <p style="margin: 5px 0;">${userInfo.phone}</p>
//                     <p style="margin: 5px 0;">${userInfo.billing_address}(${
//                 userInfo.postcode
//             })</p>
//                 </div>

//                 <table style="width: 100%; border-collapse: collapse;">
//                     <thead>
//                         <tr>
//                             <th style="border-bottom: 2px solid #ddd; padding: 8px 0; text-align: left;">Plan name</th>
//                             <th style="border-bottom: 2px solid #ddd; padding: 8px 0; text-align: right;">Quantity</th>
//                             <th style="border-bottom: 2px solid #ddd; padding: 8px 0; text-align: right;">Entry</th>
//                             <th style="border-bottom: 2px solid #ddd; padding: 8px 0; text-align: right;">Price</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         <tr>
//                             <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${
//                                 planInfo.name
//                             }( Interval - ${planInfo.intervalType})</td>
//                             <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">1</td>
//                             <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">${
//                                 planInfo.entries
//                             }</td>
//                             <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">$${
//                                 planInfo.price
//                             }</td>
//                         </tr>
//                     </tbody>
//                     <tfoot>
//                         <tr>
//                             <td colspan="3" style="padding: 8px 0; text-align: right; font-weight: bold;">Total:-</td>
//                             <td style="padding: 8px 0; text-align: right;">$${
//                                 planInfo.price
//                             }</td>
//                         </tr>
//                     </tfoot>
//                 </table>
//                 <p>Total Entries - ${myentries}</p>
//             </div>`
//         )
//         return res.json({
//             success: true,
//             message: req.__('Subscription upgraded successfully'),
//             data: updatedSubscription,
//         })
//     } catch (err) {
//         console.error('updateSubscription', err)
//         return res.json({
//             success: false,
//             message: req.__('Internal Server Error'),
//             data: {},
//         })
//     }
// }
// const updateSubscription = async (req, res) => {
//     try {
//         const { error } = subscriptionCheckoutValidation(req.body)
//         if (error)
//             return res.json({
//                 success: false,
//                 message: req.__(error.details[0].message),
//                 data: {},
//             })
//         let userInfo = await userModel.findById(
//             new mongoose.Types.ObjectId(req.user.id)
//         )

//         const currentDate = new Date();

//         const thirtyDaysAgo = new Date();
//         thirtyDaysAgo.setDate(currentDate.getDate() - 30);

//         const currentMonthDocCount = await subcriptionModel.countDocuments({
//             uid: new mongoose.Types.ObjectId(req.user.id),
//             type: 'recurring',
//             status: { $nin: ['active', 'cancel'] },
//             createdAt: {
//                 $gte: thirtyDaysAgo,
//                 $lt: currentDate
//             }
//         });
//         console.log(currentMonthDocCount)
//         if (currentMonthDocCount > 2) {
//             return res.json({
//                 success: false,
//                 message: req.__(
//                     'Downgrades/Upgrade is only allowed once in a billing cycle.'
//                 ),
//                 data: {},
//             })
//         }
//         let subcription = await subcriptionModel.findOne({
//             uid: new mongoose.Types.ObjectId(req.user.id),
//             status: 'active',
//             type: 'recurring',
//         })
//         const subscriptionInfo = await stripe.subscriptions.retrieve(
//             subcription.subcription_id
//         )

//         let planInfo = await planModel.findOne({
//             _id: new mongoose.Types.ObjectId(req.body.plan_id),
//         })

//         const updatedSubscription = await stripe.subscriptions.update(
//             subcription.subcription_id,
//             {
//                 proration_behavior: 'none',
//                 items: [
//                     {
//                         id: subscriptionInfo.items.data[0].id,
//                         price: planInfo.stripePlanId,
//                     },
//                 ],
//                 billing_cycle_anchor: 'now',
//                 payment_settings: {
//                     payment_method_types: ['card'],
//                 },
//             }
//         )

//         await subcriptionModel.updateMany(
//             {
//                 uid: new mongoose.Types.ObjectId(req.user.id),
//                 status: 'active',
//                 type: 'recurring',
//             },
//             {
//                 $set: {
//                     status: 'update',
//                 },
//             }
//         )
//         let startDate = moment.unix(updatedSubscription.current_period_start)
//         let endDate = moment.unix(updatedSubscription.current_period_end)
//         let obj = {
//             uid: req.user.id,
//             status: 'active',
//             subcription_id: subcription.subcription_id,
//             client_secret: subcription.client_secret,
//             invoice_id: updatedSubscription.latest_invoice,
//             amount: planInfo.price,
//             entries: planInfo.entries,
//             plan_id: req.body.plan_id,
//             type: 'recurring',
//             startDate: startDate,
//             endDate: endDate,
//         }
//         var subscriptionData = await new subcriptionModel(obj).save()
//         var myentries = await drawEntry.getUserEntry(req.user.id)
//         //subscription upgrade invoice mail
//         await sendEmail(
//             userInfo.firstname + ' ' + userInfo.lastname,
//             userInfo.email,
//             'Subscription upgrade invoice mail',
//             `<div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
//                 <div style="text-align: right;">
//                     <h1 style="margin: 0;">INVOICE</h1>
//                     <p style="margin: 5px 0;">Invoice No. ${
//                         subscriptionData._id
//                     }</p>
//                     <p style="margin: 5px 0;">${moment().format(
//                         'DD MMMM YYYY'
//                     )}</p>
//                 </div>

//                 <div style="margin: 20px 0;">
//                     <h3 style="margin: 0;">Billed To:</h3>
//                     <p style="margin: 5px 0;">${userInfo.firstname}  ${
//                 userInfo.lastname
//             }</p>
//                     <p style="margin: 5px 0;">${userInfo.phone}</p>
//                     <p style="margin: 5px 0;">${userInfo.billing_address}(${
//                 userInfo.postcode
//             })</p>
//                 </div>

//                 <table style="width: 100%; border-collapse: collapse;">
//                     <thead>
//                         <tr>
//                             <th style="border-bottom: 2px solid #ddd; padding: 8px 0; text-align: left;">Plan name</th>
//                             <th style="border-bottom: 2px solid #ddd; padding: 8px 0; text-align: right;">Quantity</th>
//                             <th style="border-bottom: 2px solid #ddd; padding: 8px 0; text-align: right;">Entry</th>
//                             <th style="border-bottom: 2px solid #ddd; padding: 8px 0; text-align: right;">Price</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         <tr>
//                             <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${
//                                 planInfo.name
//                             }( Interval - ${planInfo.intervalType})</td>
//                             <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">1</td>
//                             <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">${
//                                 planInfo.entries
//                             }</td>
//                             <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">$${
//                                 planInfo.price
//                             }</td>
//                         </tr>
//                     </tbody>
//                     <tfoot>
//                         <tr>
//                             <td colspan="3" style="padding: 8px 0; text-align: right; font-weight: bold;">Total:-</td>
//                             <td style="padding: 8px 0; text-align: right;">$${
//                                 planInfo.price
//                             }</td>
//                         </tr>
//                     </tfoot>
//                 </table>
//                 <p>Total Entries - ${myentries}</p>
//             </div>`
//         )
//         return res.json({
//             success: true,
//             message: req.__('Subscription upgraded successfully'),
//             data: updatedSubscription,
//         })
//     } catch (err) {
//         console.error('updateSubscription', err)
//         return res.json({
//             success: false,
//             message: req.__('Internal Server Error'),
//             data: {},
//         })
//     }
// }
const updateSubscription = async (req, res) => {
    try {
        const { error } = subscriptionCheckoutValidation(req.body)
        if (error) {
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })
        }

        // Retrieve user information
        let userInfo = await userModel.findById(
            new mongoose.Types.ObjectId(req.user.id)
        )
        if (!userInfo) {
            return res.json({
                success: false,
                message: req.__(
                    'User not found. Cannot proceed with the subscription update.'
                ),
                data: {},
            })
        }

        // Retrieve current active subscription
        let subscription = await subcriptionModel.findOne({
            uid: new mongoose.Types.ObjectId(req.user.id),
            status: 'active',
            type: 'recurring',
        })

        if (!subscription) {
            return res.json({
                success: false,
                message: req.__('No active subscription found for the user.'),
                data: {},
            })
        }

        // Get subscription details from Stripe to find current billing cycle dates
        const subscriptionInfo = await stripe.subscriptions.retrieve(
            subscription.subcription_id
        )

        console.log('privious', subscriptionInfo)
        const billingCycleStart = moment.unix(
            subscriptionInfo.current_period_start
        )
        const billingCycleEnd = moment.unix(subscriptionInfo.current_period_end)
        console.log('billingCycleEnd', billingCycleEnd)
        // Check if an upgrade was done in the current billing cycle
        const updateCount = await subcriptionModel.countDocuments({
            uid: new mongoose.Types.ObjectId(req.user.id),
            type: 'recurring',
            status: 'resume',
            createdAt: {
                $gte: billingCycleStart.toDate(),
                $lt: billingCycleEnd.toDate(),
            },
        })

        if (updateCount > 0) {
            return res.json({
                success: false,
                message: req.__(
                    'Downgrades/Upgrades are only allowed once per billing cycle.'
                ),
                data: {},
            })
        }

        // Get the new plan information
        let planInfo = await planModel.findById(req.body.plan_id)
        if (!planInfo) {
            return res.json({
                success: false,
                message: req.__('The selected plan is invalid or not found.'),
                data: {},
            })
        }

        // Update the subscription in Stripe
        const updatedSubscription = await stripe.subscriptions.update(
            subscription.subcription_id,
            {
                proration_behavior: 'none',
                items: [
                    {
                        id: subscriptionInfo.items.data[0].id,
                        price: planInfo.stripePlanId,
                    },
                ],
                billing_cycle_anchor: 'unchanged',
                payment_settings: { payment_method_types: ['card'] },
            }
        )
        console.log('updatedSubscription', updatedSubscription)

        // Update subscription status in the database to reflect the upgrade
        await subcriptionModel.updateMany(
            {
                uid: new mongoose.Types.ObjectId(req.user.id),
                status: 'active',
                type: 'recurring',
            },
            { $set: { status: 'active', createdAt: new Date() } }
        )

        let startDate = moment.unix(updatedSubscription.current_period_start)
        let endDate = moment.unix(updatedSubscription.current_period_end)

        // Save the new subscription record
        let subscriptionData = await new subcriptionModel({
            uid: req.user.id,
            status: 'resume',
            subcription_id: subscription.subcription_id,
            client_secret: subscription.client_secret,
            invoice_id: updatedSubscription.latest_invoice,
            amount: planInfo.price,
            entries: planInfo.entries,
            plan_id: req.body.plan_id,
            type: 'recurring',
            startDate: startDate,
            endDate: endDate,
        }).save()

        var myentries = await drawEntry.getUserEntry(req.user.id)

        // Send the upgrade invoice email
        if (!userInfo.email) {
            return res.json({
                success: false,
                message: req.__(
                    'Email is missing. Cannot send upgrade invoice.'
                ),
                data: {},
            })
        }

        await sendEmail(
            `${userInfo.firstname} ${userInfo.lastname}`,
            userInfo.email,
            'Subscription Upgrade Invoice Mail',
            `<div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="text-align: right;">INVOICE</h1>
                <p>Invoice No.: ${subscriptionData._id}</p>
                <p>${moment().format('DD MMMM YYYY')}</p>
                <h3>Billed To:</h3>
                <p>${userInfo.firstname} ${userInfo.lastname}</p>
                <p>${userInfo.phone}</p>
                <p>${userInfo.billing_address} (${userInfo.postcode})</p>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="text-align: left;">Plan name</th>
                            <th style="text-align: right;">Quantity</th>
                            <th style="text-align: right;">Entry</th>
                            <th style="text-align: right;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${planInfo.name} (Interval - ${
                planInfo.intervalType
            })</td>
                            <td style="text-align: right;">1</td>
                            <td style="text-align: right;">${
                                planInfo.entries
                            }</td>
                            <td style="text-align: right;">$${
                                planInfo.price
                            }</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" style="text-align: right; font-weight: bold;">Total:</td>
                            <td style="text-align: right;">$${
                                planInfo.price
                            }</td>
                        </tr>
                    </tfoot>
                </table>
                <p>Total Entries: ${myentries}</p>
            </div>`
        )

        return res.json({
            success: true,
            message: req.__('Subscription updated successfully'),
            data: updatedSubscription,
        })
    } catch (err) {
        console.error('updateSubscription Error:', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const subscriptionHistory = async (req, res) => {
    try {
        let subcription = await subcriptionModel.aggregate([
            {
                $match: {
                    uid: new mongoose.Types.ObjectId(req.user.id),
                    status: { $nin: ['pending'] },
                    description: { $ne: 'partner payment' },
                },
            },
            {
                $lookup: {
                    from: 'plans',
                    localField: 'plan_id',
                    foreignField: '_id',
                    as: 'plans',
                },
            },
            {
                $lookup: {
                    from: 'draws',
                    localField: 'draw_id',
                    foreignField: '_id',
                    as: 'draws',
                },
            },
            {
                $unwind: '$plans',
            },
            {
                $unwind: {
                    path: '$draws',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $group: {
                    _id: '$type',
                    subcription: {
                        $push: '$$ROOT',
                    },
                },
            },
        ])
        return res.json({
            success: true,
            message: req.__('subscription history list successfully.'),
            data: subcription,
        })
    } catch (err) {
        console.error('getDraws', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const getDraws = async (req, res) => {
    try {
        let match = {}
        switch (req.query.type) {
            case 'old':
                // match = {
                //     scheduleDate: { $lte: new Date() },
                // }
                match = { randomDrawId: { $exists: true, $ne: '' } }
                break
            case 'upcoming':
                // match = {
                //     scheduleDate: { $gte: new Date() },
                // }
                match = { randomDrawId: '' }
                break
            default:
                break
        }
        let drawList = await drawModel.find(
            match,
            {},
            { sort: { scheduleDate: 1 } }
        )
        drawList = JSON.parse(JSON.stringify(drawList))
        let entry = 0
        if (req.user) {
            let subcription = await subcriptionModel.findOne({
                uid: new mongoose.Types.ObjectId(req.user.id),
                status: 'active',
                type: 'recurring',
            })
            entry = !subcription ? 0 : await drawEntry.getUserEntry(req.user.id)
        }

        for (const key in drawList) {
            drawList[key]['entry'] = entry
            if (req.user) {
                let entrycheck = await subcriptionModel.aggregate([
                    {
                        $match: {
                            draw_id: new mongoose.Types.ObjectId(
                                drawList[key]._id
                            ),
                            uid: new mongoose.Types.ObjectId(req.user.id),
                            status: 'active',
                            type: 'fixed',
                        },
                    },
                    {
                        $group: {
                            _id: '$draw_id',
                            totalEntry: {
                                $sum: '$entries',
                            },
                        },
                    },
                ])

                if (entrycheck[0] && entrycheck[0]['totalEntry'])
                    drawList[key]['entry'] = entry + entrycheck[0]['totalEntry']
            }
        }
        return res.json({
            success: true,
            message: req.__('Get draw list successfully.'),
            data: drawList,
        })
    } catch (err) {
        console.error('getDraws', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const getNotification = async (req, res) => {
    try {
        let notificationList = await notificationModel.find(
            {
                uid: new mongoose.Types.ObjectId(req.user.id),
            },
            {},
            { sort: { createdAt: -1 } }
        )
        return res.json({
            success: true,
            message: req.__('Get notification list successfully.'),
            data: notificationList,
        })
    } catch (err) {
        console.error('getNotification', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const randomdrawsDraw = async (req, res) => {
    try {
        //csv export
        const usersList = await userModel.find(
            {},
            { _id: 1, firstname: 1, lastname: 1, email: 1, phone: 1 }
        )
        const mockData = []
        for (const user of usersList) {
            mockData.push(user)
            let count = await drawEntry.getUserEntry(user._id)
            for (let index = 0; index < count; index++) {
                mockData.push(user)
            }
        }
        let filePath = `public/${Date.now()}.csv`
        const csv = await exportCsv
            .write(JSON.parse(JSON.stringify(mockData)), { headers: true })
            .on('finish', function () {
                console.log('create file')
            })
            .pipe(fs.createWriteStream(filePath))

        const tokenData = await axios.post(
            process.env.RANDOMDRAW_BASEURL + 'tokens',
            {
                email: process.env.RANDOMDRAW_EMAIL,
                password: process.env.RANDOMDRAW_PASS,
            }
        )
        console.log('tokenData', tokenData.data, filePath)
        // upload draw file
        const FormData = require('form-data')
        let data = new FormData()
        data.append('', fs.createReadStream(filePath))

        let fileUpload = await axios.request({
            method: 'post',
            maxBodyLength: Infinity,
            url: process.env.RANDOMDRAW_BASEURL + '/upload',
            headers: {
                Authorization: 'Bearer ' + tokenData.data.token,
                ...data.getHeaders(),
            },
            data: data,
        })
        console.log('fileUpload', fileUpload.data)

        if (fileUpload.data && fileUpload.data.filename) {
            let fileName = fileUpload.data.filename

            // create Draw
            const createDraw = await axios.post(
                process.env.RANDOMDRAW_BASEURL + '/draws',
                {
                    name: 'Bestta DRAW 2',
                    organisation: 'Bestta ORG',
                    uploadFilename: fileName,
                    headerRowsIncluded: true,
                    prizes: [
                        {
                            id: 1,
                            quantity: 1,
                            reserves: 0,
                            description: '$1000 prize',
                        },
                    ],
                    isScheduled: false,
                    scheduleDate: new Date(),
                    timezone: 'Australia/Sydney',
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + tokenData.data.token,
                    },
                }
            )
            console.log('createDraw', createDraw.data)
            let drawId = createDraw.data.drawId

            const confirmDraw = await axios.post(
                process.env.RANDOMDRAW_BASEURL + '/draws/' + drawId,
                {},
                {
                    headers: {
                        Authorization: 'Bearer ' + tokenData.data.token,
                    },
                }
            )
            console.log('confirmDraw', confirmDraw.data)

            const getDraw = await axios.get(
                process.env.RANDOMDRAW_BASEURL + '/draws/' + drawId,
                {
                    headers: {
                        Authorization: 'Bearer ' + tokenData.data.token,
                    },
                }
            )
            console.log('getDraw', getDraw.data)
            return res.json({
                success: true,
                message: req.__('successfully.'),
                data: getDraw.data,
            })
        } else {
            return res.json({
                success: false,
                message: req.__('Internal Server Error'),
                data: fileUpload.data,
            })
        }
    } catch (err) {
        console.error('randomdrawsDraw', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const stripeWebhook = async (req, res) => {
    try {
        const endpointSecret = 'whsec_I09PgPlKGXAvjS5Xl8B7anM14Mx0V8Tz'
        const sig = req.headers['stripe-signature']

        let event = req.body

        // Handle the event
        switch (event.type) {
            case 'customer.subscription.updated':
                const updatedSubscription = event.data.object

                let subcriptioncheck = await subcriptionModel.findOne({
                    invoice_id: updatedSubscription.latest_invoice,
                })
                if (!subcriptioncheck) {
                    let subcriptionInfo = await subcriptionModel.findOne({
                        subcription_id: updatedSubscription.id,
                        status: 'active',
                        type: 'recurring',
                    })

                    await subcriptionModel.updateMany(
                        {
                            subcription_id: updatedSubscription.id,
                            invoice_id: {
                                $ne: updatedSubscription.latest_invoice,
                            },
                            status: 'active',
                        },
                        {
                            $set: {
                                status: 'update',
                            },
                        }
                    )

                    let startDate = moment.unix(
                        updatedSubscription.current_period_start
                    )
                    let endDate = moment.unix(
                        updatedSubscription.current_period_end
                    )
                    let obj = {
                        uid: subcriptionInfo.uid,
                        status: 'active',
                        subcription_id: updatedSubscription.id,
                        client_secret: updatedSubscription.latest_invoice,
                        invoice_id: updatedSubscription.latest_invoice,
                        amount: subcriptionInfo.amount,
                        entries: subcriptionInfo.entries,
                        plan_id: subcriptionInfo.plan_id,
                        type: 'recurring',
                        startDate: startDate,
                        endDate: endDate,
                    }

                    await new subcriptionModel(obj).save()
                }
                break
            default:
                console.log(`Unhandled event type ${event.type}`)
        }
        return res.json({
            success: true,
            message: req.__('successfully.'),
            // data: subscriptionInfo,
        })
    } catch (err) {
        console.error('stripeWebhook', err)
        return res.status(400).json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const getStaticContentController = async (req, res) => {
    try {
        let data = await staticContentModel.findOne({ type: req.query.type })
        return res.json({
            success: true,
            message: req.__('data get successfully.'),
            data: data,
        })
    } catch (err) {
        console.error('getStaticContentController', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const addPartner = async (req, res) => {
    try {
        const { error } = addPartnerValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })

        const exist = await userModel.findOne({ email: req.body.email })
        if (exist && exist.isStatus !== 'pending') {
            return res.json({
                success: false,
                message: req.__(`User with ${req.body.email} already exists`),
                data: {},
            })
        } else {
            await userModel.deleteOne({ email: req.body.email })
        }

        const partExist = await partnerModel.findOne({ email: req.body.email })
        if (partExist && partExist.status !== 'pending') {
            return res.json({
                success: false,
                message: req.__(
                    `partner with ${req.body.email} already exists`
                ),
                data: {},
            })
        } else {
            await partnerModel.deleteOne({ email: req.body.email })
        }

        let passwordHash = await bcrypt.hash(
            req.body.password,
            Number(process.env.BCRYPT_SALTROUND)
        )

        let categoryId = ''
        if (req.body.other_category) {
            let categoryAdded = await businessCategoryModel({
                name: req.body.other_category,
            }).save()

            categoryId = categoryAdded._id
        } else if (req.body.category) {
            categoryId = req.body.category
        }

        let partnerObj = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            abn: req.body.abn,
            bussiness_name: req.body.bussiness_name,
            bussiness_url: req.body.bussiness_url,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            password: passwordHash,
            category: categoryId,
        }
        if (req.file && req.file.path) {
            partnerObj['image'] = req.file.path
        }
        let data = await partnerModel(partnerObj).save()

        let planInfo = await planModel.findOne({
            stripePlanId: 'plan_PdIrWFLxjB1aR4',
        })
        // get the price
        const price = await stripe.prices.retrieve(planInfo.stripePlanId)

        const customer = await stripe.customers.create({
            email: req.body.email,
        })
        // console.log('partnerModel save - ', data)
        stripeCustomerId = customer.id
        await partnerModel.findByIdAndUpdate(data._id, {
            $set: { stripeCustomerId: stripeCustomerId },
        })

        let subscription_id = ''
        let client_secret = ''
        let plan_type = ''
        let startDate = moment()
        let endDate = moment()
        let invoice_id = ''
        // check if the price is recurring or not
        if (price.recurring !== null) {
            let subscription = await stripe.subscriptions.create({
                customer: stripeCustomerId,
                items: [
                    {
                        price: 'plan_PdIrWFLxjB1aR4',
                    },
                ],
                add_invoice_items: [
                    {
                        price: 'price_1PtOvtBOmjdVCHS9AkQtADGg',
                    },
                ],
                payment_behavior: 'default_incomplete',
                expand: ['latest_invoice.payment_intent'],
                payment_settings: {
                    save_default_payment_method: 'on_subscription',
                },
            })
            // console.log('subscription -----', subscription)
            subscription_id = subscription.id
            client_secret =
                subscription.latest_invoice.payment_intent.client_secret
            plan_type = 'recurring'
            startDate = moment.unix(subscription.current_period_start)
            endDate = moment.unix(subscription.current_period_end)
            invoice_id = subscription.latest_invoice.id

            let obj = {
                uid: data._id,
                subcription_id: subscription_id,
                client_secret: client_secret,
                invoice_id: invoice_id,
                entries: planInfo.entries,
                amount: planInfo.price,
                plan_id: planInfo._id,
                type: plan_type,
                startDate: startDate,
                endDate: endDate,
            }
            new subcriptionModel(obj).save()

            let obj1 = {
                uid: data._id,
                subcription_id: subscription_id,
                client_secret: client_secret,
                invoice_id: invoice_id,
                entries: 0,
                plan_id: planInfo._id,
                amount: '99',
                type: 'fixed',
                startDate: moment(),
                endDate: moment(),
                description: 'partner payment',
            }
            new subcriptionModel(obj1).save()
            return res.json({
                success: true,
                message: req.__('partner added successfully'),
                data: {
                    subscriptionId: subscription_id,
                    clientSecret: client_secret,
                    data: data,
                    subscription: subscription,
                },
            })
        }
    } catch (err) {
        console.error('addPartner', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const partnerStatus = async (req, res) => {
    try {
        const { error } = paymentStatusValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })

        const subcriptionInfo = await subcriptionModel
            .findOne({
                client_secret: req.body.client_secret,
            })
            .populate('plan_id')
        const planInfo = subcriptionInfo.plan_id
        if (subcriptionInfo) {
            let partnerInfo = await partnerModel.findOneAndUpdate(
                {
                    $or: [
                        {
                            _id: new mongoose.Types.ObjectId(
                                subcriptionInfo.uid
                            ),
                        },
                        {
                            uid: new mongoose.Types.ObjectId(
                                subcriptionInfo.uid
                            ),
                        },
                    ],
                },
                { $set: { status: 'active' } }
            )
            if (partnerInfo && partnerInfo.uid) {
                let subcriptionInfo1 = await subcriptionModel.updateMany(
                    { client_secret: req.body.client_secret },
                    { $set: { status: 'active' } }
                )
                return res.json({
                    success: true,
                    message: req.__('Payment received successfully'),
                    data: {},
                })
            }

            if (partnerInfo) {
                let userObj = {
                    firstname: partnerInfo.firstname,
                    lastname: partnerInfo.lastname,
                    phone: partnerInfo.phone,
                    email: partnerInfo.email,
                    password: partnerInfo.password,
                    stripeCustomerId: partnerInfo.stripeCustomerId,
                    isStatus: 'active',
                }

                let user = await userModel(userObj).save()
                const updatePartner = await partnerModel.findByIdAndUpdate(
                    { _id: partnerInfo._id },
                    {
                        $set: {
                            uid: user._id,
                        },
                    }
                )
                let subcriptionInfo1 = await subcriptionModel.updateMany(
                    { client_secret: req.body.client_secret },
                    { $set: { status: 'active', uid: user._id } }
                )
                var myentries = await drawEntry.getUserEntry(user._id)
                await sendEmail(
                    user.firstname + ' ' + user.lastname,
                    user.email,
                    'Thankyou for join with us',
                    `<p>We are delighted to welcome you to the bestta family!</p><p>If you have any questions or require assistance, please do not hesitate to contact our support team.</p><p>Thank you for being part of our vision.</p>`
                )

                await sendEmail(
                    user.firstname + ' ' + user.lastname,
                    user.email,
                    'Subscription invoice mail',
                    `<div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: right;">
                        <h1 style="margin: 0;">INVOICE</h1>
                        <p style="margin: 5px 0;">Invoice No. ${
                            subcriptionInfo1._id
                        }</p>
                        <p style="margin: 5px 0;">${moment().format(
                            'DD MMMM YYYY'
                        )}</p>
                    </div>
    
                    <div style="margin: 20px 0;">
                        <h3 style="margin: 0;">Billed To:</h3>
                        <p style="margin: 5px 0;">${user.firstname}  ${
                        user.lastname
                    }</p>
                        <p style="margin: 5px 0;">${user.phone}</p>
                    </div>
    
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="border-bottom: 2px solid #ddd; padding: 8px 0; text-align: left;">Plan name</th>
                                <th style="border-bottom: 2px solid #ddd; padding: 8px 0; text-align: right;">Quantity</th>
                                <th style="border-bottom: 2px solid #ddd; padding: 8px 0; text-align: right;">Entry</th>
                                <th style="border-bottom: 2px solid #ddd; padding: 8px 0; text-align: right;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${
                                    planInfo.name
                                }( Interval - ${planInfo.intervalType})</td>
                                <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">1</td>
                                <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">${
                                    planInfo.entries
                                }</td>
                                <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">$${
                                    planInfo.price
                                }</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3" style="padding: 8px 0; text-align: right; font-weight: bold;">Total:-</td>
                                <td style="padding: 8px 0; text-align: right;">$${
                                    planInfo.price
                                }</td>
                            </tr>
                        </tfoot>
                    </table>
                    <p>Total Entries - ${myentries}</p>
                </div>`
                )

                return res.json({
                    success: true,
                    message: req.__('Payment received successfully'),
                    data: subcriptionInfo1,
                })
            } else {
                return res.json({
                    success: false,
                    message: req.__('Payment intent not match'),
                    data: {},
                })
            }
        } else {
            return res.json({
                success: false,
                message: req.__('Payment intent not match'),
                data: {},
            })
        }
    } catch (err) {
        console.error('partnerStatus', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}
const adminpartnerStatus = async (req, res) => {
    try {
        const { error } = paymentStatusValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })

        const subcriptionInfo = await subcriptionModel
            .findOne({
                client_secret: req.body.client_secret,
            })
            .populate('plan_id')

        console.log('subcriptionInfo', subcriptionInfo)
        if (subcriptionInfo) {
            console.log(subcriptionInfo.uid)
            const result = await partnerModel.updateOne(
                { uid: subcriptionInfo.uid }, // Filter criteria
                { $set: { status: 'active' } } // Update operation
            )
            let partnerInfo = await userModel.findOneAndUpdate(
                {
                    _id: new mongoose.Types.ObjectId(subcriptionInfo.uid),
                },
                { $set: { status: 'active' } }
            )

            if (partnerInfo) {
                const userInfo = await userModel.findOne({
                    email: partnerInfo.email,
                })

                let user = await userModel.updateOne(
                    { _id: userInfo._id },
                    {
                        $set: {
                            stripeCustomerId: partnerInfo.stripeCustomerId,
                            isPayment: 'true',
                            isPartnerPayment: 'true',
                        },
                    }
                )
                let subcriptionInfo1 = await subcriptionModel.updateMany(
                    { client_secret: req.body.client_secret },
                    { $set: { status: 'active', uid: user._id } }
                )
                var myentries = await drawEntry.getUserEntry(user._id)

                // await sendEmail(
                //     userInfo.firstname + ' ' + userInfo.lastname,
                //     userInfo.email,
                //     'Subscription invoice mail',
                //     `<div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                //     <div style="text-align: right;">
                //         <h1 style="margin: 0;">INVOICE</h1>
                //         <p style="margin: 5px 0;">Invoice No. ${
                //             subcriptionInfo1._id
                //         }</p>
                //         <p style="margin: 5px 0;">${moment().format(
                //             'DD MMMM YYYY'
                //         )}</p>
                //     </div>

                //     <div style="margin: 20px 0;">
                //         <h3 style="margin: 0;">Billed To:</h3>
                //         <p style="margin: 5px 0;">${userInfo.firstname}  ${
                //         user.lastname
                //     }</p>
                //         <p style="margin: 5px 0;">${userInfo.phone}</p>
                //     </div>

                //     <table style="width: 100%; border-collapse: collapse;">
                //         <thead>
                //             <tr>
                //                 <th style="border-bottom: 2px solid #ddd; padding: 8px 0; text-align: left;">Plan name</th>
                //                 <th style="border-bottom: 2px solid #ddd; padding: 8px 0; text-align: right;">Quantity</th>
                //                 <th style="border-bottom: 2px solid #ddd; padding: 8px 0; text-align: right;">Entry</th>
                //                 <th style="border-bottom: 2px solid #ddd; padding: 8px 0; text-align: right;">Price</th>
                //             </tr>
                //         </thead>
                //         <tbody>
                //             <tr>
                //                 <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${
                //                     planInfo?.name
                //                 }( Interval - ${planInfo.intervalType})</td>
                //                 <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">1</td>
                //                 <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">${
                //                     planInfo?.entries
                //                 }</td>
                //                 <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">$${
                //                     planInfo?.price
                //                 }</td>
                //             </tr>
                //         </tbody>
                //         <tfoot>
                //             <tr>
                //                 <td colspan="3" style="padding: 8px 0; text-align: right; font-weight: bold;">Total:-</td>
                //                 <td style="padding: 8px 0; text-align: right;">$${
                //                     planInfo.price
                //                 }</td>
                //             </tr>
                //         </tfoot>
                //     </table>
                //     <p>Total Entries - ${myentries}</p>
                // </div>`
                // )
                return res.json({
                    success: true,
                    message: req.__('Payment received successfully'),
                    data: subcriptionInfo1,
                })
            } else {
                return res.json({
                    success: false,
                    message: req.__('Payment intent not match'),
                    data: {},
                })
            }
        } else {
            return res.json({
                success: false,
                message: req.__('Payment intent not match'),
                data: {},
            })
        }
    } catch (err) {
        console.error('partnerStatus', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}
const getDrawUserList = async (req, res) => {
    let drawDetail = await drawModel.findOne({
        _id: new mongoose.Types.ObjectId(req.body.draw_id),
    })
    if (!drawDetail) {
        return res.json({
            success: false,
            message: req.__('Draw not found, please check'),
            data: {},
        })
    }
    if (drawDetail && drawDetail.randomDrawId != '') {
        return res.json({
            success: false,
            message: req.__('Draw already done, please check'),
            data: {},
        })
    }
    const usersList = await userModel.find(
        {},
        { _id: 1, firstname: 1, lastname: 1, email: 1, phone: 1 }
    )
    const drawParti = []
    if (usersList) {
        for (const user of usersList) {
            let count = await drawEntry.getUserEntry(user._id)
            if (count > 0) {
                drawParti.push(user.firstname + ' ' + user.lastname)
            }
        }

        return res.json({
            success: true,
            message: req.__('Participant List.'),
            data: { userList: drawParti },
        })
    } else {
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const getWinner = async (req, res) => {
    try {
        let drawDetail = await drawModel.findOne({
            _id: new mongoose.Types.ObjectId(req.body.draw_id),
        })
        if (!drawDetail) {
            return res.json({
                success: false,
                message: req.__('Draw not found, please check'),
                data: {},
            })
        }
        if (drawDetail && drawDetail.randomDrawId) {
            return res.json({
                success: true,
                message: req.__('get Winner successfully.'),
                data: { winners: drawDetail.winner },
            })
        } else {
            const usersList = await userModel.find(
                {},
                { _id: 1, firstname: 1, lastname: 1, email: 1, phone: 1 }
            )

            const mockData = []
            const drawParti = []
            for (const user of usersList) {
                let count = await drawEntry.getUserEntry(user._id)
                if (count > 0) {
                    drawParti.push(user.firstname + ' ' + user.lastname)
                    mockData.push(user)
                }

                // for (let index = 0; index < count; index++) {
                //     mockData.push(user)
                // }
            }
            let filePath = `public/${Date.now()}.csv`
            const csv = await exportCsv
                .write(JSON.parse(JSON.stringify(mockData)), { headers: true })
                .on('finish', function () {
                    console.log('create file')
                })
                .pipe(fs.createWriteStream(filePath))

            const tokenData = await axios.post(
                process.env.RANDOMDRAW_BASEURL + 'tokens',
                {
                    email: process.env.RANDOMDRAW_EMAIL,
                    password: process.env.RANDOMDRAW_PASS,
                }
            )
            console.log('tokenData', tokenData.data, filePath)
            // upload draw file
            const FormData = require('form-data')
            let data = new FormData()
            data.append('', fs.createReadStream(filePath))

            let fileUpload = await axios.request({
                method: 'post',
                maxBodyLength: Infinity,
                url: process.env.RANDOMDRAW_BASEURL + '/upload',
                headers: {
                    Authorization: 'Bearer ' + tokenData.data.token,
                    ...data.getHeaders(),
                },
                data: data,
            })
            console.log('fileUpload', fileUpload.data)

            if (fileUpload.data && fileUpload.data.filename) {
                let fileName = fileUpload.data.filename

                // create Draw
                const createDraw = await axios.post(
                    process.env.RANDOMDRAW_BASEURL + '/draws',
                    {
                        name: drawDetail.name,
                        organisation: 'Bestta Investors Club',
                        uploadFilename: fileName,
                        headerRowsIncluded: true,
                        prizes: drawDetail.prizes,
                        isScheduled: false,
                        scheduleDate: new Date(),
                        timezone: 'Australia/Sydney',
                    },
                    {
                        headers: {
                            Authorization: 'Bearer ' + tokenData.data.token,
                        },
                    }
                )
                console.log('createDraw', createDraw.data)
                let drawId = createDraw.data.drawId

                const confirmDraw = await axios.post(
                    process.env.RANDOMDRAW_BASEURL + '/draws/' + drawId,
                    {},
                    {
                        headers: {
                            Authorization: 'Bearer ' + tokenData.data.token,
                        },
                    }
                )
                console.log('confirmDraw', confirmDraw)

                const getDraw = await axios.get(
                    process.env.RANDOMDRAW_BASEURL + '/draws/' + drawId,
                    {
                        headers: {
                            Authorization: 'Bearer ' + tokenData.data.token,
                        },
                    }
                )

                let winnerArr = []
                for (var winner of getDraw.data.prizes) {
                    if (winner.description.indexOf('Reserve:') < 0) {
                        const winnerData = winner.winners[0].text.split(',')
                        winnerArr.push({
                            _id: winnerData[0],
                            firstname: winnerData[1],
                            lastname: winnerData[2],
                            email: winnerData[3],
                            phone: winnerData[4],
                            description: winner.description,
                        })
                    }
                }

                let winnerArrs = []
                for (var winner of getDraw.data.prizes) {
                    if (winner.description.indexOf('Reserve:') < 0) {
                        const winnerData = winner.winners[0].text.split(',')
                        winnerArrs.push({
                            name: `${winnerData[1]} ${winnerData[2]}`,
                            prize: winner.description,
                        })
                    }
                }
                let pastWinnerObj = {
                    winners: winnerArrs,
                    year: moment().year(),
                    image: drawDetail.image,
                }

                await pastWinnerModel(pastWinnerObj).save()
                await drawModel.updateOne(
                    { _id: new mongoose.Types.ObjectId(req.body.draw_id) },
                    {
                        $set: {
                            randomDrawId: drawId,
                            randomData: getDraw.data,
                            winner: winnerArr,
                        },
                    }
                )
                return res.json({
                    success: true,
                    message: req.__('get Winner successfully.'),
                    data: { winners: winnerArr },
                })
            } else {
                console.error('getWinner', err)
                return res.json({
                    success: false,
                    message: req.__('Internal Server Error'),
                    data: {},
                })
            }
        }
    } catch (err) {
        console.error('getWinner', err)
        return res.json({
            success: false,
            message: req.__(
                'No credits available to use. Please purchase more and try again.'
            ),
            data: err,
        })
    }
}

const getPartner = async (req, res) => {
    try {
        let match = {}

        if (req.query.type == 'address') {
            match['address'] = { $regex: req.query.search, $options: 'i' }
        }
        if (req.query.type == 'city') {
            match['city'] = { $regex: req.query.search, $options: 'i' }
        }
        if (req.query.type == 'state') {
            match['state'] = { $regex: req.query.search, $options: 'i' }
        }
        if (req.query.type == 'country') {
            match['country'] = { $regex: req.query.search, $options: 'i' }
        }
        if (req.query.type == 'all') {
            match['$or'] = [
                { address: { $regex: req.query.search, $options: 'i' } },
                { city: { $regex: req.query.search, $options: 'i' } },
                { state: { $regex: req.query.search, $options: 'i' } },
                { country: { $regex: req.query.search, $options: 'i' } },
                {
                    'categoryData.name': {
                        $regex: req.query.search,
                        $options: 'i',
                    },
                },
            ]
        }
        if (req.query.type == 'category') {
            match = {
                'categoryData.name': {
                    $regex: req.query.search,
                    $options: 'i',
                },
            }
        }
        let partnerList = await partnerModel.aggregate([
            {
                $match: {
                    status: 'active',
                    category: {
                        $exists: true,
                    },
                },
            },
            {
                $lookup: {
                    from: 'businesscategories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'categoryData',
                },
            },
            {
                $match: match,
            },
        ])
        // .find(match)
        // .populate('category', {}, { name: 'car' })
        return res.json({
            success: true,
            message: req.__('get partner successfully.'),
            data: partnerList,
        })
    } catch (err) {
        console.error('getPartner', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

// const getPartner = async (req, res) => {
//     try {
//         let match = {};

//         // Check if the request query type matches address, city, state, or country
//         if (req.query.type === 'address') {
//             match['address'] = { $regex: req.query.search, $options: 'i' };
//         }
//         if (req.query.type === 'city') {
//             match['city'] = { $regex: req.query.search, $options: 'i' };
//         }
//         if (req.query.type === 'state') {
//             match['state'] = { $regex: req.query.search, $options: 'i' };
//         }
//         if (req.query.type === 'country') {
//             match['country'] = { $regex: req.query.search, $options: 'i' };
//         }
//         if (req.query.type === 'all') {
//             match['$or'] = [
//                 { address: { $regex: req.query.search, $options: 'i' } },
//                 { city: { $regex: req.query.search, $options: 'i' } },
//                 { state: { $regex: req.query.search, $options: 'i' } },
//                 { country: { $regex: req.query.search, $options: 'i' } },
//                 {
//                     'categoryData.name': {
//                         $regex: req.query.search,
//                         $options: 'i',
//                     },
//                 },
//             ];
//         }
//         if (req.query.type === 'category') {
//             match = {
//                 'categoryData.name': {
//                     $regex: req.query.search,
//                     $options: 'i',
//                 },
//             };
//         }

//         let partnerList = await partnerModel.aggregate([
//             {
//                 $match: {
//                     status: 'active',
//                     category: { $exists: true },
//                 },
//             },
//             {
//                 $lookup: {
//                     from: 'businesscategories',
//                     localField: 'category',
//                     foreignField: '_id',
//                     as: 'categoryData',
//                 },
//             },
//             {
//                 $lookup: {
//                     from: 'users',  // Adjust the collection name as needed
//                     localField: 'stripeCustomerId',
//                     foreignField: 'stripeCustomerId',
//                     as: 'userData',
//                 },
//             },
//             {
//                 $unwind: '$userData',  // Unwind userData to perform the match
//             },
//             {
//                 $match: {
//                     ...match,
//                     $expr: {
//                         $or: [
//                             { $ne: ['$userData.isPayment', 'false'] },
//                             {
//                                 $and: [
//                                     { $eq: ['$userData.isPartner', 'true'] },
//                                     { $eq: ['$userData.isPartnerPayment', 'true'] },
//                                 ],
//                             },
//                         ],
//                     },
//                 },
//             },
//             {
//                 $group: {
//                     _id: '$_id', // Group by unique partner _id
//                     firstname: { $first: '$firstname' },
//                     lastname: { $first: '$lastname' },
//                     bussiness_name: { $first: '$bussiness_name' },
//                     bussiness_url: { $first: '$bussiness_url' },
//                     email: { $first: '$email' },
//                     phone: { $first: '$phone' },
//                     abn: { $first: '$abn' },
//                     image: { $first: '$image' },
//                     address: { $first: '$address' },
//                     city: { $first: '$city' },
//                     state: { $first: '$state' },
//                     country: { $first: '$country' },
//                     zip_code: { $first: '$zip_code' },
//                     stripeCustomerId: { $first: '$stripeCustomerId' },
//                     category: { $first: '$category' },
//                     status: { $first: '$status' },
//                     uid: { $first: '$uid' },
//                     webPartner: { $first: '$webPartner' },
//                     createdAt: { $first: '$createdAt' },
//                     updatedAt: { $first: '$updatedAt' },
//                     categoryData: { $first: '$categoryData' },
//                 },
//             },
//         ]);

//         return res.json({
//             success: true,
//             message: req.__('get partner successfully.'),
//             data: partnerList,
//         });
//     } catch (err) {
//         console.error('getPartner', err);
//         return res.json({
//             success: false,
//             message: req.__('Internal Server Error'),
//             data: {},
//         });
//     }
// };

const getPastWinner = async (req, res) => {
    try {
        let match = {}
        if (req.query.search) {
            match = {
                $or: [{ name: { $regex: req.query.search, $options: 'i' } }],
            }
        }
        let pastWinnerList = await pastWinnerModel.find(
            match,
            {},
            { sort: { year: -1 } }
        )
        return res.json({
            success: true,
            message: req.__('Get past winner list successfully.'),
            data: pastWinnerList,
        })
    } catch (err) {
        console.error('getPastWinner', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const getFaq = async (req, res) => {
    try {
        let match = {}
        if (req.query.search) {
            match = {
                $or: [
                    { question: { $regex: req.query.search, $options: 'i' } },
                    { answer: { $regex: req.query.search, $options: 'i' } },
                ],
            }
        }
        let faqList = await faqModel.aggregate([
            { $match: match },
            { $project: { title: '$question', content: '$answer' } },
        ])
        return res.json({
            success: true,
            message: req.__('Get faq list successfully.'),
            data: faqList,
        })
    } catch (err) {
        console.error('getFaq', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const getBusinessCategory = async (req, res) => {
    try {
        let businessCategoryList = await businessCategoryModel.find({})
        return res.json({
            success: true,
            message: req.__('Get business category list successfully.'),
            data: businessCategoryList,
        })
    } catch (err) {
        console.error('getBusinessCategory', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const applyDrawEntry = async (req, res) => {
    try {
        let subcription = await subcriptionModel.findOne({
            _id: new mongoose.Types.ObjectId(req.body.subcription_id),
            uid: new mongoose.Types.ObjectId(req.user.id),
            status: { $nin: ['pending'] },
        })
        if (subcription && subcription?.draw_id && subcription.draw_id != '') {
            return res.json({
                success: false,
                message: req.__(
                    'This subscription is already associated with another draw.'
                ),
                data: {},
            })
        }
        let subcriptionUpdate = await subcriptionModel.updateOne(
            {
                _id: new mongoose.Types.ObjectId(req.body.subcription_id),
                uid: new mongoose.Types.ObjectId(req.user.id),
                status: { $nin: ['pending'] },
            },
            { $set: { draw_id: new mongoose.Types.ObjectId(req.body.draw_id) } }
        )
        return res.json({
            success: true,
            message: req.__('Draw entries applied successfully'),
            data: {},
        })
    } catch (err) {
        console.error('applyDrawEntry', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const storeStatus = async (req, res) => {
    try {
        let storeStatus = await storeStatusModel.findOne()
        return res.json({
            success: true,
            message: req.__('store status get successfully'),
            data: storeStatus,
        })
    } catch (err) {
        console.error('storeStatus', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const becomeAPartner = async (req, res) => {
    try {
        const userInfo = await userModel.findOne({
            _id: new mongoose.Types.ObjectId(req.user.id),
        })

        const partExist = await partnerModel.findOne({ email: userInfo.email })
        if (partExist && partExist.status !== 'pending') {
            return res.json({
                success: false,
                message: req.__(`you are already partner`),
                data: {},
            })
        } else {
            await partnerModel.deleteOne({ email: req.body.email })
        }

        let subcriptionInfo = await subcriptionModel.findOne({
            uid: new mongoose.Types.ObjectId(req.user.id),
            status: 'active',
            type: 'recurring',
        })

        if (!subcriptionInfo)
            return res.json({
                success: false,
                message: req.__(
                    'To become a partner user must be Accumulating or Mentoring member'
                ),
                data: {},
            })

        let categoryId = ''
        if (req.body.other_category) {
            let categoryAdded = await businessCategoryModel({
                name: req.body.other_category,
            }).save()

            categoryId = categoryAdded._id
        } else if (req.body.category) {
            categoryId = req.body.category
        }

        let partnerObj = {
            firstname: userInfo.firstname,
            lastname: userInfo.lastname,
            abn: req.body.abn,
            bussiness_name: req.body.bussiness_name,
            bussiness_url: req.body.bussiness_url,
            phone: userInfo.phone,
            email: userInfo.email,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            category: categoryId,
            uid: userInfo._id,
            stripeCustomerId: userInfo.stripeCustomerId,
            webPartner: 'true',
        }
        if (req.file && req.file.path) {
            partnerObj['image'] = req.file.path
        }
        let data = await partnerModel(partnerObj).save()

        await userModel.findByIdAndUpdate(
            { _id: req.user.id },
            {
                $set: {
                    isPartner: 'true',
                },
            }
        )

        // let subscription_id = ''
        // let client_secret = ''
        // let invoice_id = ''
        // let subscription = await stripe.subscriptions.create({
        //     customer: userInfo.stripeCustomerId,
        //     items: [
        //         {
        //             price: 'price_1PtOvtBOmjdVCHS9AkQtADGg',
        //         },
        //     ],
        //     payment_behavior: 'default_incomplete',
        //     expand: ['latest_invoice.payment_intent'],
        //     payment_settings: {
        //         save_default_payment_method: 'on_subscription',
        //     },
        // })
        // // console.log('subscription -----', subscription)

        const paymentIntent = await stripe.paymentIntents.create({
            amount: 99 * 100,
            currency: 'AUD',
            payment_method_types: ['card'],
        })

        subscription_id = paymentIntent.id
        client_secret = paymentIntent.client_secret
        invoice_id = paymentIntent.id

        let obj1 = {
            uid: userInfo._id,
            subcription_id: subscription_id,
            client_secret: client_secret,
            invoice_id: invoice_id,
            entries: 0,
            plan_id: subcriptionInfo.plan_id, //planInfo._id,
            amount: '99',
            type: 'fixed',
            startDate: moment(),
            endDate: moment(),
            description: 'partner payment',
        }
        new subcriptionModel(obj1).save()
        console.log(client_secret, subscription_id)
        return res.json({
            success: true,
            message: req.__('partner added successfully'),
            data: {
                subscriptionId: subscription_id,
                clientSecret: client_secret,
                data: data,
                subscription: paymentIntent,
            },
        })
    } catch (err) {
        console.error('addPartner', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

module.exports = {
    getProduct,
    getProductById,
    getCategory,
    addCart,
    removeCartItem,
    getCart,
    applyCoupon,
    removeCoupon,
    placeOrder,
    getBanner,
    getCourseCategory,
    getCourse,
    paymentStatus,
    getPlans,
    getPlanCategory,
    getMyOrder,
    reviewRating,
    subscriptionCheckout,
    subscriptionStatus,
    cancelSubscription,
    updateSubscription,
    subscriptionHistory,
    getDraws,
    getNotification,
    randomdrawsDraw,
    stripeWebhook,
    getStaticContentController,
    addPartner,
    partnerStatus,
    getPartner,
    getWinner,
    getDrawUserList,
    getSuggestedProduct,
    getPastWinner,
    getFaq,
    getBusinessCategory,
    applyDrawEntry,
    storeStatus,
    deleteUserAcount,
    adminpartnerStatus,
    becomeAPartner,
}
