const { razorpayInstance, instance } = require("../config/razorpay");

const User_Model = require("../models/User.model");
const Course_Model = require("../models/Course.model");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");
const crypto = require("crypto");
const { paymentSuccessEmail } = require("../mail/paymentSuccessEmail");

exports.capturePayment = async (req, res) => {
    //fetch all courses id and user id
    console.log("inside cap pay cnt");
    const { courses } = req.body;

    const userId = req.user.id;
    // console.log("userId :", userId);

    if (courses.length === 0) {
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
            console.log("Error in capture payment..", error);
            return res.status(500).json({
                success: false,
                message: "Error in capture payment",
            });
        }
    }

    const options = {
        amount: totalAmount * 100,
        currency: "INR",
        receipt: Math.random(Date.now()).toString(),
    };

    try {
        const paymentResponse = await instance.orders.create(options);
        return res.status(200).json({
            success: true,
            message: paymentResponse,
        });
    } catch (error) {
        console.log("Error in capture payment 2:", error);

        return res.status(500).json({
            success: false,
            message: "Could not initiate order",
        });
    }
};

exports.verifyPayment = async (req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;

    const courses = req.body?.courses;
    const userId = req.user.id;

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

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        //enroll student
        await enrollStudents(courses, userId, res);

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

const enrollStudents = async (courses, userId, res) => {
    if (!courses || !userId) {
        return res.status(404).json({
            success: false,
            message: "Please provide all the data",
        });
    }

    for (const courseId of courses) {
        try {
            //find the course  and push the student in it.
            const enrolledCourse = await Course_Model.findOneAndUpdate(
                { _id: courseId },
                { $push: { studentsEnrolled: userId } },
                { new: true }
            );

            if (!enrolledCourse) {
                return res.status(404).json({
                    success: false,
                    message: "Course not found",
                });
            }

            // find the student and push course in them

            const enrolledStudent = await User_Model.findByIdAndUpdate(
                userId,
                {
                    $push: { courses: courseId },
                },
                { new: true }
            );

            //send mail to student
            const emailResponse = await mailSender(
                enrolledStudent.email,
                `Successfully Enrolled into the course ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(
                    enrolledCourse.courseName,
                    `${enrolledStudent.firstName}`
                )
            );
            // console.log("Email Sent Successfully", emailResponse.response);
        } catch (error) {
            console.log("Error in Enrolling Students", error);
            return res.status(500).json({
                success: false,
                message: "Error in Enrolling Students",
            });
        }
    }
};

exports.sendPaymentMail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body;

    const userId = req.user.id;

    if (!orderId || !paymentId || !amount || !userId) {
        return res.status(404).json({
            success: false,
            message: "Please provide sufficient data",
        });
    }

    try {
        //find student

        console.log("Inside mail sender");

        const enrolledStudent = await User_Model.findById(userId);

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

        console.log("Mail response", emailResponse);
    } catch (error) {
        console.log("Error in sending mail", error);
        return res.status(500).json({
            success: false,
            message: "Error in sending mail",
        });
    }
};
