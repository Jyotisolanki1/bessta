// let admin = require('firebase-admin');
// let googleServiceAccount = require('../config/google-services.json')
// admin.initializeApp({
//     credential: admin.credential.cert(googleServiceAccount),
// })
// class SendNotificationHelper {
//     sendPushNotification(values) {
//         const registrationTokens = values.device_ids
//         if (!registrationTokens) {
//             return
//         }
//         console.log("registrationTokens",registrationTokens[0]);
        
//         // let payload = {
//         //     notification: {
//         //         title: values.title,
//         //         body: values.body,
//         //     },
//         //     data: values && values.data ? values.data : {},
//         // }

//         var payload = {
//             token: registrationTokens[0],
//             notification: {
//                 title: values.title,
//                 body: values.body,
//             },
//             data: values && values.data ? values.data : {},
//             // data: values && values.data ?JSON.parse(JSON.stringify(values.data)):{}
//         }

//         // const option = {
//         //     priority: 'high',
//         //     timeToLive: 60 * 60 * 24,
//         // }

//         admin
//             .messaging()
//             .send(payload)
//             .then((response) => {
//                 console.info('Notification sent successfully', response)
//             })
//             .catch((error) => {
//                 console.error('Notification', error)
//             })
//     }
// }

// module.exports = new SendNotificationHelper()

let admin = require('firebase-admin');
let googleServiceAccount = require('../config/google-services.json');

admin.initializeApp({
    credential: admin.credential.cert(googleServiceAccount),
});

class SendNotificationHelper {
    sendPushNotification(values) {
        let registrationTokens = values.device_ids;
        console.log("registrationTokens", registrationTokens);
        if (!registrationTokens || registrationTokens.length === 0) {
            return;
        }
        console.log("typeof registrationTokens", typeof registrationTokens);

        // Check if registrationTokens is a string
        if (typeof registrationTokens == 'string') {
            registrationTokens = [registrationTokens]; // Convert string to array
        }
        
        console.log("registrationTokensssssss", registrationTokens); // Now it's an array
     

        // Payload for the notification
        let message = {
            notification: {
                title: values.title,
                body: values.body,
            },
            data: values.data ? values.data : {}, // optional custom data
            tokens: registrationTokens // Correct usage: an array of tokens
        };

        // Send notification to multiple devices using multicast
        admin
            .messaging()
            .sendEachForMulticast(message)
            .then((response) => {
                console.info('Notifications sent:', response.successCount);
                // Handle any failures
                response.responses.forEach((result, index) => {
                    if (!result.success) {
                        console.error(`Failed to send notification to ${registrationTokens[index]}`, result.error);
                    } else {
                        console.info(`Notification sent to ${registrationTokens[index]}`);
                    }
                });
            })
            .catch((error) => {
                console.error('Error sending notification:', error);
            });
    }
}

module.exports = new SendNotificationHelper();

