//make a contact us make controller and db model
import { Request, Response } from "express";
const ContactUs_Model = require("../models/ContactUs.model");
const mailSender = require("../utils/mailSender");

export const createContactUs = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        //get the data
        const {
            firstName,
            lastName,
            message,
            email,
            phoneNo = "",
            subject,
        } = req.body;

        //validate
        if (!firstName || !lastName || !message || !email || !subject) {
            return res.status(400).json({
                success: false,
                message: "Data is missing",
            });
        }
        //create db entry - only include phoneNo if it's provided and not empty
        const contactData: any = {
            firstName,
            lastName,
            email,
            subject,
            message,
        };
        
        if (phoneNo && phoneNo.trim() !== "") {
            contactData.phoneNo = phoneNo;
        }
        
        const updateContactUs = await ContactUs_Model.create(contactData);

        //send mail to user
        const emailToUser = await mailSender(
            email,
            "FeedBack sent successfully",
            "Thanks for sending us the feedback."
        );

        //send mail to yourself about the feedback
        const emailToUs = await mailSender(
            process.env.MAIL_USER, //our Email
            "One FeedBack Received",
            `Someone has just sent us a feedback : ${updateContactUs}`
        );
        //return
        return res.status(200).json({
            success: true,
            message: "Contact details saved successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in creating contact us entries",
        });
    }
};

