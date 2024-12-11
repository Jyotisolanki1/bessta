const {
    singUpValidation,
    loginValidation,
    verifyOtpValidation,
    forgetPasswordValidation,
    resetPasswordValidation,
    changePasswordValidation,
    socialLoginRegisterValidation,
    updateProfileValidation,
    sendQueryValidation,
} = require('../helpers/validationSchema')

const {
    generateTokens,
    generateTempTokens,
} = require('../helpers/generateTokens')
const userModel = require('../models/userModel')
const helpCenterModel = require('../models/helpCenterModel')

const bcrypt = require('bcrypt')
const { sendEmail, helpcentermail } = require('../librarys/sendEmail')
const mongoose = require('mongoose')
const drawModel = require('../models/drawModel')
const planModel = require('../models/planModel')
const partnerModel = require('../models/partnerModel')
const subcriptionModel = require('../models/subcriptionModel')
const drawEntry = require('../helpers/drawEntry')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const moment = require('moment')

const singUp = async (req, res) => {
    try {
        const { error } = singUpValidation(req.body)
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

        let passwordHash = await bcrypt.hash(
            req.body.password,
            Number(process.env.BCRYPT_SALTROUND)
        )

        let otp = (Math.floor(Math.random() * 10000) + 10000)
            .toString()
            .substring(1)

        let userObj = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            phone: req.body.phone,
            email: req.body.email,
            age: req.body.age,
            dob: req.body.dob,
            billing_address: req.body.billing_address,
            postcode: req.body.postcode,
            password: passwordHash,
            fcmToken: req.body.fcmToken,
            isPartner: 'false',
        }

        await userModel(userObj).save()
        await sendEmail(
            req.body.firstname + ' ' + req.body.lastname,
            req.body.email,
            'OTP verification code',
            `<p>Your OTP to verify the account - ${otp}</p>`
        )

        let tempToken = await generateTempTokens({
            email: req.body.email,
            otp: otp,
            type: 'signup',
        })
        return res.json({
            success: true,
            message: req.__('OTP sent successfully on the email'),
            data: { otp: otp, accessToken: tempToken.accessToken },
        })
    } catch (err) {
        console.error('singUp', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const login = async (req, res) => {
    try {
        const { error } = loginValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })

        const user = await userModel.findOne({ email: req.body.email })
        if (!user)
            return res.json({
                success: false,
                message: req.__('Invalid email or password'),
                data: {},
            })
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        )
        if (!validPassword || !user)
            return res.json({
                success: false,
                message: req.__('Invalid email or password'),
                data: {},
            })
        await userModel.findOneAndUpdate(
            { email: req.body.email },
            { $set: { fcmToken: req.body.fcmToken } }
        )
        switch (user.isStatus) {
            case 'pending':
                let otp = (Math.floor(Math.random() * 10000) + 10000)
                    .toString()
                    .substring(1)
                let tempToken = await generateTempTokens({
                    email: req.body.email,
                    otp: otp,
                    type: 'login',
                })
                res.json({
                    success: true,
                    message: req.__('verify your account'),
                    data: {
                        otp: otp,
                        accessToken: tempToken.accessToken,
                        isStatus: user.isStatus,
                        isPayment: user.isPayment,
                        isPartnerPayment: user?.isPartnerPayment,
                    },
                })
                break
            case 'active':
                let accessToken = await generateTokens({
                    id: user._id,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                })
                if (
                    user.isPartnerPayment === 'false' &&
                    user.isPartner == 'true'
                ) {
                    let subcriptionInfo = await subcriptionModel.findOne({
                        uid: new mongoose.Types.ObjectId(user._id),
                        status: 'active',
                        type: 'recurring',
                    })
                    const paymentIntent = await stripe.paymentIntents.create({
                        amount: 99 * 100,
                        currency: 'AUD',
                        payment_method_types: ['card'],
                    })
                    subscription_id = paymentIntent.id
                    client_secret = paymentIntent.client_secret
                    invoice_id = paymentIntent.id

                    let obj1 = {
                        uid: user._id,
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

                    res.json({
                        success: true,
                        message: req.__('Successfully logged in'),
                        data: {
                            accessToken: accessToken.accessToken,
                            isStatus: user.isStatus,
                            isPayment: user.isPayment,
                            clientSecret: client_secret,
                            isPartnerPayment: user?.isPartnerPayment,
                            isPartner: user?.isPartner,
                        },
                    })
                } else if (user.isPayment === 'false') {
                    // let data = await partnerModel.findOne({ email: user.email })

                    // let planInfo = await planModel.findOne({
                    //     stripePlanId: 'plan_PdIrWFLxjB1aR4',
                    // })
                    // console.log('planInfo', planInfo)
                    // // get the price
                    // const price = await stripe.prices.retrieve(
                    //     planInfo.stripePlanId
                    // )

                    // const customer = await stripe.customers.create({
                    //     email: req.body.email,
                    // })
                    // // console.log('partnerModel save - ', data)
                    // stripeCustomerId = customer.id
                    // await partnerModel.findByIdAndUpdate(data._id, {
                    //     $set: { stripeCustomerId: stripeCustomerId },
                    // })

                    // await userModel.findByIdAndUpdate(user._id, {
                    //     $set: { stripeCustomerId: stripeCustomerId },
                    // })
                    // let subscription_id = ''
                    // let client_secret = ''
                    // let plan_type = ''
                    // let startDate = moment()
                    // let endDate = moment()
                    // let invoice_id = ''
                    // if (price.recurring !== null) {
                    //     let subscription = await stripe.subscriptions.create({
                    //         customer: stripeCustomerId,
                    //         items: [
                    //             {
                    //                 price: 'plan_PdIrWFLxjB1aR4',
                    //             },
                    //         ],
                    //         add_invoice_items: [
                    //             {
                    //                 price: 'price_1OtoblBOmjdVCHS9tlic6tUb',
                    //             },
                    //         ],
                    //         payment_behavior: 'default_incomplete',
                    //         expand: ['latest_invoice.payment_intent'],
                    //         payment_settings: {
                    //             save_default_payment_method: 'on_subscription',
                    //         },
                    //     })

                    //     console.log('subscription', subscription)
                    //     // console.log('subscription -----', subscription)
                    //     subscription_id = subscription.id
                    //     client_secret =
                    //         subscription.latest_invoice.payment_intent
                    //             .client_secret
                    //     plan_type = 'recurring'
                    //     startDate = moment.unix(
                    //         subscription.current_period_start
                    //     )
                    //     endDate = moment.unix(subscription.current_period_end)
                    //     invoice_id = subscription.latest_invoice.id

                    //     let obj = {
                    //         uid: user._id,
                    //         subcription_id: subscription_id,
                    //         client_secret: client_secret,
                    //         invoice_id: invoice_id,
                    //         entries: planInfo.entries,
                    //         amount: planInfo.price,
                    //         plan_id: planInfo._id,
                    //         type: plan_type,
                    //         startDate: startDate,
                    //         endDate: endDate,
                    //     }
                    //     new subcriptionModel(obj).save()

                    //     let obj1 = {
                    //         uid: user._id,
                    //         subcription_id: subscription_id,
                    //         client_secret: client_secret,
                    //         invoice_id: invoice_id,
                    //         entries: 0,
                    //         plan_id: planInfo._id,
                    //         amount: '80',
                    //         type: 'fixed',
                    //         startDate: moment(),
                    //         endDate: moment(),
                    //         description: 'partner payment',
                    //     }
                    //     new subcriptionModel(obj1).save()
                    //     res.json({
                    //         success: true,
                    //         message: req.__('Successfully logged in'),
                    //         data: {
                    //             accessToken: accessToken.accessToken,
                    //             isStatus: user.isStatus,
                    //             isPayment: user.isPayment,
                    //             clientSecret: client_secret,
                    //             isPartnerPayment: user?.isPartnerPayment,
                    //         },
                    //     })
                    // }
                    let subcriptionInfo = await subcriptionModel.findOne({
                        uid: new mongoose.Types.ObjectId(user._id),
                        status: 'active',
                        type: 'recurring',
                    })
                    const paymentIntent = await stripe.paymentIntents.create({
                        amount: 99 * 100,
                        currency: 'AUD',
                        payment_method_types: ['card'],
                    })
                    subscription_id = paymentIntent.id
                    client_secret = paymentIntent.client_secret
                    invoice_id = paymentIntent.id

                    let obj1 = {
                        uid: user._id,
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

                    res.json({
                        success: true,
                        message: req.__('Successfully logged in'),
                        data: {
                            accessToken: accessToken.accessToken,
                            isStatus: user.isStatus,
                            isPayment: user.isPayment,
                            clientSecret: client_secret,
                            isPartnerPayment: user?.isPartnerPayment,
                            isPartner: user?.isPartner,
                        },
                    })
                } else {
                    let subcription = await subcriptionModel.findOne(
                        {
                            uid: new mongoose.Types.ObjectId(user._id),
                        },
                        {},
                        { $sort: { createdAt: -1 } }
                    )
                    let isSubcription = !subcription ? 'false' : 'true'
                    res.json({
                        success: true,
                        message: req.__('Successfully logged in'),
                        data: {
                            accessToken: accessToken.accessToken,
                            isStatus: user.isStatus,
                            isPayment: user.isPayment,
                            isSubcription: isSubcription,
                            isPartnerPayment: user?.isPartnerPayment,
                        },
                    })
                }

                break
            case 'deleted':
                res.json({
                    success: false,
                    message: req.__('Your account has been deleted.'),
                    data: {},
                })
                break
            case 'blocked':
            default:
                res.json({
                    success: false,
                    message: req.__(
                        'Your account is deactivated by admin, please contact admin.'
                    ),
                    data: {},
                })
                break
        }

        return
    } catch (err) {
        console.error('login', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const resendOtpMail = async (req, res) => {
    try {
        // if (moment().diff(moment(req.userTemp.iat * 1000)) / 1000 < 120)
        //     return res.json({
        //         success: false,
        //         message: req.__('Wait for 2 min.'),
        //         data: {},
        //     })
        const user = await userModel.findOne({ email: req.userTemp.email })

        let otp = (Math.floor(Math.random() * 10000) + 10000)
            .toString()
            .substring(1)

        let tempToken = await generateTempTokens({
            email: req.userTemp.email,
            otp: otp,
            type: req.userTemp.type,
        })

        await sendEmail(
            user.firstname + ' ' + user.lastname,
            user.email,
            'OTP verification code',
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
        const { error } = verifyOtpValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })
        // console.log('verifyOtp', req.userTemp, req.user)
        if (req.body.otp != req.userTemp.otp) {
            res.json({
                success: false,
                message: req.__('Please enter the valid code'),
                data: {},
            })
        }

        const user = await userModel.findOneAndUpdate(
            { email: req.userTemp.email },
            { $set: { isStatus: 'active' } }
        )

        let accessToken = ''
        if (req.userTemp.type == 'signup') {
            accessToken = await generateTokens({
                id: user._id,
                email: user.email,
                phone: user.phone,
                role: user.role,
            })

            await sendEmail(
                user.firstname + ' ' + user.lastname,
                user.email,
                'Thankyou for join with us',
                `<p>Thankyou for verify your account</p>`
            )
        } else if (req.userTemp.type == 'forgot') {
            accessToken = await generateTempTokens({
                email: req.userTemp.email,
                otp: req.userTemp.otp,
                type: 'forgot',
            })
        } else {
            accessToken = await generateTokens({
                id: user._id,
                email: user.email,
                phone: user.phone,
                role: user.role,
            })
        }

        res.json({
            success: true,
            message: req.__('OTP verified sucessfully'),
            data: accessToken,
        })
    } catch (err) {
        console.error('verifyOtp', err)
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

        const user = await userModel.findOne({ email: req.body.email })
        if (!user)
            return res.json({
                success: false,
                message: req.__('User not found'),
                data: {},
            })

        if (
            user &&
            (user.login_type == 'google' || user.login_type == 'facebook')
        )
            return res.json({
                success: false,
                message: req.__('User registered using social login'),
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
            user.firstname + ' ' + user.lastname,
            user.email,
            'OTP verification code',
            `<p>Your OTP to verify the account - ${otp}</p>`
        )
        res.json({
            success: true,
            message: req.__('OTP sent successfully, please check Mail'),
            data: { otp: otp, accessToken: tempToken.accessToken },
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
        const { error } = resetPasswordValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })

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

        await userModel.updateOne(
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

const changePassword = async (req, res) => {
    try {
        if (req.body.old_password == req.body.new_password)
            return res.json({
                success: false,
                message: req.__(
                    'New password can not be same as old password.'
                ),
                data: {},
            })
        const { error } = changePasswordValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })

        const user = await userModel.findOne({
            _id: new mongoose.Types.ObjectId(req.user.id),
        })
        const validPassword = await bcrypt.compare(
            req.body.old_password,
            user.password
        )
        if (!validPassword || !user)
            return res.json({
                success: false,
                message: req.__('Please enter correct old password'),
                data: {},
            })
        let passwordHash = await bcrypt.hash(
            req.body.new_password,
            Number(process.env.BCRYPT_SALTROUND)
        )

        await userModel.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(req.user.id) },
            { $set: { password: passwordHash } }
        )

        return res.json({
            success: true,
            message: req.__('Your password has been updated successfully'),
            data: {},
        })
    } catch (err) {
        console.error('changePassword', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const socialLoginRegister = async (req, res) => {
    try {
        const { error } = socialLoginRegisterValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })

        let user = await userModel.findOne({
            social_id: req.body.social_id,
            login_type: req.body.login_type,
        })
        if (user) {
            if (user.isStatus == 'blocked')
                return res.json({
                    success: false,
                    message: req.__(
                        'Your account is deactivated by admin, please contact admin.'
                    ),
                    data: {},
                })
            await userModel.findOneAndUpdate(
                {
                    social_id: req.body.social_id,
                    login_type: req.body.login_type,
                },
                { $set: { fcmToken: req.body.fcmToken } }
            )
            let accessToken = await generateTokens({
                id: user._id,
                social_id: req.body.social_id,
                email: user.email,
                phone: user.phone,
                role: user.role,
            })
            res.json({
                success: true,
                message: req.__('Successfully logged in'),
                data: accessToken,
            })
        } else {
            let userInfo = await userModel({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                social_id: req.body.social_id,
                email: req.body.email,
                login_type: req.body.login_type,
                fcmToken: req.body.fcmToken,
                isStatus: 'active',
            }).save()
            let accessToken = await generateTokens({
                id: userInfo._id,
                social_id: req.body.social_id,
                email: req.body.email,
                role: userInfo.role,
            })
            return res.json({
                success: true,
                message: req.__('Signup successfully'),
                data: accessToken,
            })
        }
    } catch (err) {
        console.error('socialLoginRegister', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const getProfile = async (req, res) => {
    try {
        const user = await userModel.findOne({
            _id: new mongoose.Types.ObjectId(req.user.id),
        })

        let subcription = await subcriptionModel
            .findOne(
                {
                    uid: new mongoose.Types.ObjectId(req.user.id),
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
            : await drawEntry.getUserEntry(req.user.id)
        let totalevent = await drawModel.countDocuments()
        let currentevent = await drawModel.countDocuments({
            $expr: { $lt: [{ $size: '$winner' }, 1] },
        })

        let fixedEntry = await subcriptionModel.aggregate([
            {
                $match: {
                    uid: new mongoose.Types.ObjectId(req.user.id),
                    status: 'active',
                    type: 'fixed',
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
        let packagePlan = await subcriptionModel
            .findOne({
                uid: new mongoose.Types.ObjectId(req.user.id),
                status: 'active',
                type: 'fixed',
                description: { $ne: 'partner payment' },
            })
            .populate('draw_id')
        let packageEntry =
            fixedEntry && fixedEntry[0]?.count ? fixedEntry[0].count : 0
        let urlData = '#'
        if (user && user.stripeCustomerId) {
            // Create a billing portal session
            const session = await stripe.billingPortal.sessions.create({
                customer: user.stripeCustomerId,
                return_url: 'https://indoredev.webmobrildemo.com/', // URL to redirect customers after they close the billing portal
            })
            urlData = session?.url
        }

        // Send the session URL to the client
        // res.json({ url: session.url })
        return res.json({
            success: true,
            message: req.__('get profile successfully'),
            data: {
                user,
                myentries,
                totalevent,
                currentevent,
                subcription,
                isSubcription,
                packageEntry,
                packagePlan,
                url: urlData,
            },
        })
    } catch (err) {
        console.error('getProfile', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const goToStripe = async (req, res) => {
    try {
        const user = await userModel.findOne({
            _id: new mongoose.Types.ObjectId(req.user.id),
        })
        if (user && user.stripeCustomerId) {
            // Create a billing portal session
            const session = await stripe.billingPortal.sessions.create({
                customer: user.stripeCustomerId,
                return_url: 'https://indoredev.webmobrildemo.com/',
            })
            urlData = session?.url
        }
        return res.json({
            success: true,
            message: req.__('get profile successfully'),
            data: {
                url: urlData,
            },
        })
    } catch (error) {
        console.error('getProfile', error)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const updateProfile = async (req, res) => {
    try {
        const { error } = updateProfileValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })

        var updateData = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            phone: req.body.phone,
        }
        if (req.file && req.file.path) {
            updateData['image'] = req.file.path
        }
        const user = await userModel.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(req.user.id) },
            { $set: updateData },
            { new: true }
        )
        if (user) {
            return res.json({
                success: true,
                message: req.__('Profile updated successfully'),
                data: user,
            })
        } else {
        }
    } catch (err) {
        console.error('updateProfile', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

const sendQueryController = async (req, res) => {
    try {
        console.log('req.body', req.body)
        const { error } = sendQueryValidation(req.body)
        if (error)
            return res.json({
                success: false,
                message: req.__(error.details[0].message),
                data: {},
            })
        // console.log("user",req.user)
        await helpcentermail(
            req.body.name,
            req.body.email,
            'User Query',
            `<span> ${req.body.message}</span>`
        )
        let user_id = req.user ? req.user.id : ''
        await helpCenterModel({
            uid: user_id,
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            message: req.body.message,
        }).save()

        return res.json({
            success: true,
            message: req.__('Inquiry submitted successfully'),
            data: {},
        })
    } catch (err) {
        console.error('sendQueryController', err)
        return res.json({
            success: false,
            message: req.__('Internal Server Error'),
            data: {},
        })
    }
}

module.exports = {
    singUp,
    login,
    resendOtpMail,
    verifyOtp,
    forgetPassword,
    resetPassword,
    changePassword,
    socialLoginRegister,
    getProfile,
    updateProfile,
    sendQueryController,
    goToStripe,
}
