const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const mediaUpload = require('../helpers/mediaUpload')

router
    // login
    .post('/verifyadmin', adminController.verifyAdmin)
    .post('/login', adminController.loginController)
    .post('/verify-otp', adminController.verifyOtp)
    .get('/resend-otp', adminController.resendOtpMail)
    // Forgot Password
    .post('/forgot-password', adminController.forgetPassword)
    // Forgot Password
    .post('/change-password', adminController.changePasswordController)
    .post('/reset-password', adminController.resetPassword)

    // product module
    .get('/product', adminController.getProduct)
    .get('/product/:id', adminController.getProductById)
    .post('/product', adminController.addProduct)
    .post('/update-product', adminController.updateProduct)
    .delete('/delete-product/:id', adminController.deleteProduct)
    .post('/update-product-status', adminController.updateProductStatus)
    .post(
        '/upload-image',
        mediaUpload('product').array('image'),
        adminController.uploadProductImage
    )

    // category module
    .get('/category', adminController.getCategory)
    .get('/category/:id', adminController.getCategoryById)
    .post(
        '/category',
        mediaUpload('categories').single('icon'),
        adminController.addCategory
    )
    .post(
        '/update-category',
        mediaUpload('categories').single('icon'),
        adminController.updateCategory
    )

    // coupon module
    .get('/coupon', adminController.getCoupon)
    .get('/coupon/:id', adminController.getCouponById)
    .post('/add-coupon', adminController.addCoupon)
    .post('/update-coupon', adminController.updateCoupon)
    .get('/delete-coupon', adminController.deleteCoupon)

    // category module
    .get('/course-category', adminController.getCourseCategory)
    .delete('/delete-course-category/:id', adminController.deleteCourseCategory)
    .get('/course-category/:id', adminController.getCourseCategoryById)
    .post('/course-category', adminController.addCourseCategory)
    .post('/update-course-category', adminController.updateCourseCategory)

    // course module
    .get('/course', adminController.getCourse)
    .get('/course/:id', adminController.getCourseById)
    .post('/add-course', adminController.addCourse)
    .post('/update-course', adminController.updateCourse)
    .delete('/delete-course/:id', adminController.deleteCourse)

    // category module
    .get('/plan-category', adminController.getPlanCategory)
    .post('/plan-category', adminController.addPlanCategory)
    .post('/update-plan-category', adminController.updatePlanCategory)

    // plan module
    .get('/plan', adminController.getPlans)
    .get('/filter-member', adminController.getfiltereMember)
    .post('/add-plan', adminController.addPlan)
    .post('/update-plan', adminController.updatePlan)
    .post('/update-plan-status', adminController.updatePlanStatus)
    .get('/plan-user-subscription', adminController.planUserSubscription)
    .get('/delete-plan/:id', adminController.deletePlan)

    // Draw module
    .get('/draw', adminController.getDraws)
    .post(
        '/add-draw',
        mediaUpload('draw').single('image'),
        adminController.addDraw
    )
    .post(
        '/update-draw',
        mediaUpload('draw').single('image'),
        adminController.updateDraw
    )

    // Order module
    .get('/order', adminController.getOrder)
    .get('/order-by-id', adminController.getOrderById)
    .post('/update-order-status', adminController.updateOrderStatus)

    // User module
    .get('/user-filter', adminController.userfilter)
    .get('/user', adminController.getUser)
    .get('/alluser', adminController.getAllUser)
    .get('/user-by-id', adminController.getUserById)
    .post('/update-user-status', adminController.updateUserStatus)
    .post('/update-user', adminController.updateUser)
    .get('/export-user', adminController.exportUser)
    .get('/user-payment-history', adminController.getUserPaymentHistory)
    .get('/user-subscription-history', adminController.getUserSubscription)
    .post('/send-user-mail', adminController.sendUserMail)
    .post('/send-user-notification', adminController.sendUserNotification)
    .post('/sendBulkMail', adminController.sendUsersBulkMail)
    .post('/sendBulkNotification', adminController.sendUsersBulkNotification)
    .post('/reset-user-password', adminController.ResetUserPassword)

    // Static content module
    .get('/get-static-content', adminController.getStaticContentController)
    .post(
        '/update-static-content',
        adminController.updateStaticContentController
    )

    // Help center
    .get('/help-center', adminController.getHelpQuery)
    .post('/update-query', adminController.updateQueryController)
    .delete('/delete-query/:id', adminController.deleteHelpQuery)
    .post('/send-helpcenter-mail', adminController.sendHelpCenterMail)

    // dashboard
    .get('/dashboard', adminController.dashboard)
    .get('/statics-chart', adminController.chart)

    // partner
    .get('/partner-list', adminController.getPartnerList)
    .post(
        '/add-partner',
        mediaUpload('partner').single('image'),
        adminController.addPartner
    )
    .post('/update-partner-status', adminController.updatePartnerStatus)
    .post(
        '/update-partner',
        mediaUpload('partner').single('image'),
        adminController.updatePartnerInfo
    )

    // past winner
    .get('/past-winner', adminController.getPastWinner)
    .get('/past-winner/:id', adminController.getPastWinnerById)
    .post(
        '/past-winner',
        mediaUpload('PastWinner').single('image'),
        adminController.addPastWinner
    )
    .post(
        '/update-past-winner',
        mediaUpload('PastWinner').single('image'),
        adminController.updatePastWinner
    )

    // FAQ
    .get('/faq', adminController.getFaq)
    .get('/faq/:id', adminController.getFaqById)
    .delete('/delete-faq/:id', adminController.deleteFaq)
    .post('/faq', adminController.addFaq)
    .post('/update-faq', adminController.updateFaq)

    // // business category
    // .get('/get-business-category', ()=>{

    // })
    .post('/add-business-category', adminController.addBusinessCategory)
    .post('/update-business-category', adminController.updateBusinessCategory)
    .get('/get-business-category', adminController.getBusinessCategory)
    .delete(
        '/delete-business-category/:id',
        adminController.deleteBusinessCategory
    )

    // Store Status
    .get('/store-status', adminController.getStoreStatus)
    .post('/update-store-status', adminController.updateStoreStatus)
module.exports = router
