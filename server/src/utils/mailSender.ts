import nodeMailer from "nodemailer";
import { SendMailOptions } from "nodemailer";

interface MailTransporter {
    host: string | undefined;
    auth: {
        user: string | undefined;
        pass: string | undefined;
    };
}

const mailSender = async (
    email: string,
    title: string,
    body: string
): Promise<SendMailOptions | undefined> => {
    try {
        const transporter = nodeMailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        } as MailTransporter);

        const info = await transporter.sendMail({
            from: "SkillScript - by Raj",
            to: email,
            subject: title,
            html: body,
        });

        return info;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.log("Error in mailSender Util", errorMessage);
        return undefined;
    }
};

module.exports = mailSender;

