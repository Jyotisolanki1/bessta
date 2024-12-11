const smsService = async (req, res) => {
    // let url = "http://67.43.3.105:9501/api?action=sendmessage&username=morep&password=iVoCksJV&recipient=+258845493281&messagetype=SMS:TEXT&messagedata=testing_sms_from_sislog"

    const username = 'morep1'
    const password = 'iVoCksJV'
    const recipient = '+919977287074'

    try {
        const callApi = await fetch(
            `http://67.43.3.105:9501/api?action=sendmessage&username=${username}&password=${password}&recipient=${recipient}&messagetype=SMS:TEXT&messagedata=testing_sms_from_sislog`,
            {
                method: 'POST',
            }
        )
            .then(async (data) => {
                return res.json({
                    success: true,
                    message: res.__('Successfully.'),
                    data: { data },
                })
            })
            .catch((err) => {
                console.error('smsService Error : ', err)
                return res.json({
                    success: false,
                    message: `Error : ${err}`,
                    data: {},
                })
            })
    } catch (error) {
        return res.json({
            success: false,
            message: res.__(`Something wants wrong`),
            data: {},
        })
    }
}

module.exports = smsService
