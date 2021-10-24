const nodemailer = require('nodemailer');
const CONFIG = require('../../config/default.json');
module.exports.sendMail = function (fromEmail='',to, subject,message,filename='') {

        fromEmail = fromEmail=="" ? CONFIG.SUPPORT_EMAIL : fromEmail;
        var toEmail = to;
        var transporter = nodemailer.createTransport({
            service: CONFIG.SERVICE,
            auth: {
                user: CONFIG.USER,
                pass: CONFIG.PASS
            }
        });
        transporter.sendMail({
            from: fromEmail,
            to: toEmail,
            subject: subject,
            // text: url,
            html: message,
            attachments: filename
        }, function (error, response) {
            if (error) {
                console.log('err',error);
            } else {
                console.log('Success',response);
            }
        });
};
