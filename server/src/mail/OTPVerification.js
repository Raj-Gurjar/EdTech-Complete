// otpEmailTemplate.js

exports.otpVerificationEmail = (otp) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>OTP Verification Email</title>
        <style>
            /* CSS styles for email content */
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #fff;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                background-color: #007bff;
                color: #fff;
                text-align: center;
                padding: 10px;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
            }
            .content {
                padding: 20px;
            }
            .message {
                margin-bottom: 20px;
            }
            .otp {
                font-weight: bold;
                font-size: 24px;
                color: #007bff;
            }
            .footer {
                text-align: center;
                margin-top: 20px;
                color: #666;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>OTP Verification from EdTech</h2>
            </div>
            <div class="content">
                <p class="message">Dear User,</p>
                <p class="message">Your One-Time Password (OTP) for verification is:</p>
                <p class="otp">${otp}</p>
                <p class="message">Please enter this OTP to complete your verification process. This OTP is valid for 5 minutes.</p>
            </div>
            <div class="footer">
                <p>This email is auto-generated. Please do not reply.</p>
            </div>
        </div>
    </body>
    </html>`;
};
