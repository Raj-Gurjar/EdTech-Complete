const Razorpay = require("razorpay");

// Validate that Razorpay credentials are set
if (!process.env.RAZORPAY_KEY || !process.env.RAZORPAY_SECRET) {
    throw new Error(
        "Razorpay configuration error: RAZORPAY_KEY and RAZORPAY_SECRET must be set in environment variables"
    );
}

exports.instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
});
