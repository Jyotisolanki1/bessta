const cron = require('node-cron')
const moment = require('moment')
const mongoose = require('mongoose')
require('dotenv').config()
const subcriptionModel = require('../models/subcriptionModel')

const runCronJob = async () => {
    try {
        console.log('Running cron job...')

        const subscriptions = await subcriptionModel.find({
            status: 'resume',
            type: 'recurring',
        })

        console.log(
            'Subscriptions with resume status found:',
            subscriptions.length
        )

        if (subscriptions.length === 0) {
            console.log('No subscriptions with resume status found.')
            return
        }

        for (const subscription of subscriptions) {
            console.log('Processing subscription:', subscription._id)

            const activeSubscription = await subcriptionModel.findOne({
                uid: subscription.uid,
                status: 'active',
                type: 'recurring',
            })

            if (!activeSubscription) {
                console.log(
                    `No active subscription found for user ${subscription.uid}. Skipping resume status subscription.`
                )
                continue
            }

            const billingCycleEnd = moment(activeSubscription.endDate)
            const currentDate = moment()

            console.log('Current Date:', currentDate.format())
            console.log('Billing Cycle End Date:', billingCycleEnd.format())

            if (currentDate.isAfter(billingCycleEnd)) {
                console.log(
                    `Billing cycle for active subscription ${activeSubscription._id} has ended.`
                )

                const updateResult = await subcriptionModel.updateOne(
                    { _id: activeSubscription._id },
                    { $set: { status: 'update' } }
                )
                console.log(
                    `Update operation result for active subscription ${activeSubscription._id}:`,
                    updateResult
                )

                const sameUserSubscriptions = await subcriptionModel.find({
                    uid: subscription.uid,
                    status: 'resume',
                })

                console.log(
                    `Found ${sameUserSubscriptions.length} 'resume' subscriptions for user ${subscription.uid}`
                )

                // If there are any subscriptions with 'resume' status, update their status to 'active'
                for (const userSubscription of sameUserSubscriptions) {
                    const resumeResult = await subcriptionModel.updateOne(
                        { _id: userSubscription._id },
                        { $set: { status: 'active' } }
                    )
                    console.log(
                        `Resume operation result for user ${subscription.uid}:`,
                        resumeResult
                    )
                }
            } else {
                console.log(
                    `Billing cycle for active subscription ${activeSubscription._id} has not ended yet.`
                )
            }
        }
    } catch (err) {
        console.error('Error in cron job:', err)
    }
}

// Schedule cron job to run every minute for testing purposes
const scheduleCronJob = () => {
    cron.schedule('* * * * *', runCronJob)
    console.log('Cron job scheduled to run every day at midnight (00:00)')
}
module.exports = {
    scheduleCronJob, // Export the function to start the cron job
}
