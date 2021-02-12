const nodemailer = require('nodemailer')

const htmlPage = require('../htmlPages/sendEmail')

exports.sendEmail = async function(userEmail , resetCode) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing

    let myAccount = {
        user: 'Chefaa.mearn.official@gmail.com',
        pass: 'chefaa-2021',
        smtp: { host: 'smtp.gmail.com', port: 465, secure: true },
        imap: { host: 'imap.gmail.com', port: 993, secure: true }
    }

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: myAccount.user, // generated ethereal user
            pass: myAccount.pass, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({

        from: 'Chefaa.mearn.official@gmail.com', // sender address
        to: userEmail, // list of receivers
        subject: "Hello from node js - Ali", // Subject line
        // text: "Hello world?", // plain text body
        // html: htmlPage.htmlContent, // html body
        html: htmlPage.SendCode(resetCode), // html body

    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

}