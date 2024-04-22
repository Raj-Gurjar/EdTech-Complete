const express = require("express");
const router = express.Router();

const {
    verifyPayment,
    capturePayment,
    sendPaymentMail,
} = require("../controllers/Payments");
const {
    auth,
    isAdmin,
    isInstructor,
    isStudent,
} = require("../middlewares/auth");

router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifyPayment", auth, isStudent, verifyPayment);
router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentMail);

module.exports = router;
