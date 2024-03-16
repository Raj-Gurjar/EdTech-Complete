const { razorpayInstance } = require("../config/razorpay");

const User_Model = require("../models/User.model");
const Course_Model = require("../models/Course.model");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/courseEnrollment");
const { default: mongoose } = require("mongoose");

exports.capturePayment = async (req, res) => {
    //* get data
    const { courseId } = req.body;
    const userId = req.user.id;

    //* validation

    if (!courseId) {
        return res.status(400).json({
            success: false,
            message: "Please provide course iD.",
        });
    }
    //valid course detail
    let courseDetails;
    try {
        courseDetails = await Course_Model.findById(courseId);

        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: "Could not find Course Details",
            });
        }

        //check if the user has bought the course already or not
        // here userId is string but in course user is stored in obj

        const uId = new mongoose.Types.ObjectId(userId);

        if (courseDetails.studentsEnrolled.includes(uId)) {
            return res.status(400).json({
                success: false,
                message: "Student is already enrolled.",
            });
        }
    } catch (error) {
        console.log("Error in fetching user/course in payments :", error);
        return res.status(500).json({
            success: false,
            message: "Error while fetching course or user.",
        });
    }

    //* order create

    const amount = courseDetails.price;
    const currency = "INR";

    const options = {
        amount: amount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes: {
            courseId: courseId,
            userId,
        },
    };

    //function call

    try {
        //initiate the payment using razorpay
        const paymentResponse = await razorpayInstance.orders.create(options);
        console.log("Payment Response: ", paymentResponse);

        return res.status(200).json({
            success: true,
            message: "Order initiated successfully",
            courseName: courseDetails.courseName,
            courseDescription: courseDetails.courseDescription,
            thumbnail: courseDetails.thumbnail,
            orderId: paymentResponse.orderId,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,
        });
    } catch (error) {
        console.log("Error in razorpay order initiation :", error);

        return res.status(500).json({
            success: false,
            message: "Could not initiate order.",
        });
    }

    //*return
};

exports.verifyPaymentSignature = async (req, res) => {
    const webhookSecret = "@Raj$29";

    const signature = req.headers("x-razorpay-signature");

    const SHAsum = crypto.createHmac("sha256", webhookSecret);

    SHAsum.update(JSON.stringify(req.body));

    const digest = SHAsum.digest("hex");

    if (signature === digest) {
        console.log("Payment is authorized");

        //after payment is authorized update user mdoel and course model
        const { courseId, userId } = req.body.payload.payment.entity.notes;

        try {
            //fulfil the action

            //find the course and enroll student in it
            const enrolledStudentInCourse =
                await Course_Model.findByIdAndUpdate(
                    { _id: courseId },
                    {
                        $push: {
                            studentsEnrolled: userId,
                        },
                    },
                    { new: true }
                );
            console.log("enrolled course: ", enrolledStudentInCourse);
            if (!enrolledStudentInCourse) {
                console.log("Error in updating course model", error);
                return res.status(400).json({
                    success: false,
                    message: "Error in updating student in Course model",
                });
            }

            //find the student and add the course in it

            const enrolledCourseInStudent = await User_Model.findByIdAndUpdate(
                { _id: userId },
                {
                    $push: {
                        courses: courseId,
                    },
                },
                { new: true }
            );

            console.log("enrolled student: ", enrolledCourseInStudent);
            if (!enrolledCourseInStudent) {
                console.log("Error in updating course model", error);
                return res.status(400).json({
                    success: false,
                    message: "Error in updating course in User model",
                });
            }

            //* confirmation mail send to user
            const emailResponse = await mailSender(
                enrolledCourseInStudent.email,
                "Congrats, for enrollment",
                "Congratulations, you are enrolled in our course"
            );
            console.log("Email response after enrollment :", emailResponse);

            return res.status(200).json({
                success: true,
                message:
                    " Signature verified, course added and Email sent successfully",
            });
        } catch (error) {
            console.log("Error in razorpay sign verify:", error);
            return res.status(500).json({
                success: false,
                message: "Error in verifying signature razorpay",
            });
        }
    }

    else
    {
        return res.status(400).json({
        success: false,
        message: "Invalid request (sign does not match)" 
        });
    }
};
