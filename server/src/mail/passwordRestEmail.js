exports.passwordResetEmail = (resetPasswordUrl, validityTime) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Password Reset Email</title>
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
            .link {
                font-weight: bold;
                font-size: 18px;
                color: #007bff;
                word-wrap: break-word;
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
                <h2>Password Reset Request</h2>
            </div>
            <div class="content">
                <p class="message">Dear User,</p>
                <p class="message">You have requested to reset your password. Click on the link below to reset your password:</p>
                <p class="link"><a href="${resetPasswordUrl}" target="_blank">${resetPasswordUrl}</a></p>
                <p class="message">Please note that this link is valid for the next ${validityTime} minutes.</p>
                <p class="message">If you did not request a password reset, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>This email is auto-generated. Please do not reply.</p>
            </div>
        </div>
    </body>
    </html>`;
};
