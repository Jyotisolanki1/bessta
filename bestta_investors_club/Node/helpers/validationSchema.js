const Joi = require('joi')

const singUpValidation = (body) => {
    const schema = Joi.object({
        firstname: Joi.string(),
        lastname: Joi.string(),
        email: Joi.string().required().label('Email'),
        password: Joi.string().required().label('Password'),
        phone: Joi.number().required().label('phone'),
        age: Joi.number(),
        billing_address: Joi.string(),
        postcode: Joi.string(),
        dob: Joi.string(),
        fcmToken: Joi.string(),
    })
    return schema.validate(body)
}

const loginValidation = (body) => {
    const schema = Joi.object({
        email: Joi.string().required().label('Email'),
        password: Joi.string().required().label('Password'),
        fcmToken: Joi.string(),
    })
    return schema.validate(body)
}

const verifyOtpValidation = (body) => {
    const schema = Joi.object({
        otp: Joi.string().required().label('otp'),
    })
    return schema.validate(body)
}

const forgetPasswordValidation = (body) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label('Email'),
    })
    return schema.validate(body)
}

const resetPasswordValidation = (body) => {
    const schema = Joi.object({
        password: Joi.string().required().label('Password'),
        confirm_password: Joi.string()
            .valid(Joi.ref('password'))
            .required()
            .label('Confirm Password'),
    })
    return schema.validate(body)
}
const changePasswordValidation = (body) => {
    const schema = Joi.object({
        old_password: Joi.string().required().label('Old Password'),
        new_password: Joi.string().required().label('New Password'),
        confirm_password: Joi.string()
            .valid(Joi.ref('new_password'))
            .required()
            .label('Confirm Password'),
    })
    return schema.validate(body)
}

const socialLoginRegisterValidation = (body) => {
    const schema = Joi.object({
        social_id: Joi.string().required(),
        login_type: Joi.string().required().valid('facebook', 'google'),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        email: Joi.string(),
        fcmToken: Joi.string(),
    })
    return schema.validate(body)
}

const addProductValidation = (body) => {
    const schema = Joi.object({
        name: Joi.string().required().label('name'),
        status: Joi.string(),
        category: Joi.string().required().label('category'),
        slug: Joi.string().required().label('slug'),
        productType: Joi.string()
            .required()
            .valid('simple_product', 'variable_product')
            .label('productType'),
        price: Joi.number(),
        stock: Joi.number(),
        description: Joi.string().required().label('description'),
        short_description: Joi.string(),
        discount: Joi.any(),
        variableProducts: Joi.array().items(
            Joi.object().keys({
                image: Joi.any(),
                price: Joi.any(),
                stock: Joi.any(),
                attributes: Joi.array().items(
                    Joi.object().keys({
                        label: Joi.string(),
                        value: Joi.string(),
                    })
                ),
                discount: Joi.object().keys({
                    type: Joi.string(),
                    value: Joi.number(),
                }),
            })
        ),
        images: Joi.any(),
        attributes: Joi.any(),
        tags: Joi.any(),
        metadata: Joi.object().keys({
            title: Joi.string(),
            description: Joi.string(),
        }),
    })
    return schema.validate(body)
}

const updateProductValidation = (body) => {
    const schema = Joi.object({
        id: Joi.string().required().label('id'),
        status: Joi.string(),
        name: Joi.string().required().label('name'),
        category: Joi.string().required().label('category'),
        slug: Joi.string().required().label('slug'),
        productType: Joi.string()
            .required()
            .valid('simple_product', 'variable_product')
            .label('productType'),
        price: Joi.number(),
        stock: Joi.number(),
        description: Joi.string().required().label('description'),
        short_description: Joi.string(),
        discount: Joi.any(),
        variableProducts: Joi.array().items(
            Joi.object().keys({
                _id: Joi.any(),
                image: Joi.any(),
                price: Joi.any(),
                stock: Joi.any(),
                attributes: Joi.array().items(
                    Joi.object().keys({
                        label: Joi.string(),
                        value: Joi.string(),
                    })
                ),
                discount: Joi.object().keys({
                    type: Joi.string(),
                    value: Joi.number(),
                }),
            })
        ),
        images: Joi.any(),
        attributes: Joi.any(),
        tags: Joi.any(),
        metadata: Joi.object().keys({
            title: Joi.string(),
            description: Joi.string(),
        }),
    })
    return schema.validate(body)
}

const addCategoryValidation = (body) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        slug: Joi.string().required(),
        icon: Joi.binary(),
        tags: Joi.any(),
    })
    return schema.validate(body)
}

const updateCategoryValidation = (body) => {
    const schema = Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        icon: Joi.binary(),
        tags: Joi.any(),
        status: Joi.string().valid('enabled', 'disabled').required(),
    })
    return schema.validate(body)
}

const deleteProductValidation = (body) => {
    const schema = Joi.object({
        id: Joi.string().required(),
    })
    return schema.validate(body)
}

const addCartValidation = (body) => {
    const schema = Joi.object({
        cart_id: Joi.string(),
        product_id: Joi.string().required(),
        variable_id: Joi.string(),
        attributes: Joi.array().items(
            Joi.object().keys({
                label: Joi.string(),
                value: Joi.string(),
            })
        ),
        quantity: Joi.number().required(),
    })
    return schema.validate(body)
}

const removeCartItemValidation = (body) => {
    const schema = Joi.object({
        cart_id: Joi.string().required(),
        product_id: Joi.string().required(),
        variable_id: Joi.string().required(),
        quantity: Joi.number(),
    })
    return schema.validate(body)
}

const applyCouponValidation = (body) => {
    const schema = Joi.object({
        cart_id: Joi.string().required(),
        coupon_code: Joi.string().required(),
    })
    return schema.validate(body)
}

const removeCouponValidation = (body) => {
    const schema = Joi.object({
        cart_id: Joi.string().required(),
    })
    return schema.validate(body)
}

const placeOrderValidation = (body) => {
    const schema = Joi.object({
        cart_id: Joi.string().required(),
        shippingAddress: Joi.object()
            .keys({
                streetAddress: Joi.string().required(),
                city: Joi.string().required(),
                state: Joi.string().required(),
                zipCode: Joi.number().required(),
            })
            .required(),
        // billingAddress: Joi.object().keys({
        //     streetAddress: Joi.string().required(),
        //     city: Joi.string().required(),
        //     state: Joi.string().required(),
        //     zipCode: Joi.number().required(),
        // }),
    })
    return schema.validate(body)
}
const addCouponValidation = (body) => {
    const schema = Joi.object({
        code: Joi.string().required(),
        value: Joi.number().required(),
        discountType: Joi.string().valid('fixed', 'percentage').required(),
        description: Joi.string(),
        expirDate: Joi.string().required(),
    })
    return schema.validate(body)
}

const updateCouponValidation = (body) => {
    const schema = Joi.object({
        id: Joi.string().required(),
        code: Joi.string().required(),
        value: Joi.number().required(),
        discountType: Joi.string().valid('fixed', 'percentage').required(),
        description: Joi.string(),
        expirDate: Joi.string().required(),
    })
    return schema.validate(body)
}

const addCourseCategoryValidation = (body) => {
    const schema = Joi.object({
        name: Joi.string().required(),
    })
    return schema.validate(body)
}

const updateCourseCategoryValidation = (body) => {
    const schema = Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        status: Joi.string().valid('enabled', 'disabled').required(),
    })
    return schema.validate(body)
}

const addCourseValidation = (body) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        video: Joi.string().required(),
        videoType: Joi.string().valid('upload', 'youtube', 'vimeo').required(),
        category: Joi.string().required(),
        tags: Joi.any().required(),
        instructor: Joi.string(),
        instructor_intro: Joi.string(),
    })
    return schema.validate(body)
}

const updateCourseValidation = (body) => {
    const schema = Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string().required(),
        video: Joi.string().required(),
        videoType: Joi.string().valid('upload', 'youtube', 'vimeo').required(),
        category: Joi.string().required(),
        tags: Joi.any().required(),
        status: Joi.string().required(),
        instructor: Joi.string(),
        instructor_intro: Joi.string(),
    })
    return schema.validate(body)
}

const updateProfileValidation = (body) => {
    const schema = Joi.object({
        firstname: Joi.string(),
        lastname: Joi.string(),
        phone: Joi.number().required().label('phone'),
        image: Joi.binary(),
    })
    return schema.validate(body)
}

const paymentStatusValidation = (body) => {
    const schema = Joi.object({
        client_secret: Joi.string().required(),
    })
    return schema.validate(body)
}

const addPlanValidation = (body) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        category: Joi.string().required(),
        intervalType: Joi.string()
            .valid('fixed', 'day', 'week', 'month', 'year')
            .required(),
        intervalCount: Joi.number().required(),
        entries: Joi.number().required(),
        price: Joi.number().required(),
        discription: Joi.string().required(),
        mostPopuler: Joi.string().required(),
    })
    return schema.validate(body)
}

const updatePlanValidation = (body) => {
    const schema = Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        entries: Joi.number().required(),
        discription: Joi.string().required(),
        mostPopuler: Joi.string().required(),
        price: Joi.number().required(),
    })
    return schema.validate(body)
}

const subscriptionCheckoutValidation = (body) => {
    const schema = Joi.object({
        plan_id: Joi.string().required(),
        draw_id: Joi.string(),
    })
    return schema.validate(body)
}

const addDrawValidation = (body) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        scheduleDate: Joi.string().required(),
        image: Joi.binary(),
        discription: Joi.string().required(),
        prizes: Joi.array().items(
            Joi.object().keys({
                quantity: Joi.number().required(),
                reserves: Joi.number().required(),
                description: Joi.string().required(),
            })
        ),
    })
    return schema.validate(body)
}

const editDrawValidation = (body) => {
    const schema = Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        scheduleDate: Joi.string().required(),
        image: Joi.binary(),
        discription: Joi.string().required(),
        prizes: Joi.array().items(
            Joi.object().keys({
                quantity: Joi.number().required(),
                reserves: Joi.number().required(),
                description: Joi.string().required(),
            })
        ),
    })
    return schema.validate(body)
}

const sendQueryValidation = (body) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        mobile: Joi.string().required(),
        message: Joi.string().required(),
        reply: Joi.string(),
    })
    return schema.validate(body)
}

const reviewRatingValidation = (body) => {
    const schema = Joi.object({
        order_id: Joi.string().required(),
        product_id: Joi.string().required(),
        rating: Joi.number().required(),
        comment: Joi.string().required(),
    })
    return schema.validate(body)
}

const idValueValidation = (body) => {
    const schema = Joi.object({
        id: Joi.string().required(),
    })
    return schema.validate(body)
}

const typeValidation = (body) => {
    const schema = Joi.object({
        type: Joi.string().required(),
        id: Joi.string().required(),
    })
    return schema.validate(body)
}

const mailValidation = (body) => {
    const schema = Joi.object({
        id: Joi.string().required(),
        message: Joi.string().required(),
        subject: Joi.string().required(),
    })
    return schema.validate(body)
}

const updateOrderStatusValidation = (body) => {
    const schema = Joi.object({
        id: Joi.string().required(),
        status: Joi.string()
            .valid('hold', 'paid', 'shipped', 'delivered')
            .required(),
    })
    return schema.validate(body)
}

const addPartnerValidation = (body) => {
    const schema = Joi.object({
        firstname: Joi.string(),
        lastname: Joi.string(),
        password: Joi.string(),
        bussiness_name: Joi.string(),
        bussiness_url: Joi.string(),
        abn: Joi.string(),
        email: Joi.string().required().label('Email'),
        phone: Joi.number().required().label('phone'),
        image: Joi.binary(),
        address: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        country: Joi.string(),
        zipcode: Joi.string(),
        category: Joi.string(),
        other_category: Joi.string(),
    })
    return schema.validate(body)
}

module.exports = {
    singUpValidation,
    loginValidation,
    verifyOtpValidation,
    forgetPasswordValidation,
    resetPasswordValidation,
    changePasswordValidation,
    socialLoginRegisterValidation,
    addProductValidation,
    addCategoryValidation,
    updateCategoryValidation,
    addCartValidation,
    addCouponValidation,
    removeCouponValidation,
    updateCouponValidation,
    updateProductValidation,
    addCourseCategoryValidation,
    updateCourseCategoryValidation,
    addCourseValidation,
    updateCourseValidation,
    updateProfileValidation,
    applyCouponValidation,
    placeOrderValidation,
    paymentStatusValidation,
    removeCartItemValidation,
    addPlanValidation,
    updatePlanValidation,
    subscriptionCheckoutValidation,
    addDrawValidation,
    editDrawValidation,
    sendQueryValidation,
    reviewRatingValidation,
    idValueValidation,
    updateOrderStatusValidation,
    addPartnerValidation,
    deleteProductValidation,
    typeValidation,
    mailValidation,
}
