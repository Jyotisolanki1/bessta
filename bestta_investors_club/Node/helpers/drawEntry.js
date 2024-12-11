const { default: mongoose } = require('mongoose')
const subcriptionModel = require('../models/subcriptionModel')
const moment = require('moment')

/*
Logic Of Entry Calculation - 

Your entries never expire as long as you stay on the same level or upgrade. However, if you decide to downgrade your membership or terminate, you broke the magic of the compounding effect so you have to start from the bottom again without accumulation.  For example, If you hold a silver membership for four months you will receive（4 months x 12 entries 48 entries into a promotional draw. However, if you then decide to downgrade your membership to the bronze membership for your fifth month, you broke the magic of the compounding effect just like you choose to terminate so you have to start from the bottom again. In the case of the above downgrade, we generate entries for a promotion while you’re on the bronze level tier, you’ll only receive  ( 5 months x 3 entries )15 entries. However, to help you better understand and appreciate the magic of the compounding effect, If you then upgrade back to the silver membership for your sixth month, and the system will generate entries for a promotion where you will receive(4 months x 12 entries +1 month x 3 entries +1 month x 12 entries) 63 entries for that promotion. If you then decide to upgrade to a Diamond membership the following month, the total entries should be (4 months x 12 entries +1 month x 3 entries +1 month x 12 entries +1 month x 1,500) 1,563 entries.
*/
const getUserEntry = async (userId) => {
    let subcriptions = await subcriptionModel.find(
        {
            uid: new mongoose.Types.ObjectId(userId),
            type: 'recurring',
            status: { $in: ['active', 'update', 'cancel'] },
        },
        {},
        { sort: { startDate: -1 } }
    )
    let entry = 0
    let activeEntry = 0
    let activeAmount = 0
    let higherAmountPlan = 0
    let monthCount = 0
    for (let i = 0; i < subcriptions.length; i++) {
        // user cancel the subcription logic is break
        if (subcriptions[i]['status'] == 'cancel') {
            if (i + 1 < subcriptions.length) {
                let now = moment(subcriptions[i]['startDate'])
                let end = moment(subcriptions[i + 1]['endDate'])
                let duration = now.diff(end, 'days')
                // console.log('duration', i, duration)
                if (duration > 20) {
                    break
                }
            }
        }
        monthCount++
        entry += subcriptions[i]['entries']
        // Higher ammount plan find
        if (higherAmountPlan < subcriptions[i]['amount']) {
            higherAmountPlan = subcriptions[i]['amount']
        }
        // get active plan value
        if (subcriptions[i]['status'] == 'active') {
            activeEntry = subcriptions[i]['entries']
            activeAmount = subcriptions[i]['amount']
        }

        if (i + 1 < subcriptions.length) {
            let now = moment(subcriptions[i]['startDate'])
            let end = moment(subcriptions[i + 1]['endDate'])
            let duration = now.diff(end, 'days')
            // console.log('duration', i, duration)
            if (duration > 20) {
                break
            }
        }
    }

    if (activeAmount < higherAmountPlan) {
        entry = monthCount * activeEntry
    }
    return entry
}

module.exports = { getUserEntry }
