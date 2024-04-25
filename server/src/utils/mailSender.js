const nodeMailer = require("nodemailer");

module.exports = async function mailSender(email, title, body) {
    try {
        let Transporter = nodeMailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        let info = await Transporter.sendMail({
            from: "EdTech - by Raj",
            to: email,
            subject: title,
            html: body,
        });

        console.log("Mail Info", info);
        return info;
    } catch (error) {
        console.log("Error in mailSender Util", error.message);
    }
};
