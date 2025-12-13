// Payment Success Email Template

export const paymentSuccessEmail = (
    name: string,
    amount: number,
    orderId: string,
    paymentId: string
): string => {
    return `<!DOCTYPE html>
    <html>
    <head>
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
                background-color: #28a745;
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
            .order-info {
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
                <h2>Payment Successful</h2>
            </div>
            <div class="content">
                <p class="message">Dear ${name},</p>
                <p class="message">Thank you for your payment of Rs.${amount.toFixed(2)}.</p>
                <p class="message">Your order ID is <span class="order-info">${orderId}</span> <br>and payment ID is <span class="order-info">${paymentId}</span>.</p>
                <p class="message">We appreciate your business and hope you enjoy your purchase.</p>
            </div>
            <div class="footer">
                <p>This email is auto-generated. Please do not reply.</p>
            </div>
        </div>
    </body>
    </html>`;
};

