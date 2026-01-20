import { Request, Response } from "express";
import mongoose from "mongoose";
import crypto from "crypto";
const { razorpayInstance, instance } = require("../config/razorpay");

const User_Model = require("../models/User.model");
const Course_Model = require("../models/Course.model");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/courseEnrollmentEmail");
const { paymentSuccessEmail } = require("../mail/paymentSuccessEmail");
const CourseProgress_Model = require("../models/CourseProgress.model");

interface AuthRequest extends Request {
    user?: {
        id: string;
        [key: string]: any;
    };
}

export const capturePayment = async (req: AuthRequest, res: Response): Promise<Response | void> => {
    //fetch all courses id and user id
    const { courses } = req.body;

    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "User not authenticated",
        });
    }

    if (!courses || courses.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Please Provide Course Id",
        });
    }
    let totalAmount = 0;

    for (const course_id of courses) {
        let course;
        try {
            //check course is valid

            course = await Course_Model.findById(course_id);

            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: "Could not find the course",
                });
            }

            //check is user already enrolled

            const uId = new mongoose.Types.ObjectId(userId);

            if (course.studentsEnrolled.includes(uId)) {
                return res.status(400).json({
                    success: false,
                    message: "User is already Enrolled in this course",
                });
            }

            totalAmount += course.price;
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error in capture payment",
            });
        }
    }

    const options = {
        amount: totalAmount * 100,
        currency: "INR",
        receipt: (Math.random() * Date.now()).toString(),
    };

    try {
        const paymentResponse = await instance.orders.create(options);
        return res.status(200).json({
            success: true,
            message: paymentResponse,
        });
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Could not initiate order",
        });
    }
};

export const verifyPayment = async (req: AuthRequest, res: Response): Promise<Response | void> => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;

    const courses = req.body?.courses;
    const userId = req.user?.id;

    if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        !courses ||
        !userId
    ) {
        return res.status(404).json({
            success: false,
            message: "Payment failed due to insufficient data",
        });
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;

    const razorpaySecret = process.env.RAZORPAY_SECRET;
    if (!razorpaySecret) {
        return res.status(500).json({
            success: false,
            message: "Razorpay secret not configured",
        });
    }

    const expectedSignature = crypto
        .createHmac("sha256", razorpaySecret)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        //enroll student
        const enrollResult = await enrollStudents(courses, userId);
        if (!enrollResult.success) {
            return res.status(enrollResult.status || 500).json({
                success: false,
                message: enrollResult.message,
            });
        }

        //return res
        return res.status(200).json({
            success: true,
            message: "Payment Verified.",
        });
    }

    return res.status(400).json({
        success: false,
        message: "Payment Failed",
    });
};

const enrollStudents = async (courses: string[], userId: string): Promise<{ success: boolean; message?: string; status?: number }> => {
    if (!courses || !userId) {
        return {
            success: false,
            message: "Please provide all the data",
            status: 404,
        };
    }

    for (const courseId of courses) {
        try {
            //find the course and push the student in it.
            const enrolledCourse = await Course_Model.findOneAndUpdate(
                { _id: courseId },
                { $push: { studentsEnrolled: userId } },
                { new: true }
            );

            if (!enrolledCourse) {
                return {
                    success: false,
                    message: "Course not found",
                    status: 404,
                };
            }
            const courseProgress = await CourseProgress_Model.create({
                courseID: courseId,
                userId: userId,
                completedVideos: [],
            });

            // find the student and push course in them

            const enrolledStudent = await User_Model.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        courses: courseId,
                        courseProgress: courseProgress._id,
                    },
                },
                { new: true }
            );

            if (!enrolledStudent) {
                return {
                    success: false,
                    message: "Student not found",
                    status: 404,
                };
            }

            //send mail to student
            const emailResponse = await mailSender(
                enrolledStudent.email,
                `Successfully Enrolled into the course ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(
                    enrolledCourse.courseName,
                    `${enrolledStudent.firstName}`
                )
            );
        } catch (error) {   
            return {
                success: false,
                message: "Error in Enrolling Students",
                status: 500,
            };
        }
    }
    
    return { success: true };
};

export const sendPaymentMail = async (req: AuthRequest, res: Response): Promise<Response | void> => {
    const { orderId, paymentId, amount } = req.body;

    const userId = req.user?.id;

    if (!orderId || !paymentId || !amount || !userId) {
        return res.status(404).json({
            success: false,
            message: "Please provide sufficient data",
        });
    }

    try {
        //find student


        const enrolledStudent = await User_Model.findById(userId);

        if (!enrolledStudent) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        //send mail

        const emailResponse = await mailSender(
            enrolledStudent.email,
            `Payment Successful`,
            paymentSuccessEmail(
                `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
                amount / 100,
                orderId,
                paymentId
            )
        );

        
        return res.status(200).json({
            success: true,
            message: "Payment success email sent",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in sending mail",
        });
    }
};

