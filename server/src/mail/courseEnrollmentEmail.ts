// Course Enrollment Email Template

export const courseEnrollmentEmail = (courseName: string, name: string): string => {
    return `<!DOCTYPE html>
    <html>
    <head>
    <meta charset = "UTF-8">
    <title>Course Registration Conformation</title>
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
            .course-name {
                font-weight: bold;
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
                <h2>Course Enrollment Confirmation</h2>
            </div>
            <div class="content">
                <p class="message">Dear ${name},</p>
                <p class="message">Congratulations! You have successfully enrolled in the course <span class="course-name">${courseName}</span>.</p>
                <p class="message">We look forward to having you in the class and hope you enjoy the learning experience.</p>
            </div>
            <div class="footer">
                <p>This email is auto-generated. Please do not reply.</p>
            </div>
        </div>
    </body>
    </html>`;
};

