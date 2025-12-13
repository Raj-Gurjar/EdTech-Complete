import express, { Router } from "express";
const router: Router = express.Router();

const {
    signUp,
    logIn,
    sendOTP,
    changePassword,
} = require("../controllers/Auth");
const {
    resetPasswordToken,
    resetPassword,
} = require("../controllers/ResetPassword");

const { auth } = require("../middlewares/auth");

//!Routes for login , signup and authentication

router.post("/signup", signUp);
router.post("/login", logIn);
router.post("/sendOTP", sendOTP);
router.post("/changePassword", changePassword);


//! Reset Password

//for generating reset password link
router.post("/resetPasswordToken", resetPasswordToken);

//for resting user's password after verification
router.post("/reset-password", resetPassword);

module.exports = router;

