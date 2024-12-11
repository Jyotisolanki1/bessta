const nodeMailer = require('nodemailer')
const path = require('path')
const sendEmail = async (name = 'Guest', email, subject, body) => {
    let content = body // Ensure that `content` starts as a copy of `body`

    const imageMatches = content.match(
        /<img[^>]+src="data:image\/[^;]+;base64[^">]+"[^>]*>/g
    )

    const images = imageMatches
        ? imageMatches
              .map((imgTag, index) => {
                  const srcMatch = imgTag.match(/src="([^"]+)"/)
                  if (srcMatch) {
                      const cid = `image${index + 1}`
                      const base64Data = srcMatch[1].split('base64,')[1]
                      const styledImgTag = imgTag.replace(
                          /src="([^"]+)"/,
                          `src="cid:${cid}" style="width: 100%;"`
                      )

                      // Update content with styled image tag
                      content = content.replace(imgTag, styledImgTag)
                      // Replace the image src with cid reference
                      content = content.replace(srcMatch[1], `cid:${cid}`)

                      return {
                          filename: `${cid}.png`,
                          content: base64Data,
                          cid,
                          encoding: 'base64',
                      }
                  }
                  return null
              })
              .filter(Boolean)
        : []

    const message = `
        <div style="background-color:#eded47;padding:10px;">
            <div
            style="width: 60%; margin: 20px; padding: 20px; background-color:white;margin-left:auto; margin-right:auto; border-radius:20px;">
            <div style="border-bottom: 2px solid gray; padding-bottom: 10px; text-align:center;">
                <img src="cid:unique@appleImage" alt="apple-icon">
            </div>
            <p style="font-weight: bold;">
                Dear ${name}
            </p><br />
            <p>
                ${content}
            </p><br />
            <div>
                <h4 style="margin:0;padding:0;">Regards</h4>
                <p style="margin:0;padding:0;">Team Bestta Investors Club</p>
            </div>
            </div>
        </div>
    `

    const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    })

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject: subject,
        html: message, // Content with embedded CIDs
        attachments: [
            ...images,
            {
                filename: 'logo.png',
                path: './public/logo.png', // Provide the correct path to your image
                cid: 'unique@appleImage',
            },
        ],
    }

    return await transporter.sendMail(mailOptions)
}
// const sendEmail = async (name = 'Guest', email, subject, body) => {
//     const message = `
//         <div style="background-color:#eded47;padding:10px;">
//             <div style="width: 60%; margin: 20px; padding: 20px; background-color:white; margin-left:auto; margin-right:auto; border-radius:20px;">
//                 <div style="border-bottom: 2px solid gray; padding-bottom: 10px; text-align:center;">
//                     <img src="cid:logoImage" alt="logo">
//                 </div>
//                 <p style="font-weight: bold;">
//                     Dear ${name},
//                 </p><br />
//                 <p>
//                     ${body}
//                 </p><br />
//                 <div>
//                     <h4 style="margin:0;padding:0;">Regards</h4>
//                     <p style="margin:0;padding:0;">Team Bestta Investors Club</p>
//                 </div>
//             </div>
//         </div>
//     `;

//     const transporter = nodeMailer.createTransport({
//         host: process.env.SMTP_HOST,
//         port: process.env.SMTP_PORT,
//         secure: true, // Use SSL
//         auth: {
//             user: process.env.SMTP_MAIL,
//             pass: process.env.SMTP_PASSWORD,
//         },
//     });

//     const mailOptions = {
//         from: process.env.SMTP_MAIL,
//         to: email,
//         subject: subject,
//         html: message, // Content with embedded CIDs
//         attachments: [
//             {
//                 filename: 'logo.png', // Ensure the file name is correct
//                 path: path.resolve('./public/logo.png'), // Provide the correct absolute path
//                 cid: 'logoImage', // Ensure this matches the src in HTML
//             },
//         ],
//     };

//     try {
//         const info = await transporter.sendMail(mailOptions);
//         console.log('Email sent:', info.response);
//     } catch (error) {
//         console.error('Error sending email:', error);
//     }
// };
const helpcentermail = async (name = 'Guest', email, subject, body) => {

    // return true
    const message = `
            <div style="background-color:#eded47;padding:10px; ">
                <div
                style="width: 60%; margin: 20px; padding: 20px; background-color:white;margin-left:auto; margin-right:auto; border-radius:20px;">
                <div style="border-bottom: 2px solid gray; padding-bottom: 10px; text-align:center;">
                    <img src="cid:unique@appleImage" alt="apple-icon">
                </div>
                <p style="font-weight: bold;">
                 You have  New query from ${name}
                </p><br />
                 <tr>
              <th>Name</th>
              <td>${name}</td>
              </tr>
              <tr>
              <th>Email</th>
              <td>${email}</td>
              </tr>
              <tr>
              <th>Message</th>
              <td>${body}</td>
              </tr><br />
                <div>
                    <h4 style="margin:0;padding:0;">Regards</h4>
                    <p style="margin:0;padding:0;">${name}</p>
                </div>

                </div>
            </div>
        `

    const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    })
    const mailOptions = {
        from: email,
        to: 'support@bestta.com.au',
        subject: subject,
        html: message,
        attachments: [
            {
                filename: 'logo.png',
                path: './public/logo.png',
                cid: 'unique@appleImage',
            },
        ],
    }

    return await transporter.sendMail(mailOptions)
}

module.exports = { sendEmail, helpcentermail }
