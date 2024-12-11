const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/AuthController')
const ecommController = require('../controllers/ecommerceController')
const mediaUpload = require('../helpers/mediaUpload')
// Auth module
router
    .post('/register', AuthController.singUp)

    .get('/resend-otp', AuthController.resendOtpMail)

    .post('/verify-otp', AuthController.verifyOtp)

    .post('/login', AuthController.login)

    .post('/forget-password', AuthController.forgetPassword)

    .post('/reset-password', AuthController.resetPassword)

    .post('/change-password', AuthController.changePassword)

    .get('/profile', AuthController.getProfile)
    .get('/go-to-stripe', AuthController.goToStripe)

    .post(
        '/profile',
        mediaUpload('profile').single('image'),
        AuthController.updateProfile
    )

    .post('/social-login-register', AuthController.socialLoginRegister)

    // help center
    .post('/send-query', AuthController.sendQueryController)

    .get('/category', ecommController.getCategory)

    .get('/product', ecommController.getProduct)

    .get('/suggested-product', ecommController.getSuggestedProduct)

    .get('/product-by-id', ecommController.getProductById)

    .get('/get-cart', ecommController.getCart)

    .post('/add-cart', ecommController.addCart)

    .post('/remove-cart-item', ecommController.removeCartItem)

    .post('/apply-coupon', ecommController.applyCoupon)

    .post('/remove-coupon', ecommController.removeCoupon)

    .post('/place-order', ecommController.placeOrder)

    .post('/payment-status', ecommController.paymentStatus)

    .get('/banner', ecommController.getBanner)

    .get('/course-category', ecommController.getCourseCategory)

    .get('/course', ecommController.getCourse)

    .get('/plan-category', ecommController.getPlanCategory)

    .get('/plans', ecommController.getPlans)

    .get('/my-order', ecommController.getMyOrder)

    .post('/review-rating', ecommController.reviewRating)

    .post('/subscription-checkout', ecommController.subscriptionCheckout)

    .post('/subscription-status', ecommController.subscriptionStatus)

    .get('/cancel-subscription', ecommController.cancelSubscription)
    .get('/delete-account', ecommController.deleteUserAcount)

    .post('/update-subscription', ecommController.updateSubscription)

    .get('/subscription-history', ecommController.subscriptionHistory)

    .get('/draw', ecommController.getDraws)

    .get('/notification', ecommController.getNotification)

    .get('/randomdrawsDraw', ecommController.randomdrawsDraw)

    .post('/stripe_webhook', ecommController.stripeWebhook)

    .post('/draw-user-list', ecommController.getDrawUserList)

    .post('/winner', ecommController.getWinner)

    // Static content module
    .get('/get-static-content', ecommController.getStaticContentController)

    .post(
        '/add-partner',
        mediaUpload('partner').single('image'),
        ecommController.addPartner
    )

    .post('/partner-status', ecommController.partnerStatus)
    .post('/admin-partner-status', ecommController.adminpartnerStatus)

    .get('/get-partner', ecommController.getPartner)

    .get('/past-winner', ecommController.getPastWinner)

    .get('/faq', ecommController.getFaq)

    .get('/get-business-category', ecommController.getBusinessCategory)

    .post('/apply-draw-entry', ecommController.applyDrawEntry)

    .get('/store-status', ecommController.storeStatus)

    .post(
        '/become-a-partner',
        mediaUpload('partner').single('image'),
        ecommController.becomeAPartner
    )
module.exports = router
