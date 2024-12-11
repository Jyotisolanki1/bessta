const {
    addProductValidation,
    updateProductValidation,
    addCategoryValidation,
    updateCategoryValidation,
    addCouponValidation,
    updateCouponValidation,
    addCourseCategoryValidation,
    updateCourseCategoryValidation,
    addCourseValidation,
    updateCourseValidation,
    addPlanValidation,
    updatePlanValidation,
    addDrawValidation,
    editDrawValidation,
    idValueValidation,
    typeValidation,
    deleteProductValidation,
    updateOrderStatusValidation,
    mailValidation,
    addPartnerValidation,
    forgetPasswordValidation,
    resetPasswordValidation,
} = require('../helpers/validationSchema')
const productModel = require('../models/productModel')
const orderModel = require('../models/orderModel')
const categoryModel = require('../models/categoryModel')
const couponModel = require('../models/couponModel')
const courseModel = require('../models/courseModel')
const courseCategoryModel = require('../models/courseCategoryModel')
const planCategoryModel = require('../models/planCategoryModel')
const planModel = require('../models/planModel')
const drawModel = require('../models/drawModel')
const notificationModel = require('../models/notificationModel')
const userModel = require('../models/userModel')
const adminModel = require('../models/adminModel')
const staticContentModel = require('../models/staticContentModel')
const helpCenterModel = require('../models/helpCenterModel')
const partnerModel = require('../models/partnerModel')
const pastWinnerModel = require('../models/pastWinnerModel')
const faqModel = require('../models/faqModel')
const subcriptionModel = require('../models/subcriptionModel')
const storeStatusModel = require('../models/storeStatusModel')

const drawEntry = require('../helpers/drawEntry')
const moment = require('moment')
const { sendEmail } = require('../librarys/sendEmail')

const pushNotification = require('../librarys/pushNotification')
const exportCsv = require('fast-csv')
const fs = require('fs')

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const {
    generateTokens,
    generateTempTokens,
} = require('../helpers/generateTokens')
const BusinessCategoryModel = require('../models/businessCategoryModel')

const users = [
    {
        name: 'jyoti',
        email: 'jyotisolankics29@gmail.com',
        status: 'subscribed',
    },
    { name: 'Bob', email: 'danish2@mailinator.com', status: 'unsubscribed' },
]

const verifyAdmin = async (req, res) => {
    try {
        var result = await adminModel.findOne({ email: req.body.email }, {})
        if (result != null) {
            var match = await bcrypt.compare(req.body.password, result.password)
            if (match) {
                let otp = (Math.floor(Math.random() * 10000) + 10000)
                    .toString()
                    .substring(1)
                let tempToken = await generateTempTokens({
                    id: result._id,
                    email: result.email,
                    name: result.username,
                    otp: otp,
                })
                await sendEmail(
                    result.username,
                    result.email,
                    'Admin login verification',
                    `Admin login otp is ${otp}`
                )
                return res.json({
                    success: true,
                    message: req.__('OTP sent successfully on the email.'),
                    data: { otp: otp, accessToken: tempToken.accessToken },
                })
            } else {
                return res.json({
                    success: false,
                    message: res.__('Invalid Email or Password.'),
                    data: {},
                })
            }
        } else {
            return res.json({
                success: false,
                message: res.__('Invalid Email or Password.'),
                data: {},
            })
        }
    } catch (err) {
        console.error('loginController', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const resendOtpMail = async (req, res) => {
    try {
        console.log('req.userTemp', req.userTemp)
        if (req?.userTemp?.type === 'forgot') {
            let otp = (Math.floor(Math.random() * 10000) + 10000)
                .toString()
                .substring(1)
            const admin = await adminModel.findOne({
                email: req.userTemp.email,
            })
            let tempToken = await generateTempTokens({
                id: admin._id,
                email: admin.email,
                name: admin.username,
                otp: otp,
                type: 'forgot',
            })
            await sendEmail(
                admin.username,
                admin.email,
                'OTP Verification.',
                `<p>Your OTP to verify the account - ${otp}</p>`
            )

            return res.json({
                success: true,
                message: req.__('OTP resent successfully, please check Mail'),
                data: { otp: otp, accessToken: tempToken.accessToken },
            })
        }
        const admin = await adminModel.findOne({ email: req.userTemp.email })

        let otp = (Math.floor(Math.random() * 10000) + 10000)
            .toString()
            .substring(1)
        let tempToken = await generateTempTokens({
            id: admin._id,
            email: admin.email,
            name: admin.username,
            otp: otp,
        })
        await sendEmail(
            admin.username,
            admin.email,
            'Admin login opt verification.',
            `<p>Your OTP to verify the account - ${otp}</p>`
        )

        return res.json({
            success: true,
            message: req.__('OTP resent successfully, please check Mail'),
            data: { otp: otp, accessToken: tempToken.accessToken },
        })
    } catch (err) {
        console.error('resendOtpMail', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}
const verifyOtp = async (req, res) => {
    try {
        if (req?.body?.data?.otp != req.userTemp.otp) {
            return res.json({
                success: false,
                message: req.__('Please enter the valid code'),
                data: {},
            })
        }
        console.log(req?.userTemp?.type)
        if (req?.userTemp?.type === 'forgot') {
            console.log('foijiuyyugu')
            var result = await adminModel.findOne(
                { email: req.userTemp.email },
                {}
            )
            if (result != null) {
                if (result) {
                    let params = {
                        id: result._id,
                        email: result.email,
                        name: result.username,
                        user_type: result.user_type,
                        type: 'forgot',
                    }
                    let accessToken = await generateTempTokens(params)
                    result = JSON.parse(JSON.stringify(result))
                    result.token = accessToken
                    return res.json({
                        success: true,
                        message: res.__('Otp verified successfuly.'),
                        data: result,
                        type: 'forgot',
                    })
                } else {
                    return res.json({
                        success: false,
                        message: res.__('Invalid Email or Password.'),
                        data: {},
                    })
                }
            }
        }
        console.log('req.userTemp.type', req.userTemp.type)
        var result = await adminModel.findOne({ email: req.userTemp.email }, {})
        if (result != null) {
            if (result) {
                let params = {
                    id: result._id,
                    email: result.email,
                    name: result.username,
                    user_type: result.user_type,
                }
                let accessToken = await generateTokens(params)
                result = JSON.parse(JSON.stringify(result))
                result.token = accessToken
                return res.json({
                    success: true,
                    message: res.__('Successfully Logged In.'),
                    data: result,
                })
            } else {
                return res.json({
                    success: false,
                    message: res.__('Invalid Email or Password.'),
                    data: {},
                })
            }
        }
    } catch (err) {
        console.error('verifyOtp', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}
const loginController = async (req, res) => {
    try {
        var result = await adminModel.findOne({ email: req.body.email }, {})
        if (result != null) {
            var match = await bcrypt.compare(req.body.password, result.password)
            if (match) {
                let params = {
                    id: result._id,
                    email: result.email,
                    name: result.username,
                    user_type: result.user_type,
                }
                let accessToken = await generateTokens(params)
                result = JSON.parse(JSON.stringify(result))
                result.token = accessToken
                return res.json({
                    success: true,
                    message: res.__('Successfully.'),
                    data: result,
                })
            } else {
                return res.json({
                    success: false,
                    message: res.__('Invalid Email or Password.'),
                    data: {},
                })
            }
        } else {
            return res.json({
                success: false,
                message: res.__('Invalid Email or Password.'),
                data: {},
            })
        }
    } catch (err) {
        console.error('loginController', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const forgetPassword = async (req, res) => {
    try {
        const { error } = forgetPasswordValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })

        const admin = await adminModel.findOne({ email: req.body.email })
        if (!admin)
            return res.json({
                success: false,
                message: req.__('Admin not found'),
                data: {},
            })

        let otp = (Math.floor(Math.random() * 10000) + 10000)
            .toString()
            .substring(1)

        let tempToken = await generateTempTokens({
            email: req.body.email,
            otp: otp,
            type: 'forgot',
        })

        await sendEmail(
            admin.username,
            admin.email,
            'OTP verification code',
            `<p>Your OTP to verify the account - ${otp}</p>`
        )
        res.json({
            success: true,
            message: req.__('OTP sent successfully, please check Mail'),
            data: { otp: otp, accessToken: tempToken.accessToken },
            type: 'forget',
        })
    } catch (err) {
        console.error('forgetPassword', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const resetPassword = async (req, res) => {
    try {
        console.log('req.userTemp.type', req.userTemp)
        if (req.userTemp.type != 'forgot')
            return res.json({
                success: false,
                message: req.__('Invalid token'),
                data: {},
            })

        let passwordHash = await bcrypt.hash(
            req.body.password,
            Number(process.env.BCRYPT_SALTROUND)
        )

        await adminModel.updateOne(
            { email: req.userTemp.email },
            { $set: { password: passwordHash } }
        )

        return res.json({
            success: true,
            message: req.__('Passsword reset successfully'),
            data: {},
        })
    } catch (err) {
        console.error('resetPassword', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const changePasswordController = async (req, res) => {
    try {
        var result = await adminModel.findOne(
            { _id: new mongoose.Types.ObjectId(req.user.id) },
            {}
        )
        if (result != null) {
            if (req.body.new_password != req.body.confirm_Password) {
                return res.json({
                    success: false,
                    message: res.__(
                        'Password and Confirm Passsword does not match.'
                    ),
                    data: {},
                })
            }
            var match = await bcrypt.compare(
                req.body.old_password,
                result.password
            )
            if (!match) {
                return res.json({
                    success: false,
                    message: res.__('Please enter correct old password'),
                    data: {},
                })
            }

            var salt = bcrypt.genSaltSync(10)
            var password = bcrypt.hashSync(req.body.new_password, salt)
            var updateData = {
                password: password,
            }

            var result = await adminModel.updateOne(
                { _id: new mongoose.Types.ObjectId(req.user.id) },
                { $set: updateData }
            )
            return res.json({
                success: true,
                message: res.__('Your password has been reset successfully.'),
                data: {},
            })
        } else {
            return res.json({
                success: false,
                message: res.__("Sorry, We didn't recognize that user."),
                data: {},
            })
        }
    } catch (err) {
        console.error('changePasswordController', err)
        return res.json({
            success: false,
            message: res.__('Something went wrong.'),
            data: {},
        })
    }
}

const getProduct = async (req, res) => {
    try {
        let match = {}
        let page =
            req.query.page && parseInt(req.query.page) > 0
                ? parseInt(req.query.page) - 1
                : 0
        let record =
            req.query.record && parseInt(req.query.record) > 0
                ? parseInt(req.query.record)
                : 10
        if (req.query.search) {
            match = {
                $or: [
                    { name: { $regex: req.query.search, $options: 'i' } },
                    {
                        description: {
                            $regex: req.query.search,
                            $options: 'i',
                        },
                    },
                ],
            }
        }
        if (req.query.category) {
            match['category'] = req.query.category
        }
        let totalproduct = await productModel.countDocuments(match)
        let productList = await productModel
            .find(
                match,
                {},
                { sort: { createdAt: -1 }, skip: record * page, limit: record }
            )
            .populate('category')
        return res.json({
            success: true,
            message: req.__('get Product list successfully.'),
            data: {
                total: totalproduct,
                page: page,
                record: record,
                totalPages: Math.ceil(totalproduct / record),
                productList: productList,
            },
        })
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
        let productList = await productModel
            .findOne({ _id: new mongoose.Types.ObjectId(req.params.id) })
            .populate('category')
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

const addProduct = async (req, res) => {
    try {
        const { error } = addProductValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })

        const exist = await productModel.findOne({
            slug: req.body.slug,
            sort: { createdAt: -1 },
        })
        if (exist)
            return res.json({
                success: false,
                message: req.__('This slug is already taken.'),
                data: {},
            })

        let productObj = {
            name: req.body.name,
            category: req.body.category,
            slug: req.body.slug,
            productType: req.body.productType,
            price: req.body.price,
            stock: req.body.stock,
            description: req.body.description,
            short_description: req.body.short_description,
            discount: req.body.discount,
            images: req.body.images,
            productType: req.body.productType,
            variableProducts: req.body.variableProducts,
            attributes: req.body.attributes,
            tags: req.body.tags,
            metadata: req.body.metadata,
        }

        var productSave = await productModel(productObj).save()
        return res.json({
            success: true,
            message: req.__('Product added successfully.'),
            data: {},
        })
    } catch (err) {
        console.error('addProduct', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        const { error } = updateProductValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })

        let productObj = {
            name: req.body.name,
            category: req.body.category,
            slug: req.body.slug,
            productType: req.body.productType,
            price: req.body.price,
            stock: req.body.stock,
            description: req.body.description,
            short_description: req.body.short_description,
            discount: req.body.discount,
            images: req.body.images,
            productType: req.body.productType,
            variableProducts: req.body.variableProducts,
            attributes: req.body.attributes,
            tags: req.body.tags,
            metadata: req.body.metadata,
            status: req.body.status,
        }

        await productModel.updateOne(
            { _id: new mongoose.Types.ObjectId(req.body.id) },
            { $set: productObj }
        )
        return res.json({
            success: true,
            message: req.__('Product details updated successfully.'),
            data: {},
        })
    } catch (err) {
        console.error('updateProduct', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { error } = deleteProductValidation(req.params)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })
        await productModel.deleteOne({
            _id: new mongoose.Types.ObjectId(req.params.id),
        })
        return res.json({
            success: true,
            message: req.__('Product deleted successfully.'),
            data: {},
        })
    } catch (err) {
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const updateProductStatus = async (req, res) => {
    try {
        let productinfo = await productModel.findById(req.body.id)
        if (!productinfo)
            return res.json({
                success: false,
                message: req.__('Product id not match'),
                data: {},
            })
        let productObj = {
            status: req.body.status,
        }

        let planUpdate = await productModel.updateOne(
            { _id: new mongoose.Types.ObjectId(req.body.id) },
            { $set: productObj }
        )
        return res.json({
            success: true,
            message: req.__('Product status updated successfully.'),
            data: {},
        })
    } catch (err) {
        console.error('updateProductStatus', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}
const uploadProductImage = async (req, res) => {
    try {
        if (!req.files.length)
            return res.json({
                success: false,
                message: req.__('Image is required.'),
                data: {},
            })

        return res.json({
            success: true,
            message: req.__('Upload successfully.'),
            data: req.files,
        })
    } catch (err) {
        console.error('uploadProductImage', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}
const getCategory = async (req, res) => {
    try {
        let match = {}
        let page =
            req.query.page && parseInt(req.query.page) > 0
                ? parseInt(req.query.page) - 1
                : 0
        let record =
            req.query.record && parseInt(req.query.record) > 0
                ? parseInt(req.query.record)
                : 10
        if (req.query.search) {
            match = {
                $or: [
                    { name: { $regex: req.query.search, $options: 'i' } },
                    { slug: { $regex: req.query.search, $options: 'i' } },
                ],
            }
        }
        let totalCategories = await categoryModel.countDocuments(match)
        let categoryList = await categoryModel.find(
            match,
            {},
            { skip: record * page, limit: record, sort: { createdAt: -1 } }
        )
        return res.json({
            success: true,
            message: req.__('Get category list successfully.'),
            page: page,
            record: record,
            totalPages: Math.ceil(totalCategories / record),
            data: categoryList,
            total: totalCategories,
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

const getCategoryById = async (req, res) => {
    try {
        let categoryList = await categoryModel.findOne({
            _id: new mongoose.Types.ObjectId(req.params.id),
        })
        return res.json({
            success: true,
            message: req.__('Get category successfully.'),
            data: categoryList,
        })
    } catch (err) {
        console.error('getCategoryById', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const addCategory = async (req, res) => {
    try {
        const { error } = addCategoryValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })
        let categoryCheck = await categoryModel.findOne({
            name: new RegExp(['^', req.body.name, '$'].join(''), 'i'),
        })
        if (categoryCheck)
            return res.json({
                success: false,
                message: req.__('Category already exist'),
                data: {},
            })
        let categoryObj = {
            name: req.body.name,
            slug: req.body.slug,
            tags: req.body.tags,
        }
        if (req.file && req.file.path) categoryObj['icon'] = req.file.path
        let categorySave = await categoryModel(categoryObj).save()
        return res.json({
            success: true,
            message: req.__('Category added successfully.'),
            data: {},
        })
    } catch (err) {
        console.error('addCategory', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const updateCategory = async (req, res) => {
    try {
        const categoryExist = await categoryModel.findOne({
            name: new RegExp(['^', req.body.name, '$'].join(''), 'i'),
            _id: { $ne: req.body.id },
        })

        if (categoryExist && categoryExist.name) {
            return res.json({
                success: false,
                message: req.__('Category already exist.'),
                data: {},
            })
        }
        const { error } = updateCategoryValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })

        let categoryObj = {
            name: req.body.name,
            tags: req.body.tags,
            status: req.body.status,
        }
        if (req.file && req.file.path) categoryObj['icon'] = req.file.path
        let categorySave = await categoryModel.updateOne(
            { _id: new mongoose.Types.ObjectId(req.body.id) },
            { $set: categoryObj }
        )
        return res.json({
            success: true,
            message: req.__('Category updated successfully.'),
            data: {},
        })
    } catch (err) {
        console.error('updateCategory', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const getCoupon = async (req, res) => {
    try {
        let match = {}
        let page =
            req.query.page && parseInt(req.query.page) > 0
                ? parseInt(req.query.page) - 1
                : 0
        let record =
            req.query.record && parseInt(req.query.record) > 0
                ? parseInt(req.query.record)
                : 10
        if (req.query.search) {
            match = {
                $or: [{ code: { $regex: req.query.search, $options: 'i' } }],
            }
        }
        let totalCoupon = await couponModel.countDocuments(match)
        let couponList = await couponModel.find(
            match,
            {},
            { skip: record * page, limit: record, sort: { createdAt: -1 } }
        )
        return res.json({
            success: true,
            message: req.__('Get coupon list successfully.'),
            data: {
                total: totalCoupon,
                page: page,
                record: record,
                totalPages: Math.ceil(totalCoupon / record),
                couponList: couponList,
            },
        })
    } catch (err) {
        console.error('getCoupon', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const getCouponById = async (req, res) => {
    try {
        let couponList = await couponModel.findOne({
            _id: new mongoose.Types.ObjectId(req.params.id),
        })
        return res.json({
            success: true,
            message: req.__('Get coupon successfully.'),
            data: couponList,
        })
    } catch (err) {
        console.error('getCouponById', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const addCoupon = async (req, res) => {
    try {
        const { error } = addCouponValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })

        let couponCheck = await couponModel.findOne({
            code: new RegExp(['^', req.body.code, '$'].join(''), 'i'),
        })
        if (couponCheck)
            return res.json({
                success: false,
                message: req.__('Coupon code already exist'),
                data: {},
            })
        let couponObj = {
            code: req.body.code,
            value: req.body.value,
            discountType: req.body.discountType,
            description: req.body.description,
            expirDate: req.body.expirDate,
        }
        let couponSave = await couponModel(couponObj).save()
        return res.json({
            success: true,
            message: req.__('Coupon added successfully.'),
            data: {},
        })
    } catch (err) {
        console.error('addCoupon', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const updateCoupon = async (req, res) => {
    try {
        const { error } = updateCouponValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })
        let couponCheck = await couponModel.findOne({
            code: new RegExp(['^', req.body.code, '$'].join(''), 'i'),
            _id: { $ne: req.body.id },
        })
        if (couponCheck)
            return res.json({
                success: false,
                message: req.__('Coupon code already exist'),
                data: {},
            })
        let couponObj = {
            code: req.body.code,
            value: req.body.value,
            discountType: req.body.discountType,
            description: req.body.description,
            expirDate: req.body.expirDate,
        }
        let couponupdate = await couponModel.updateOne(
            { _id: new mongoose.Types.ObjectId(req.body.id) },
            { $set: couponObj }
        )
        return res.json({
            success: true,
            message: req.__('Coupon updated successfully.'),
            data: {},
        })
    } catch (err) {
        console.error('updateCoupon', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const deleteCoupon = async (req, res) => {
    try {
    } catch (err) {
        console.error('deleteCoupon', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const getCourseCategory = async (req, res) => {
    try {
        let match = {}
        if (req.query.search) {
            match = { name: { $regex: req.query.search, $options: 'i' } }
        }

        let page =
            req.query.page && parseInt(req.query.page) > 0
                ? parseInt(req.query.page) - 1
                : 0
        let record =
            req.query.record && parseInt(req.query.record) > 0
                ? parseInt(req.query.record)
                : 10
        let totalCourseCategory = await courseCategoryModel.countDocuments(
            match
        )
        let categoryList = await courseCategoryModel.find(
            match,
            {},
            { sort: { createdAt: -1 }, skip: record * page, limit: record }
        )
        return res.json({
            success: true,
            message: req.__('Get course category list successfully.'),
            data: {
                total: totalCourseCategory,
                page: page,
                record: record,
                totalPages: Math.ceil(totalCourseCategory / record),
                planList: categoryList,
            },
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

const getCourseCategoryById = async (req, res) => {
    try {
        let categoryList = await courseCategoryModel.findOne({
            _id: new mongoose.Types.ObjectId(req.params.id),
        })
        return res.json({
            success: true,
            message: req.__('Get course category successfully.'),
            data: categoryList,
        })
    } catch (err) {
        console.error('getCategoryById', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const deleteCourseCategory = async (req, res) => {
    try {
        let categoryList = await courseCategoryModel.deleteOne({
            _id: new mongoose.Types.ObjectId(req.params.id),
        })
        if (categoryList)
            await courseModel.deleteMany({
                category: new mongoose.Types.ObjectId(req.params.id),
            })
        return res.json({
            success: true,
            message: req.__('Course category deleted successfully.'),
            data: {},
        })
    } catch (err) {
        console.error('getCategoryById', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const addCourseCategory = async (req, res) => {
    try {
        const { error } = addCourseCategoryValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })

        let categoryObj = {
            name: req.body.name,
        }

        let courseCategoryCheck = await courseCategoryModel.findOne({
            name: new RegExp(['^', req.body.name, '$'].join(''), 'i'),
        })
        if (courseCategoryCheck)
            return res.json({
                success: false,
                message: req.__('Course category already exist'),
                data: {},
            })

        let categorySave = await courseCategoryModel(categoryObj).save()
        return res.json({
            success: true,
            message: req.__('Course category added successfully.'),
            data: {},
        })
    } catch (err) {
        console.error('addCourseCategory', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

// const updateCourseCategory = async (req, res) => {
//     try {
//         const categoryExist = await courseCategoryModel.findOne({
//             name: new RegExp(['^', req.body.name, '$'].join(''), 'i'),
//             _id: { $ne: req.body.id },
//         })
//         console.log(categoryExist)
//         if (categoryExist) {
//             return res.json({
//                 success: false,
//                 message: req.__('Name already added for another category.'),
//                 data: {},
//             })
//         }

//         const { error } = updateCourseCategoryValidation(req.body)
//         if (error)
//             return res.json({
//                 success: false,
//                 message: req.__(error.details[0].message),
//                 data: {},
//             })

//         let categoryObj = {
//             name: req.body.name,
//             status: req.body.status,
//         }
//         let categorySave = await courseCategoryModel.updateOne(
//             { _id: new mongoose.Types.ObjectId(req.body.id) },
//             { $set: categoryObj }
//         )
//         return res.json({
//             success: true,
//             message: req.__('Course category updated successfully.'),
//             data: {},
//         })
//     } catch (err) {
//         console.error('updateCourseCategory', err)
//         return res.json({
//             success: false,
//             message: req.__('Internal Server Error'),
//             data: {},
//         })
//     }
// }
const updateCourseCategory = async (req, res) => {
    try {
        const categoryExist = await courseCategoryModel.findOne({
            name: new RegExp(['^', req.body.name, '$'].join(''), 'i'),
            _id: { $ne: req.body.id },
        })

        if (categoryExist && categoryExist.name) {
            return res.json({
                success: false,
                message: req.__('Course category already exist.'),
                data: {},
            })
        }

        const { error } = updateCourseCategoryValidation(req.body)
        if (error) {
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })
        }

        let categoryObj = {
            name: req.body.name,
            status: req.body.status,
        }

        let categorySave = await courseCategoryModel.updateOne(
            { _id: new mongoose.Types.ObjectId(req.body.id) },
            { $set: categoryObj }
        )

        return res.json({
            success: true,
            message: req.__('Course category updated successfully.'),
            data: {},
        })
    } catch (err) {
        console.error('updateCourseCategory', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

// const getCourse = async (req, res) => {
//     try {
//         let match = {};
//         let page =
//             req.query.page && parseInt(req.query.page) > 0
//                 ? parseInt(req.query.page) - 1
//                 : 0;
//         let record =
//             req.query.record && parseInt(req.query.record) > 0
//                 ? parseInt(req.query.record)
//                 : 10;
//                 if (req.query.search) {
//                     match = {
//                         $or: [
//                             { name: { $regex: req.query.search, $options: 'i' } },
//                             {
//                                 description: {
//                                     $regex: req.query.search,
//                                     $options: 'i',
//                                 },
//                             },
//                         ],
//                     }
//                 }
//                 if (req.query.category) {
//                     match['category'] = req.query.category
//                 }

//         let totalCourse = await courseModel.countDocuments(match);

//         let courseList = await courseModel
//             .find(match, {}, { skip: record * page, limit: record });
//             console.log(courseList);
//         return res.json({
//             success: true,
//             message: req.__('Get course list successfully.'),
//             data: {
//                 total: totalCourse,
//                 page: page,
//                 record: record,
//                 totalPages: Math.ceil(totalCourse / record),
//                 courseList: courseList,
//             },
//         });
//     } catch (err) {
//         console.error('getCourse', err);
//         return res.json({
//             success: false,
//             message: req.__('Internal Server Error'),
//             data: {},
//         });
//     }
// };

const getCourse = async (req, res) => {
    try {
        let match = {}
        let page =
            req.query.page && parseInt(req.query.page) > 0
                ? parseInt(req.query.page) - 1
                : 0
        let record =
            req.query.record && parseInt(req.query.record) > 0
                ? parseInt(req.query.record)
                : 10
        if (req.query.search) {
            match = {
                $or: [
                    { name: { $regex: req.query.search, $options: 'i' } },
                    {
                        description: {
                            $regex: req.query.search,
                            $options: 'i',
                        },
                    },
                ],
            }
        }
        if (req.query.category) {
            match['category'] = req.query.category
        }
        let totalCourse = await courseModel.countDocuments(match)
        let courseList = await courseModel
            .find(
                match,
                {},
                { sort: { createdAt: -1 }, skip: record * page, limit: record }
            )
            .populate('category')
        return res.json({
            success: true,
            message: req.__('Get course list successfully.'),
            data: {
                total: totalCourse,
                page: page,
                record: record,
                totalPages: Math.ceil(totalCourse / record),
                courseList: courseList,
            },
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

const getCourseById = async (req, res) => {
    try {
        let couponList = await courseModel.findOne({
            _id: new mongoose.Types.ObjectId(req.params.id),
        })
        return res.json({
            success: true,
            message: req.__('Get course successfully.'),
            data: couponList,
        })
    } catch (err) {
        console.error('getCourseById', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const addCourse = async (req, res) => {
    try {
        const { error } = addCourseValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })

        let courseObj = {
            name: req.body.name,
            description: req.body.description,
            video: req.body.video,
            videoType: req.body.videoType,
            category: req.body.category,
            tags: req.body.tags,
            instructor: req.body.instructor,
            instructor_intro: req.body.instructor_intro,
        }
        await courseModel(courseObj).save()
        return res.json({
            success: true,
            message: req.__('Course added successfully.'),
            data: {},
        })
    } catch (err) {
        console.error('addCourse', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const updateCourse = async (req, res) => {
    try {
        const { error } = updateCourseValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })

        let courseObj = {
            name: req.body.name,
            description: req.body.description,
            video: req.body.video,
            videoType: req.body.videoType,
            category: req.body.category,
            tags: req.body.tags,
            status: req.body.status,
            instructor: req.body.instructor,
            instructor_intro: req.body.instructor_intro,
        }
        await courseModel.updateOne(
            { _id: new mongoose.Types.ObjectId(req.body.id) },
            { $set: courseObj }
        )
        return res.json({
            success: true,
            message: req.__('Course details updated successfully.'),
            data: {},
        })
    } catch (err) {
        console.error('updateCourse', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const deleteCourse = async (req, res) => {
    try {
        const { error } = deleteProductValidation(req.params)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })
        await courseModel.deleteOne({
            _id: new mongoose.Types.ObjectId(req.params.id),
        })
        return res.json({
            success: true,
            message: req.__('Course deleted successfully.'),
            data: {},
        })
    } catch (err) {
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const getPlanCategory = async (req, res) => {
    try {
        let match = {}
        if (req.query.search) {
            match = { name: { $regex: req.query.search, $options: 'i' } }
        }
        let categoryList = await planCategoryModel.find(
            match,
            {},
            { sort: { createdAt: -1 } }
        )
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

const addPlanCategory = async (req, res) => {
    try {
        const { error } = addCourseCategoryValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })

        let planCategoryCheck = await planCategoryModel.findOne({
            name: new RegExp(['^', req.body.name, '$'].join(''), 'i'),
        })
        if (planCategoryCheck)
            return res.json({
                success: false,
                message: req.__('Plan category already exist'),  
                data: {},
            })
        let product = await stripe.products.create({
            name: req.body.name,
            type: 'service',
        })
        if (product && !product.id)
            return res.json({
                success: false,
                message: req.__('Internal Server Error'),
                data: { product },
            })
        let categoryObj = {
            name: req.body.name,
            stripeProductId: product.id,
        }
        let categorySave = await planCategoryModel(categoryObj).save()
        return res.json({
            success: true,
            message: req.__('Plan category added successfully.'),
            data: {},
        })
    } catch (err) {
        console.error('addPlanCategory', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const updatePlanCategory = async (req, res) => {
    try {
        const { error } = updateCourseCategoryValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })
        const categoryExist = await planCategoryModel.findOne({
            name: new RegExp(['^', req.body.name, '$'].join(''), 'i'),
            _id: { $ne: req.body.id },
        })
        if (categoryExist)
            return res.json({
                success: false,
                message: req.__('Plan category already exist'),
                data: {},
            })
        let categoryinfo = await planCategoryModel.findById(req.body.id)

        if (!categoryinfo)
            return res.json({
                success: false,
                message: req.__('Category id not match'),
                data: {},
            })

        await stripe.products.update(categoryinfo.stripeProductId, {
            name: req.body.name,
        })
        let categoryObj = {
            name: req.body.name,
            status: req.body.status,
        }
        let categorySave = await planCategoryModel.updateOne(
            { _id: new mongoose.Types.ObjectId(req.body.id) },
            { $set: categoryObj }
        )
        return res.json({
            success: true,
            message: req.__('Plan category updated successfully.'),
            data: {},
        })
    } catch (err) {
        console.error('updatePlanCategory', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const addPlan = async (req, res) => {
    try {
        const { error } = addPlanValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })

        let categoryinfo = await planCategoryModel.findById(req.body.category)
        if (!categoryinfo)
            return res.json({
                success: false,
                message: req.__('Category id not match'),
                data: {},
            })
        let planCheck = await planModel.findOne({
            name: new RegExp(['^', req.body.name, '$'].join(''), 'i'),
        })
        console.log('planCheck', planCheck)
        if (planCheck)
            return res.json({
                success: false,
                message: req.__('Plan already exist.'),
                data: {},
            })

        let productPlan = {}
        if (req.body.intervalType != 'fixed') {
            productPlan = await stripe.plans.create({
                nickname: req.body.name,
                amount: req.body.price * 100,
                interval: req.body.intervalType,
                interval_count: req.body.intervalCount,
                product: categoryinfo.stripeProductId,
                currency: 'AUD',
            })
        } else {
            productPlan = await stripe.prices.create({
                nickname: req.body.name,
                currency: 'AUD',
                product: categoryinfo.stripeProductId,
                unit_amount: req.body.price * 100,
            })
        }
        if (productPlan && !productPlan.id)
            return res.json({
                success: false,
                message: req.__('Internal Server Error'),
                data: { productPlan },
            })
        let planObj = {
            name: req.body.name,
            intervalType: req.body.intervalType,
            intervalCount: req.body.intervalCount,
            entries: req.body.entries,
            price: req.body.price,
            discription: req.body.discription,
            category: req.body.category,
            stripePlanId: productPlan.id,
            mostPopuler: req.body.mostPopuler,
        }

        let planSave = await planModel(planObj).save()
        return res.json({
            success: true,
            message: req.__('Plan added successfully'),
            data: {},
        })
    } catch (err) {
        console.error('addPlan', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const updatePlan = async (req, res) => {
    try {
        const { error } = updatePlanValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })
        const planExist = await planModel.findOne({
            name: new RegExp(['^', req.body.name, '$'].join(''), 'i'),
            _id: { $ne: req.body.id },
        })

        if (planExist && planExist.name) {
            return res.json({
                success: false,
                message: req.__('Plan already exist.'),
                data: {},
            })
        }
        let planinfo = await planModel.findById(req.body.id)
        if (!planinfo)
            return res.json({
                success: false,
                message: req.__('plan id not match'),
                data: {},
            })

        let productPlan = {}
        if (planinfo.intervalType != 'fixed') {
            productPlan = await stripe.plans.update(planinfo.stripePlanId, {
                nickname: req.body.name,
            })
        } else {
            productPlan = await stripe.prices.update(planinfo.stripePlanId, {
                nickname: req.body.name,
            })
        }
        if (productPlan && !productPlan.id)
            return res.json({
                success: false,
                message: req.__('Internal Server Error'),
                data: { productPlan },
            })
        let planObj = {
            name: req.body.name,
            entries: req.body.entries,
            discription: req.body.discription,
            mostPopuler: req.body.mostPopuler,
            price: req.body.price,
        }

        let planUpdate = await planModel.updateOne(
            { _id: new mongoose.Types.ObjectId(req.body.id) },
            { $set: planObj }
        )
        return res.json({
            success: true,
            message: req.__('Plan update successfully.'),
            data: {},
        })
    } catch (err) {
        console.error('updatePlan', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const updatePlanStatus = async (req, res) => {
    try {
        let planinfo = await planModel.findById(req.body.id)
        if (!planinfo)
            return res.json({
                success: false,
                message: req.__('Plan id not match'),
                data: {},
            })
        let planObj = {
            status: req.body.status,
        }

        let planUpdate = await planModel.updateOne(
            { _id: new mongoose.Types.ObjectId(req.body.id) },
            { $set: planObj }
        )
        return res.json({
            success: true,
            message: req.__('Plan status updated successfully.'),
            data: {},
        })
    } catch (err) {
        console.error('updatePlanStatus', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const planUserSubscription = async (req, res) => {
    try {
        let match = {
            plan_id: new mongoose.Types.ObjectId(req.query.id),
            description: { $ne: 'partner payment' },
        }

        console.log('req.query')

        let page =
            req.query.page && parseInt(req.query.page) > 0
                ? parseInt(req.query.page) - 1
                : 0
        let record =
            req.query.record && parseInt(req.query.record) > 0
                ? parseInt(req.query.record)
                : 10

        // Add filtering by status if provided
        if (req.query.filter) {
            match['status'] = req.query.filter
        }

        // Ensure valid dates before adding them to the filter
        if (req.query.startDate && req.query.startDate !== 'null') {
            const startDate = moment(req.query.startDate, 'YYYY-MM-DD', true)

            // Check if start date is valid
            if (!startDate.isValid()) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid start date format',
                })
            }

            // If end date is provided, use it; otherwise, set end date to the end of the start date
            const endDate = req.query.endDate
                ? moment(req.query.endDate, 'YYYY-MM-DD', true)
                : startDate

            // Check if end date is valid if it is provided
            if (req.query.endDate && !endDate.isValid()) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid end date format',
                })
            }

            // Construct match query for createdAt field within the date range
            match.createdAt = {
                $gte: startDate.startOf('day').toDate(),
                $lt: endDate.endOf('day').toDate(),
            }
        }
        if (req.query.userId) {
            match['uid'] = new mongoose.Types.ObjectId(req.query.userId)
        }

        // Fetch subscription data with the filters
        let subscription = await subcriptionModel
            .find(
                match,
                {},
                { sort: { createdAt: -1 }, skip: record * page, limit: record }
            )
            .populate('plan_id')
            .populate('uid')
            .populate('draw_id')

        // Get total subscription count based on filters
        let totalSubscription = await subcriptionModel.countDocuments(match)

        return res.json({
            success: true,
            message: req.__('Subscription history retrieved successfully.'),
            data: subscription,
            page: page,
            record: record,
            totalPages: Math.ceil(totalSubscription / record),
        })
    } catch (err) {
        console.error('planUserSubscription', err)
        return res.status(500).json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

// const planUserSubscription = async (req, res) => {
//     try {
//         let match = {}
//         console.log('req.query')
//         let page =
//             req.query.page && parseInt(req.query.page) > 0
//                 ? parseInt(req.query.page) - 1
//                 : 0
//         let record =
//             req.query.record && parseInt(req.query.record) > 0
//                 ? parseInt(req.query.record)
//                 : 10
//       if(req.query.filter){
//         match['status'] = req.query.filter;
//       }
//         let subcription = await subcriptionModel
//             .find(
//                 {
//                     plan_id: new mongoose.Types.ObjectId(req.query.id),
//                     description: { $ne: 'partner payment' },
//                 },
//                 {},
//                 { sort: { createdAt: -1 }, skip: record * page, limit: record }
//             )
//             .populate('plan_id')
//             .populate('uid')
//             .populate('draw_id')
//         let totalSubscription = await subcriptionModel.countDocuments({
//             plan_id: new mongoose.Types.ObjectId(req.query.id),
//             description: { $ne: 'partner payment' },
//         })
//         return res.json({
//             success: true,
//             message: req.__('Subcription history get successfully.'),
//             data: subcription,
//             page: page,
//             record: record,
//             totalPages: Math.ceil(totalSubscription / record),
//         })
//     } catch (err) {
//         console.error('planUserSubscription', err)
//         return res.status(500).json({
//             success: false,
//             message: req.__('Internal Server Error'),
//             data: {},
//         })
//     }
// }

// const getPlans = async (req, res) => {
//     try {
//         let match = { isdeleted: { $ne: true } }
//         let page =
//             req.query.page && parseInt(req.query.page) > 0
//                 ? parseInt(req.query.page) - 1
//                 : 0
//         let record =
//             req.query.record && parseInt(req.query.record) > 0
//                 ? parseInt(req.query.record)
//                 : 10
//         if (req.query.search) {
//             match = {
//                 $or: [
//                     { name: { $regex: req.query.search, $options: 'i' } },
//                     {
//                         intervalType: {
//                             $regex: req.query.search,
//                             $options: 'i',
//                         },
//                     },
//                     {
//                         description: {
//                             $regex: req.query.search,
//                             $options: 'i',
//                         },
//                     },
//                 ],
//             }
//         }
//         if (req.query.category) {
//             match['category'] = req.query.category
//         }

//         let totalPlan = await planModel.countDocuments(match)

//         let planList = await planModel
//             .find(
//                 match,
//                 {},
//                 { skip: record * page, limit: record, sort: { createdAt: -1 } }
//             )
//             .populate('category')
//         return res.json({
//             success: true,
//             message: req.__('Get plan list successfully.'),
//             data: {
//                 total: totalPlan,
//                 page: page,
//                 record: record,
//                 totalPages: Math.ceil(totalPlan / record),
//                 planList: planList,
//             },
//         })
//     } catch (err) {
//         console.error('getPlans', err)
//         return res.json({
//             success: false,
//             message: req.__('Internal Server Error'),
//             data: {},
//         })
//     }
// }
const getPlans = async (req, res) => {
    try {
        let match = { isdeleted: { $ne: true } }
        let page =
            req.query.page && parseInt(req.query.page) > 0
                ? parseInt(req.query.page) - 1
                : 0
        let record =
            req.query.record && parseInt(req.query.record) > 0
                ? parseInt(req.query.record)
                : 10

        // Search filter
        if (req.query.search) {
            match = {
                $or: [
                    { name: { $regex: req.query.search, $options: 'i' } },
                    {
                        intervalType: {
                            $regex: req.query.search,
                            $options: 'i',
                        },
                    },
                    {
                        description: {
                            $regex: req.query.search,
                            $options: 'i',
                        },
                    },
                ],
            }
        }

        // Category filter
        if (req.query.category) {
            match['category'] = req.query.category
        }

        // Most popular filter
        if (req.query.filter === 'true') {
            match['mostPopuler'] = 'true'
        }

        let sort = { createdAt: -1 } // Default sorting by creation date (descending)

        // Sort by number of subscriptions if filter is "member"
        if (req.query.filter === 'member') {
            const subscriptionCount = await subcriptionModel.aggregate([
                { $match: { status: 'active' } },
                { $group: { _id: '$plan_id', count: { $sum: 1 } } },
                { $sort: { count: -1 } }, // Sort by subscription count (descending)
            ])

            const sortedPlanIds = subscriptionCount.map((sub) => sub._id)

            // Use aggregate for custom sort order
            let planList = await planModel
                .aggregate([
                    { $match: { ...match, _id: { $in: sortedPlanIds } } },
                    {
                        $addFields: {
                            sortOrder: {
                                $indexOfArray: [sortedPlanIds, '$_id'],
                            },
                        },
                    },
                    { $sort: { sortOrder: 1 } }, // Sort by the custom order of sortedPlanIds
                    { $skip: record * page },
                    { $limit: record },
                ])
                .lookup({
                    from: 'categories', // assuming category collection
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category',
                })

            let totalPlan = sortedPlanIds.length

            return res.json({
                success: true,
                message: req.__('Get plan list successfully.'),
                data: {
                    total: totalPlan,
                    page: page,
                    record: record,
                    totalPages: Math.ceil(totalPlan / record),
                    planList: planList,
                },
            })
        }

        let totalPlan = await planModel.countDocuments(match)

        let planList = await planModel
            .find(match, {}, { skip: record * page, limit: record, sort })
            .populate('category')

        return res.json({
            success: true,
            message: req.__('Get plan list successfully.'),
            data: {
                total: totalPlan,
                page: page,
                record: record,
                totalPages: Math.ceil(totalPlan / record),
                planList: planList,
            },
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

// const getPlans = async (req, res) => {
//     try {
//         let match = { isdeleted: { $ne: true } }
//         let page =
//             req.query.page && parseInt(req.query.page) > 0
//                 ? parseInt(req.query.page) - 1
//                 : 0
//         let record =
//             req.query.record && parseInt(req.query.record) > 0
//                 ? parseInt(req.query.record)
//                 : 10

//         // Search Query Filter
//         if (req.query.search) {
//             match = {
//                 ...match, // Keep previous filters like isdeleted
//                 $or: [
//                     { name: { $regex: req.query.search, $options: 'i' } },
//                     {
//                         intervalType: {
//                             $regex: req.query.search,
//                             $options: 'i',
//                         },
//                     },
//                     {
//                         description: {
//                             $regex: req.query.search,
//                             $options: 'i',
//                         },
//                     },
//                 ],
//             }
//         }

//         // Category Filter
//         if (req.query.category) {
//             match['category'] =
//                 req.query.category === 'hase' ? 'hase' : req.query.category
//         }
//         if (req.query.popular) {
//             match['mostPopuler'] = 'true'
//         }
//         // Aggregate subscription counts and sort plans by the number of subscriptions in descending order
//         let subscriptionData = await subcriptionModel.aggregate([
//             {
//                 $match: {
//                     type: 'recurring', // Filter by type 'recurring'
//                 },
//             },
//             {
//                 $group: {
//                     _id: '$plan_id',
//                     totalSubscriptions: { $sum: 1 },
//                 },
//             }, // Group by plan_id and count subscriptions
//             {
//                 $sort: { totalSubscriptions: -1 },
//             }, // Sort by totalSubscriptions in descending order
//         ])

//         // Extract sorted plan IDs and their subscription counts
//         const sortedPlanData = subscriptionData.map((sub) => ({
//             planId: sub._id,
//             totalSubscriptions: sub.totalSubscriptions,
//         }))
//         const sortedPlanIds = sortedPlanData.map((sub) => sub.planId)

//         // Fetch all plans based on match criteria
//         let planList = await planModel
//             .find({ ...match }) // Fetch all plans matching criteria
//             .populate('category') // Assuming category is populated by ObjectId
//             .exec()

//         // Attach subscription counts to each plan, defaulting to 0 if no subscriptions exist
//         planList = planList.map((plan) => {
//             const subscriptionInfo = sortedPlanData.find((sub) =>
//                 sub.planId.equals(plan._id)
//             )
//             return {
//                 ...plan.toObject(), // Convert the Mongoose document to a plain object
//                 totalSubscriptions: subscriptionInfo
//                     ? subscriptionInfo.totalSubscriptions
//                     : 0, // Default to 0 if no subscription found
//             }
//         })

//         // Manually sort the plans to match the order of sortedPlanIds
//         planList.sort((a, b) => {
//             const indexA = sortedPlanIds.indexOf(a._id)
//             const indexB = sortedPlanIds.indexOf(b._id)
//             return indexA - indexB // Sort according to original subscription order
//         })

//         // Paginate the sorted list
//         const paginatedPlans = planList.slice(
//             page * record,
//             (page + 1) * record
//         )

//         // Total Count of Plans
//         let totalPlan = await planModel.countDocuments(match)

//         return res.json({
//             success: true,
//             message: req.__('Get plan list successfully.'),
//             data: {
//                 total: totalPlan,
//                 page: page,
//                 record: record,
//                 totalPages: Math.ceil(totalPlan / record),
//                 planList: paginatedPlans, // Plan data with subscription counts
//             },
//         })
//     } catch (err) {
//         console.error('getPlans', err)
//         return res.json({
//             success: false,
//             message: req.__('Internal Server Error'),
//             data: {},
//         })
//     }
// }

const deletePlan = async (req, res) => {
    try {
        await planModel.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { status: 'inactive', isdeleted: 'true' } }
        )
        return res.json({
            success: true,
            message: req.__('Plan deleted successfully.'),
            data: {},
        })
    } catch (err) {
        console.error('Plan deleted', err)
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
        let page =
            req.query.page && parseInt(req.query.page) > 0
                ? parseInt(req.query.page) - 1
                : 0
        let record =
            req.query.record && parseInt(req.query.record) > 0
                ? parseInt(req.query.record)
                : 10
        if (req.query.search) {
            match = {
                $or: [
                    { name: { $regex: req.query.search, $options: 'i' } },
                    {
                        discription: {
                            $regex: req.query.search,
                            $options: 'i',
                        },
                    },
                ],
            }
        }
        let totalDraw = await drawModel.countDocuments(match)

        let drawList = await drawModel.find(
            match,
            {},
            {
                sort: { scheduleDate: -1 },
                skip: record * page,
                limit: record,
            }
        )

        return res.json({
            success: true,
            message: req.__('Get draw list successfully.'),
            data: {
                total: totalDraw,
                page: page,
                record: record,
                totalPages: Math.ceil(totalDraw / record),
                drawList: drawList,
            },
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

const addDraw = async (req, res) => {
    try {
        const { error } = addDrawValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })

        console.log('req.body.scheduleDate', req.body.scheduleDate)
        let drawObj = {
            name: req.body.name,
            scheduleDate: req.body.scheduleDate,
            discription: req.body.discription,
            prizes: req.body.prizes,
        }
        if (req.file && req.file.path) drawObj['image'] = req.file.path

        let drawSave = await drawModel(drawObj).save()

        let userInfo = userModel.find({}, { fcmToken: 1 })
        if (userInfo && userInfo.fcmToken)
            // pushnotification
            pushNotification.sendPushNotification({
                device_ids: userInfo.fcmToken,
                title: 'woohoo I have a new event for you.',
                body: 'woohoo I have a new event for you.',
                data: {},
            })
        new notificationModel({
            title: 'woohoo I have a new event for you.',
            body: 'woohoo I have a new event for you.',
            data: {},
            type: 'all',
        }).save()

        return res.json({
            success: true,
            message: req.__('Draw added successfully.'),
            data: {},
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
const updateDraw = async (req, res) => {
    try {
        const { error } = editDrawValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })
        let drawObj = {
            name: req.body.name,
            scheduleDate: req.body.scheduleDate,
            discription: req.body.discription,
            prizes: req.body.prizes,
        }
        if (req.file && req.file.path) drawObj['image'] = req.file.path

        let drawupdate = await drawModel.updateOne(
            { _id: new mongoose.Types.ObjectId(req.body.id) },
            { $set: drawObj }
        )
        console.error('updateDraw', drawupdate)
        return res.json({
            success: true,
            message: req.__('Draw details updated successfully.'),
            data: {},
        })
    } catch (err) {
        console.error('updateDraw', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const getStaticContentController = async (req, res) => {
    try {
        let data = await staticContentModel.find()
        return res.json({
            success: true,
            message: req.__('Data get successfully.'),
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

const updateStaticContentController = async (req, res) => {
    try {
        let data = await staticContentModel.updateOne(
            { type: req.body.type },
            { content: req.body.content },
            { upsert: true }
        )
        return res.json({
            success: true,
            message: req.__('Data update successfully.'),
            data: data,
        })
    } catch (err) {
        console.error('updateStaticContentController', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

// const getOrder = async (req, res) => {
//     try {
//         let match = {}
//         let page =
//             req.query.page && parseInt(req.query.page) > 0
//                 ? parseInt(req.query.page) - 1
//                 : 0
//         let record =
//             req.query.record && parseInt(req.query.record) > 0
//                 ? parseInt(req.query.record)
//                 : 10
//                 if (req.query.search) {
//                     const searchDate = req.query.search;
//                     console.log(searchDate);
//                     // Parse the date string using Moment.js
//                     const parsedDate = moment(searchDate, 'YYYY-MM-DD', true);

//                     // Check if the parsed date is valid
//                     if (parsedDate.isValid()) {
//                         // Now you can use `parsedDate` in your database query
//                         match.createdAt = { $gte: parsedDate.toDate(), $lt: parsedDate.clone().add(1, 'day').toDate() };
//                     } else {
//                         // Handle invalid date format
//                         return res.status(400).json({ success: false, message: 'Invalid date format' });
//                     }
//                 }

//         let totalOrder = await orderModel.countDocuments(match)

//         let orderList = await orderModel.aggregate([
//             { $match: match },
//             { $skip: record * page },
//             { $limit: record },
//             {
//                 $lookup: {
//                     from: 'users',
//                     localField: 'uid',
//                     foreignField: '_id',
//                     as: 'userInfo',
//                 },
//             },
//             {
//                 $unwind: '$userInfo',
//             },
//         ])

//         orderList = JSON.parse(JSON.stringify(orderList))

//         for (const key in orderList) {
//             for (const key1 in orderList[key].lineItems) {
//                 // console.log('orderList.lineItems -- ', orderList[key].lineItems)
//                 if (
//                     Object.hasOwnProperty.call(orderList[key].lineItems, key1)
//                 ) {
//                     const orderObj = orderList[key].lineItems[key1]
//                     const productData = await productModel.findOne(
//                         {
//                             _id: orderObj.product,
//                             'variableProducts._id': orderObj.variation,
//                         },
//                         {
//                             name: 1,
//                             image: 1,
//                             'variableProducts.$': 1,
//                         }
//                     )

//                     orderList[key]['lineItems'][key1]['productInfo'] =
//                         productData

//                     const productData1 = await productModel.findOne({
//                         _id: orderObj.product,
//                     })
//                     orderList[key]['lineItems'][key1]['productData'] =
//                         productData1
//                 }
//             }
//         }

//         return res.json({
//             success: true,
//             message: req.__('Get order list successfully.'),
//             data: {
//                 total: totalOrder,
//                 page: page,
//                 record: record,
//                 totalPages: Math.ceil(totalOrder / record),
//                 orderList: orderList,
//             },
//         })
//     } catch (err) {
//         console.error('getOrder', err)
//         return res.json({
//             success: false,
//             message: req.__('Internal Server Error'),
//             data: {},
//         })
//     }
// }

const getOrder = async (req, res) => {
    try {
        let match = {}
        let page =
            req.query.page && parseInt(req.query.page) > 0
                ? parseInt(req.query.page) - 1
                : 0
        let record =
            req.query.record && parseInt(req.query.record) > 0
                ? parseInt(req.query.record)
                : 10

        // Check if start and end dates are provided in the request query
        if (req.query.startDate) {
            const startDate = moment(req.query.startDate, 'YYYY-MM-DD', true)

            // Check if start date is valid
            if (!startDate.isValid()) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid start date format',
                })
            }

            // If end date is provided, use it; otherwise, set end date to the end of the start date
            const endDate = req.query.endDate
                ? moment(req.query.endDate, 'YYYY-MM-DD', true)
                : startDate

            // Check if end date is valid if it is provided
            if (req.query.endDate && !endDate.isValid()) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid end date format',
                })
            }

            // Construct match query for createdAt field within the date range
            match.createdAt = {
                $gte: startDate.startOf('day').toDate(),
                $lt: endDate.endOf('day').toDate(),
            }
        }

        // Count total orders matching the filter criteria
        let totalOrder = await orderModel.countDocuments(match)

        // Fetch orders matching the filter criteria
        let orderList = await orderModel.aggregate([
            { $match: match },
            { $skip: record * page },
            { $limit: record },
            {
                $lookup: {
                    from: 'users',
                    localField: 'uid',
                    foreignField: '_id',
                    as: 'userInfo',
                },
            },
            { $unwind: '$userInfo' },
            { $sort: { createdAt: -1 } },
        ])

        orderList = JSON.parse(JSON.stringify(orderList))

        // Populate additional product information for each order
        for (const key in orderList) {
            for (const key1 in orderList[key].lineItems) {
                if (
                    Object.hasOwnProperty.call(orderList[key].lineItems, key1)
                ) {
                    const orderObj = orderList[key].lineItems[key1]
                    // Populate product information
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

                    const productData1 = await productModel.findOne({
                        _id: orderObj.product,
                    })
                    orderList[key]['lineItems'][key1]['productData'] =
                        productData1
                }
            }
        }

        return res.json({
            success: true,
            message: req.__('Get order list successfully.'),
            data: {
                total: totalOrder,
                page: page,
                record: record,
                totalPages: Math.ceil(totalOrder / record),
                orderList: orderList,
            },
        })
    } catch (err) {
        console.error('getOrder', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const getOrderById = async (req, res) => {
    try {
        const { error } = idValueValidation(req.query)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })
        let orderList = await orderModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(req.query.id) } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'uid',
                    foreignField: '_id',
                    as: 'userInfo',
                },
            },
            {
                $unwind: '$userInfo',
            },
        ])
        orderList = JSON.parse(JSON.stringify(orderList))

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

                    const productData1 = await productModel.findOne({
                        _id: orderObj.product,
                    })
                    orderList[key]['lineItems'][key1]['productData'] =
                        productData1
                }
            }
        }

        return res.json({
            success: true,
            message: req.__('Get order list successfully.'),
            data: orderList,
        })
    } catch (err) {
        console.error('getOrderById', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const { error } = updateOrderStatusValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })
        await orderModel.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(req.body.id) },
            { $set: { status: req.body.status } }
        )
        return res.json({
            success: true,
            message: req.__('Order status updated successfully.'),
            data: {},
        })
    } catch (err) {
        console.error('updateOrderStatus', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}
const userfilter = async (req, res) => {
    try {
        let subcription = await subcriptionModel
            .find({
                plan_id: new mongoose.Types.ObjectId(req.query.planid),
            })
            .populate('uid')

        console.log('users', subcription)
    } catch (error) {
        console.log('heelo your are inside filter user', error)
    }
}

const getUser = async (req, res) => {
    try {
        let match = {}
        let page =
            req.query.page && parseInt(req.query.page) > 0
                ? parseInt(req.query.page) - 1
                : 0
        let record =
            req.query.record && parseInt(req.query.record) > 0
                ? parseInt(req.query.record)
                : 10
        if (req.query.search) {
            match = {
                $or: [
                    { phone: { $regex: req.query.search, $options: 'i' } },
                    { email: { $regex: req.query.search, $options: 'i' } },
                    {
                        $expr: {
                            $regexMatch: {
                                input: {
                                    $concat: ['$firstname', ' ', '$lastname'],
                                },
                                regex: req.query.search, //Your text search here
                                options: 'i',
                            },
                        },
                    },
                ],
            }
        }

        // Check if start and end dates are provided in the request query
        if (req.query.startDate) {
            const startDate = moment(req.query.startDate, 'YYYY-MM-DD', true)

            // Check if start date is valid
            if (!startDate.isValid()) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid start date format',
                })
            }

            // If end date is provided, use it; otherwise, set end date to the end of the start date
            const endDate = req.query.endDate
                ? moment(req.query.endDate, 'YYYY-MM-DD', true)
                : startDate

            // Check if end date is valid if it is provided
            if (req.query.endDate && !endDate.isValid()) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid end date format',
                })
            }

            // Construct match query for createdAt field within the date range
            match.createdAt = {
                $gte: startDate.startOf('day').toDate(),
                $lt: endDate.endOf('day').toDate(),
            }
        }

        let totalUser = await userModel.countDocuments(match)
        let userList = await userModel.find(
            match,
            {},
            { sort: { createdAt: -1 }, skip: record * page, limit: record }
        )
        if (userList) {
            return res.json({
                success: true,
                message: req.__('Get user list successfully.'),
                data: {
                    total: totalUser,
                    page: page,
                    record: record,
                    totalPages: Math.ceil(totalUser / record),
                    userList: userList,
                },
            })
        } else {
            return res.json({
                success: false,
                message: req.__('No data found'),
                data: {},
            })
        }
    } catch (err) {
        console.error('getUser', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const getAllUser = async (req, res) => {
    try {
        let match = {}

        if (req.query.search) {
            match = {
                $or: [
                    { name: { $regex: req.query.search, $options: 'i' } },
                    { email: { $regex: req.query.search, $options: 'i' } },
                ],
            }
        }
        let userList = await userModel.find(match)
        if (userList) {
            return res.json({
                success: true,
                message: req.__('Get user list successfully.'),
                data: {
                    userList: userList,
                },
            })
        } else {
            return res.json({
                success: false,
                message: req.__('No data found'),
                data: {},
            })
        }
    } catch (err) {
        console.error('getUser', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const getUserById = async (req, res) => {
    try {
        const { error } = idValueValidation(req.query)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })
        let userList = await userModel.findOne({
            _id: new mongoose.Types.ObjectId(req.query.id),
        })
        return res.json({
            success: true,
            message: req.__('Get user list successfully.'),
            data: userList,
        })
    } catch (err) {
        console.error('getUserById', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}
const updateUserStatus = async (req, res) => {
    try {
        const result = await userModel.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(req.body.id) },
            { $set: { isStatus: req.body.isStatus } }
        )

        const subject = `Your Account Status`
        const message = `<p>Your account has been ${req.body.isStatus}</p>`
        if (result) {
            await sendEmail(
                result.firstname + ' ' + result.lastname,
                result.email,
                subject,
                message
            )
        }
        return res.json({
            success: true,
            message: req.__('User status updated successfully.'),
            data: {},
        })
    } catch (err) {
        console.error('updateUserStatus', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}
const updateUser = async (req, res) => {
    try {
        await userModel.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(req.body.id) },
            {
                $set: {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    phone: req.body.phone,
                    dob: req.body.dob,
                },
            }
        )
        return res.json({
            success: true,
            message: req.__('User details updated successfully.'),
            data: {},
        })
    } catch (err) {
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const ResetUserPassword = async (req, res) => {
    try {
        const user = await userModel.findById(req.body.id)
        if (user) {
            let passwordHash = await bcrypt.hash(
                req.body.password,
                Number(process.env.BCRYPT_SALTROUND)
            )
            await userModel.updateOne(
                { _id: req.body.id },
                { $set: { password: passwordHash } }
            )
            await sendEmail(
                user.firstname + ' ' + user.lastname,
                user.email,
                'Reset password by admin',
                `Your password is ${req.body.password}`
            )
            return res.json({
                success: true,
                message: req.__('Passsword reset successfully'),
                data: {},
            })
        } else {
            return res.json({
                success: false,
                message: req.__('User not found'),
                data: {},
            })
        }
    } catch (err) {
        console.error('resetPassword', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}
const exportUser = async (req, res) => {
    try {
        let fileLocation = 'public/upload/userexport/' + Date.now() + '.csv'
        //csv export
        const usersList = await userModel.find(
            {},
            {
                _id: 1,
                firstname: 1,
                lastname: 1,
                email: 1,
                phone: 1,
                dob: 1,
                billing_address: 1,
                postcode: 1,
                stripeCustomerId: 1,
            }
        )
        // const mockData = []
        // usersList.forEach((user) => {})
        const csv = exportCsv
            .write(JSON.parse(JSON.stringify(usersList)), { headers: true })
            .on('finish', function () {
                // console.log('create file')
                return res.json({
                    success: true,
                    message: req.__('Export successfully.'),
                    data: { fileLocation },
                })
            })
            .pipe(fs.createWriteStream(fileLocation))
    } catch (err) {
        console.error('exportUser', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}
const getUserPaymentHistory = async (req, res) => {
    try {
        const { error } = idValueValidation(req.query)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })
        const user = await userModel.findOne({
            _id: new mongoose.Types.ObjectId(req.query.id),
        })
        let subcription = await subcriptionModel
            .findOne(
                {
                    uid: new mongoose.Types.ObjectId(req.query.id),
                    status: 'active',
                    type: 'recurring',
                },
                {},
                { $sort: { createdAt: -1 } }
            )
            .populate('plan_id')
        let isSubcription = !subcription ? false : true
        let myentries = !subcription
            ? 0
            : await drawEntry.getUserEntry(req.query.id)
        let totalevent = await drawModel.countDocuments()
        let currentevent = await drawModel.countDocuments({
            scheduleDate: { $gte: new Date() },
        })

        let fixedEntry = await subcriptionModel.aggregate([
            {
                $match: {
                    uid: new mongoose.Types.ObjectId(req.query.id),
                    status: 'active',
                    type: 'fixed',
                    description: { $ne: 'partner payment' },
                },
            },
            {
                $group: {
                    _id: '$type',
                    count: {
                        $sum: '$entries',
                    },
                },
            },
        ])
        let fixedData = await subcriptionModel
            .findOne(
                {
                    uid: new mongoose.Types.ObjectId(req.query.id),
                    type: 'fixed',
                    description: { $ne: 'partner payment' },
                },
                {},
                { sort: { createdAt: -1 } }
            )
            .populate('plan_id')
            .populate('draw_id')
        let packageEntry =
            fixedEntry && fixedEntry[0]?.count ? fixedEntry[0].count : 0
        let paymentHistory = await subcriptionModel
            .find(
                {
                    uid: new mongoose.Types.ObjectId(req.query.id),
                },
                {},
                { $sort: { createdAt: -1 } }
            )
            .populate('plan_id')

        return res.json({
            success: true,
            message: req.__('Payment history get successfully.'),
            data: {
                paymentHistory,
                user,
                myentries,
                totalevent,
                currentevent,
                subcription,
                isSubcription,
                packageEntry,
                fixedData,
            },
        })
    } catch (err) {
        console.error('getHelpQuery', err)
        return res.status(500).json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const getUserSubscription = async (req, res) => {
    try {
        const { error } = await typeValidation(req.query)

        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })

        let subcription = await subcriptionModel
            .find(
                {
                    uid: new mongoose.Types.ObjectId(req.query.id),
                    type: req.query.type,
                    description: { $ne: 'partner payment' },
                },
                {},
                { sort: { createdAt: -1 } }
            )
            .populate('plan_id')
            .populate('draw_id')

        console.log(subcription)
        return res.json({
            success: true,
            message: req.__('Payment history get successfully.'),
            data: subcription,
        })
    } catch (err) {
        // console.error('getHelpQuery', err)
        return res.status(500).json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const sendUserMail = async (req, res) => {
    try {
        const { error } = await mailValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })

        const user = await userModel.findOne({
            _id: new mongoose.Types.ObjectId(req.body.id),
        })
        await sendEmail(
            user.firstname + ' ' + user.lastname,
            user.email,
            req.body.subject,
            req.body.message
        )

        return res.json({
            success: true,
            message: req.__('Mail have been sent successfully'),
            data: {},
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}
const sendHelpCenterMail = async (req, res) => {
    try {
    

        const user = await userModel.findOne({
            email: req.body.email,
        })
        await sendEmail(
            user.firstname + ' ' + user.lastname,
            user.email,
            req.body.subject,
            req.body.message
        )
        
    const rply = await helpCenterModel.findOneAndUpdate({email:req.body.email},{$set:{
        reply:'true'
    }})
        return res.json({
            success: true,
            message: req.__('Mail have been sent successfully'),
            data: {},
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}
const sendUserNotification = async (req, res) => {
    try {
        const user = await userModel.findOne({
            _id: new mongoose.Types.ObjectId(req.body.id),
        })
        if (user.fcmToken == '') {
            return res.json({
                success: true,
                message: req.__('Fcm token not found'),
                data: {},
            })
        } else {
            const notificationData = {
                device_ids: user.fcmToken,
                uid: user._id,
                title: 'Bestta notification',
                body: req.body.message,
                data: {},
            }
            pushNotification.sendPushNotification(notificationData)
            new notificationModel(notificationData).save()
            return res.json({
                success: true,
                message: req.__('Notification sent successfully'),
                data: {},
            })
        }
    } catch (error) {
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const sendUsersBulkMail = async (req, res) => {
    try {
        const userIds = req.body.userid
        const subject = req.body.subject
        const body = req.body.message
        const objectIds = userIds.map((id) => new mongoose.Types.ObjectId(id))

        // Fetch users based on the array of IDs
        const users = await userModel.find(
            {
                _id: { $in: objectIds },
            },
            'name email'
        ) // Select only name and email fields

        // Prepare email promises
        const emailPromises = users.map((user) => {
            const { firstname, email } = user
            return sendEmail(firstname, email, subject, body)
                .then(() => {
                    console.log(`Email sent to ${email}`)
                })
                .catch((error) => {
                    console.error(
                        `Failed to send email to ${email}: ${error.message}`
                    )
                })
        })

        // Send all emails concurrently
        await Promise.all(emailPromises)
        console.log('All emails have been processed.')

        // Respond to the end user
        return res.json({
            success: true,
            message: req.__('Mail have been sent successfully'),
            data: {},
        })
    } catch (error) {
        return res.json({
            success: false,
            message: req.__('Internal server error'),
            data: {},
        })
    }
}

const sendUsersBulkNotification = async (req, res) => {
    try {
        const userIds = req.body.userid
        const subject = 'Bestta Notification'
        const body = req.body.message
        const objectIds = userIds.map((id) => new mongoose.Types.ObjectId(id))

        // Fetch users based on the array of IDs
        const users = await userModel.find(
            {
                _id: { $in: objectIds },
            },
            'name email fcmToken _id'
        ) // Select only name, email, and fcmToken fields

        // Prepare notification promises
        const notificationPromises = users.map((user) => {
            console.log('inside notification', user)
            let { fcmToken } = user

            // Ensure fcmToken is an array (even if it's a single string)
            if (!Array.isArray(fcmToken)) {
                fcmToken = [fcmToken]
            }

            const notificationData = {
                device_ids: fcmToken, // This is now always an array
                uid: user._id,
                title: 'Bestta notification',
                body: req.body.message,
                data: {},
            }

            pushNotification.sendPushNotification(notificationData)

            // Save notification data to the database
            return new notificationModel(notificationData).save()
        })

        // Execute all notifications and DB save operations concurrently
        await Promise.all(notificationPromises)
        console.log('All Notifications have been processed.')

        // Respond to the end user
        return res.json({
            success: true,
            message: req.__('Notifications have been sent successfully'),
            data: {},
        })
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: req.__('Internal server error'),
            data: {},
        })
    }
}

const getHelpQuery = async (req, res) => {
    try {
        let match = {}
        let page =
            req.query.page && parseInt(req.query.page) > 0
                ? parseInt(req.query.page) - 1
                : 0
        let record =
            req.query.record && parseInt(req.query.record) > 0
                ? parseInt(req.query.record)
                : 10

        let totalQuery = await helpCenterModel.countDocuments(match)
        let helpList = await helpCenterModel.find(
            match,
            {},
            { skip: record * page, limit: record, sort: { createdAt: -1 } }
        )

        return res.json({
            success: true,
            message: req.__('Get query list successfully.'),
            data: {
                total: totalQuery,
                page: page,
                record: record,
                totalPages: Math.ceil(totalQuery / record),
                helpList: helpList,
            },
        })
    } catch (err) {
        console.error('getHelpQuery', err)
        return res.status(500).json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}
const deleteHelpQuery = async (req, res) => {
    try {
        await helpCenterModel.deleteOne({
            _id: new mongoose.Types.ObjectId(req.params.id),
        })
        return res.json({
            success: true,
            message: req.__('Query deleted successfully.'),
            data: {},
        })
    } catch (err) {
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}
const updateQueryController = async (req, res) => {
    try {
        let helpList = await helpCenterModel.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(req.body.id) },
            { $set: { reply: req.body.reply } }
        )
        if (helpList) {
            return res.json({
                success: true,
                message: req.__('update query  successfully.'),
                data: {},
            })
        } else {
            return res.json({
                success: false,
                message: req.__('Query not found'),
                data: {},
            })
        }
    } catch (err) {
        console.error('getHelpQuery', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const dashboard = async (req, res) => {
    try {
        let totalOrder = await orderModel.countDocuments({
            // status: { $ne: 'pending' },
        })
        let totalProduct = await productModel.countDocuments({
            // status: 'published',
        })
        let totalUser = await userModel.countDocuments({ role: 'user' })
        let totalRecurringSubscription = await subcriptionModel.countDocuments({
            type: 'recurring',
        })
        let totalFixedSubscription = await subcriptionModel.countDocuments({
            type: 'fixed',
            description: { $ne: 'partner payment' },
        })
        let totalDraws = await drawModel.countDocuments()

        return res.json({
            success: true,
            message: req.__('successfully.'),
            data: {
                totalOrder,
                totalProduct,
                totalUser,
                totalRecurringSubscription,
                totalFixedSubscription,
                totalDraws,
            },
        })
    } catch (err) {
        console.error('dashboard', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const countSubscriptionsByMonth = (subscriptions) => {
    const monthlyData = new Array(12).fill(0) // Initialize array with 12 months, all set to 0

    subscriptions.forEach((entry) => {
        const month = new Date(entry.startDate).getMonth() // getMonth is 0-indexed (0 = January, 11 = December)
        monthlyData[month] += 1 // Increment the count for the month
    })

    return monthlyData
}

const chart = async (req, res) => {
    try {
        // Find all unique plan_ids in the Subscription collection
        const planIds = await subcriptionModel.distinct('plan_id', {
            type: 'recurring', // Filter by the 'type' field
            // status: 'active'    // You can add more filters like 'status' if needed
        })

        const result = []

        // Loop over each plan_id to get subscription data
        for (const planId of planIds) {
            const plan = await planModel.findById(planId)
            if (!plan) {
                continue // Skip if the plan is not found
            }

            // Find active subscriptions for the current plan_id and exclude 'cancel' status
            const subscriptions = await subcriptionModel.find({
                plan_id: planId,
                status: 'active',
                type: { $ne: 'fixed' },
            })

            // Count subscriptions by month (across all years)
            const subscriptionData = countSubscriptionsByMonth(subscriptions)

            // Push the result in the required format
            result.push({
                name: plan.name,
                data: subscriptionData,
            })
        }

        // Send the aggregated result
        res.json({
            success: true,
            message: req.__('Chart get successfully'),
            data: result,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error fetching subscription data' })
    }
}
// const getPartnerList = async (req, res) => {
//     console.log()
//     try {
//         let match = {}
//         let page =
//             req.query.page && parseInt(req.query.page) > 0
//                 ? parseInt(req.query.page) - 1
//                 : 0
//         let record =
//             req.query.record && parseInt(req.query.record) > 0
//                 ? parseInt(req.query.record)
//                 : 10
//         if (req.query.search) {
//             match = {
//                 $or: [
//                     { name: { $regex: req.query.search, $options: 'i' } },
//                     { address: { $regex: req.query.search, $options: 'i' } },
//                     { city: { $regex: req.query.search, $options: 'i' } },
//                     { state: { $regex: req.query.search, $options: 'i' } },
//                 ],
//             }
//         }
//         let totalpartner = await partnerModel.countDocuments(match)
//         let partnerList = await partnerModel
//             .find(match, {}, { skip: record * page, limit: record , sort: { createdAt: -1 }})
//             .populate('category')
//         return res.json({
//             success: true,
//             message: req.__('partner list successfully.'),
//             data: {
//                 total: totalpartner,
//                 page: page,
//                 record: record,
//                 totalPages: Math.ceil(totalpartner / record),
//                 partnerList: partnerList,
//             },
//         })
//     } catch (err) {
//         console.error('getPartnerList', err)
//         return res.json({
//             success: false,
//             message: req.__('Internal Server Error'),
//             data: {},
//         })
//     }
// }
const getPartnerList = async (req, res) => {
    try {
        let match = { status: { $ne: 'pending' } }
        let page =
            req.query.page && parseInt(req.query.page) > 0
                ? parseInt(req.query.page) - 1
                : 0
        let record =
            req.query.record && parseInt(req.query.record) > 0
                ? parseInt(req.query.record)
                : 10

        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i')
            match = {
                $or: [
                    { firstname: searchRegex },
                    { lastname: searchRegex },
                    { business_name: searchRegex },
                    { email: searchRegex },
                    { address: searchRegex },
                    { city: searchRegex },
                    { state: searchRegex },
                    { 'categoryData.name': searchRegex },
                ],
            }
        }
        if (req.query.searchCategory) {
            match = {
                $or: [{ category: req.query.searchCategory }],
            }
        }

        const totalPartner = await partnerModel.countDocuments(match)
        let partnerList = await partnerModel.aggregate([
            {
                $match: {
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
            {
                $skip: page * record, // Skip the documents for the current page
            },
            {
                $limit: record, // Limit the number of documents returned
            },
        ])

        return res.json({
            success: true,
            message: req.__('Partner list successfully.'),
            data: {
                total: totalPartner,
                page: page + 1,
                record: record,
                totalPages: Math.ceil(totalPartner / record),
                partnerList: partnerList,
            },
        })
    } catch (err) {
        console.error('getPartnerList', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const addPartner = async (req, res) => {
    try {
        const exist = await userModel.findOne({ email: req.body.email })
        // console.log("isPartner",exist?.isPartner)
        if (exist && exist.isPartner == 'false') {
            const partnercheck = await partnerModel.findOne({
                email: req.body.email,
            })
            if (partnercheck) {
                return res.json({
                    success: false,
                    message: req.__('Partner already exits.'),
                    data: {},
                })
            }
            if (!exist) {
                return res.json({
                    success: false,
                    message: req.__(
                        'To become a partner user must be Accumulating or Mentoring member'
                    ),
                    data: {},
                })
            }
            if (exist) {
                let subcriptionInfo = await subcriptionModel.findOne({
                    uid: new mongoose.Types.ObjectId(exist._id),
                    status: 'active',
                    type: 'recurring',
                })
                console.log('subcriptionInfo', subcriptionInfo)
                if (!subcriptionInfo) {
                    return res.json({
                        success: false,
                        message: req.__(
                            'To become a partner user must be Accumulating or Mentoring member'
                        ),
                        data: {},
                    })
                }
            }

            // if (exist && exist.isStatus !== 'pending') {
            //     return res.json({
            //         success: false,
            //         message: req.__(`User with ${req.body.email} already exists`),
            //         data: {},
            //     })
            // } else {
            //     await userModel.deleteOne({ email: req.body.email })
            // }

            const partExist = await partnerModel.findOne({
                email: req.body.email,
            })
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

            let categoryId = ''
            if (req.body.other_category) {
                let categoryAdded = await BusinessCategoryModel({
                    name: req.body.other_category,
                }).save()

                categoryId = categoryAdded._id
            } else if (req.body.category) {
                categoryId = req.body.category
            }

            let partnerObj = {
                firstname: exist.firstname,
                lastname: exist.lastname,
                abn: req.body.abn,
                bussiness_name: req.body.bussiness_name,
                bussiness_url: req.body.bussiness_url,
                phone: exist.phone,
                email: req.body.email,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                country: req.body.country,

                category: categoryId,
                status: 'pending',
            }
            if (req.file && req.file.path) {
                partnerObj['image'] = req.file.path
            }
            let data = await partnerModel(partnerObj).save()
            if (data) {
                const user = await userModel.findOne({ email: data.email })
                // console.log('usedddr', user)
                console.log('id', user?._id)
                if (user) {
                    const findUser = await userModel.findByIdAndUpdate(
                        user._id,
                        {
                            $set: {
                                stripeCustomerId: data.stripeCustomerId,
                                isPartner: 'true', // Use boolean true if the schema expects a boolean
                            },
                        },
                        { new: true } // Optionally return the updated document
                    )

                    console.log('findUser', findUser)
                }

                // let userObj = {
                //     firstname: data.firstname,
                //     lastname: data.lastname,
                //     phone: data.phone,
                //     email: data.email,
                //     password: data.password,
                //     stripeCustomerId: data.stripeCustomerId,
                //     isStatus: 'active',
                //     isPayment: 'false',
                //     isPartner: "true"
                // }
                // let user = await userModel(userObj).save()
                const updatePartner = await partnerModel.findByIdAndUpdate(
                    { _id: data._id },
                    { $set: { uid: user._id } }
                )
                if (user) {
                    const body = `<p style={color:"green"}>successfully join bessta as partner</p>
                    <p>login with below provided credentials</p>
                    <p><b>email</b> ${user.email} </p>
                    <p><b>password</b> ${req.body.password} </p>`
                    const subject = 'Bestta Mail'
                    sendEmail(user.firstname, user.email, subject, body)
                        .then(() => {
                            console.log(`Email sent to ${user.email}`)
                        })
                        .catch((error) => {
                            console.error(
                                `Failed to send email to ${user.email}: ${error.message}`
                            )
                        })
                    return res.json({
                        success: true,
                        message: req.__('Partner added successfully.'),
                        data: {},
                    })
                }
            }
        } else {
            return res.json({
                success: false,
                message: req.__('Partner already exist'),
                data: {},
            })
        }
        console.log('exist', exist, req.body.email)
    } catch (err) {
        console.error('addPartner', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}
const updatePartnerStatus = async (req, res) => {
    try {
        await partnerModel.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(req.body.id) },
            { $set: { status: req.body.status } }
        )
        return res.json({
            success: true,
            message: req.__('Partner status updated successfully.'),
            data: {},
        })
    } catch (err) {
        console.error('updatePartnerStatus', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const updatePartnerInfo = async (req, res) => {
    try {
        let categoryId = ''
        if (req.body.other_category) {
            let categoryAdded = await BusinessCategoryModel({
                name: req.body.other_category,
            }).save()

            categoryId = categoryAdded._id
        } else if (req.body.category) {
            categoryId = req.body.category
        }
        let partnerObj = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,

            bussiness_name: req.body.bussiness_name,

            phone: req.body.phone,

            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            bussiness_url: req.body.business_url,
            abn: req.body.abn,
            category: categoryId,
        }
        if (req.file && req.file.path) partnerObj['image'] = req.file.path
        console.log(req.body)
        await partnerModel.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(req.body.id) },
            { $set: partnerObj }
        )
        return res.json({
            success: true,
            message: req.__('Partner  updated successfully.'),
            data: {},
        })
    } catch (err) {
        console.error('updatePartnerStatus', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

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
            { sort: { createdAt: -1 } }
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

const getPastWinnerById = async (req, res) => {
    try {
        let pastWinnerList = await pastWinnerModel.findOne({
            _id: new mongoose.Types.ObjectId(req.params.id),
        })
        return res.json({
            success: true,
            message: req.__('Get past winner successfully.'),
            data: pastWinnerList,
        })
    } catch (err) {
        console.error('getPastWinnerById', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const addPastWinner = async (req, res) => {
    const winners = JSON.parse(req?.body?.winners)
    console.log('winners', winners)
    if (winners.length < 1) {
        return res.json({
            success: false,
            message: req.__('Atleast One winner required.'),
            data: {},
        })
    }
    try {
        let pastWinnerObj = {
            winners: winners,
            year: req.body.year,
        }
        if (req.file && req.file.path) pastWinnerObj['image'] = req.file.path
        await pastWinnerModel(pastWinnerObj).save()
        return res.json({
            success: true,
            message: req.__('Past winners added successfully.'),
            data: {},
        })
    } catch (err) {
        console.error('addCategory', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const updatePastWinner = async (req, res) => {
    const winners = JSON.parse(req?.body?.winners)
    if (winners.length < 1) {
        return res.json({
            success: false,
            message: req.__('Atleast One winner required.'),
            data: {},
        })
    }
    try {
        let pastWinnerObj = {
            winners: winners,
            year: req.body.year,
        }
        if (req.file && req.file.path) pastWinnerObj['image'] = req.file.path

        await pastWinnerModel.updateOne(
            { _id: new mongoose.Types.ObjectId(req.body.id) },
            { $set: pastWinnerObj }
        )
        return res.json({
            success: true,
            message: req.__('Past winner updated successfully.'),
            data: {},
        })
    } catch (err) {
        console.error('updatePastWinner', err)
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
        let faqList = await faqModel.find(
            match,
            {},
            { sort: { createdAt: -1 } }
        )
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

const getFaqById = async (req, res) => {
    try {
        let faqList = await faqModel.findOne({
            _id: new mongoose.Types.ObjectId(req.params.id),
        })
        return res.json({
            success: true,
            message: req.__('Get faq successfully.'),
            data: faqList,
        })
    } catch (err) {
        console.error('getFaqById', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}
const deleteFaq = async (req, res) => {
    try {
        await faqModel.deleteOne({
            _id: new mongoose.Types.ObjectId(req.params.id),
        })
        return res.json({
            success: true,
            message: req.__('Faq deleted successfully.'),
            data: {},
        })
    } catch (err) {
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const addFaq = async (req, res) => {
    try {
        let faqObj = {
            question: req.body.question,
            answer: req.body.answer,
        }
        await faqModel(faqObj).save()
        return res.json({
            success: true,
            message: req.__('FAQ added successfully.'),
            data: {},
        })
    } catch (err) {
        console.error('addFaq', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const updateFaq = async (req, res) => {
    try {
        let faqObj = {
            question: req.body.question,
            answer: req.body.answer,
        }

        await faqModel.updateOne(
            { _id: new mongoose.Types.ObjectId(req.body.id) },
            { $set: faqObj }
        )
        return res.json({
            success: true,
            message: req.__('FAQ updated successfully.'),
            data: {},
        })
    } catch (err) {
        console.error('updateFaq', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

//business category
const addBusinessCategory = async (req, res) => {
    try {
        let CategoryCheck = await BusinessCategoryModel.findOne({
            name: new RegExp(['^', req.body.name, '$'].join(''), 'i'),
        })
        if (CategoryCheck)
            return res.json({
                success: false,
                message: req.__('Category already exist'),
                data: {},
            })
        let categoryObj = {
            name: req.body.name,
        }
        await BusinessCategoryModel(categoryObj).save()
        return res.json({
            success: true,
            message: req.__('Business category added successfully.'),
            data: {},
        })
    } catch (err) {
        console.error('addFaq', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const updateBusinessCategory = async (req, res) => {
    try {
        const categoryExist = await BusinessCategoryModel.findOne({
            name: new RegExp(['^', req.body.name, '$'].join(''), 'i'),
            _id: { $ne: req.body.id },
        })
        if (categoryExist)
            return res.json({
                success: false,
                message: req.__('Category already exist'),
                data: {},
            })
        let categoryObj = {
            name: req.body.name,
        }
        const updateCat = await BusinessCategoryModel.updateOne(
            { _id: new mongoose.Types.ObjectId(req.body.id) },
            { $set: categoryObj }
        )
        if (updateCat) {
            return res.json({
                success: true,
                message: req.__('Business category updated successfully.'),
                data: {},
            })
        }
    } catch {
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const getBusinessCategory = async (req, res) => {
    try {
        let match = {}
        if (req.query.search) {
            match = { name: { $regex: req.query.search, $options: 'i' } }
        }
        let categoryList = await BusinessCategoryModel.find(
            match,
            {},
            { sort: { createdAt: -1 } }
        )
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

const deleteBusinessCategory = async (req, res) => {
    try {
        await BusinessCategoryModel.deleteOne({
            _id: new mongoose.Types.ObjectId(req.params.id),
        })
        return res.json({
            success: true,
            message: req.__('Business category deleted successfully.'),
            data: {},
        })
    } catch (err) {
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const getStoreStatus = async (req, res) => {
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

const updateStoreStatus = async (req, res) => {
    try {
        let storeStatus = await storeStatusModel.updateMany(
            {},
            { $set: { status: req.body.status } }
        )
        return res.json({
            success: true,
            message: req.__(`Store status ${req.body.status}d successfully`),
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

const getfiltereMember = async (req, res) => {}

module.exports = {
    getfiltereMember,
    loginController,
    // forgotPasswordController,
    changePasswordController,
    getProduct,
    getProductById,
    addProduct,
    updateProduct,
    uploadProductImage,
    getCategory,
    addCategory,
    getCategoryById,
    updateCategory,
    getCoupon,
    getCouponById,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    getCourseCategory,
    deleteCourseCategory,
    getCourseCategoryById,
    addCourseCategory,
    updateCourseCategory,
    getCourse,
    getCourseById,
    addCourse,
    updateCourse,
    deleteCourse,
    getPlanCategory,
    addPlanCategory,
    updatePlanCategory,
    addPlan,
    updatePlan,
    updatePlanStatus,
    updateProductStatus,
    getPlans,
    getDraws,
    addDraw,
    updateDraw,
    getStaticContentController,
    updateStaticContentController,
    getOrder,
    getOrderById,
    updateOrderStatus,
    sendUserNotification,
    getUser,
    getUserById,
    updateUserStatus,
    exportUser,
    getHelpQuery,
    dashboard,
    getPartnerList,
    updatePartnerStatus,
    updatePartnerInfo,
    getPastWinner,
    getPastWinnerById,
    addPastWinner,
    updatePastWinner,
    getFaq,
    getFaqById,
    addFaq,
    updateFaq,
    addBusinessCategory,
    updateBusinessCategory,
    getBusinessCategory,
    updateQueryController,
    deleteProduct,
    getUserPaymentHistory,
    getStoreStatus,
    chart,
    updateStoreStatus,
    getUserSubscription,
    sendUserMail,
    sendUsersBulkMail,
    planUserSubscription,
    getAllUser,
    sendUsersBulkNotification,
    updateUser,
    addPartner,
    userfilter,
    deleteFaq,
    deleteHelpQuery,
    deletePlan,
    deleteBusinessCategory,
    ResetUserPassword,
    verifyAdmin,
    verifyOtp,
    resendOtpMail,
    forgetPassword,
    resetPassword,
    sendHelpCenterMail,
}
