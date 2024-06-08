import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetPasswordEmail = async (email: string, token: string) => {
  try {
    const resetUrl = `http://localhost:3000/reset-password?token=${token}`;
    const emailData = {
      from: "onboarding@resend.dev",
      to: email,
      subject: "Reset Password",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding: 10px 0;
              border-bottom: 1px solid #dddddd;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              color: #34495e;
            }
            .content {
              padding: 20px;
            }
            .content p {
              font-size: 16px;
              line-height: 1.5;
              margin: 20px 0;
            }
            .button a {
              display: block;
              width: 200px;
              margin: 0 auto;
              padding: 10px 15px;
              font-size: 16px;
              text-align: center;
              color: #ffffff;
              background-color: #34495e;
              text-decoration: none;
              border-radius: 5px;
            }
            .footer {
              text-align: center;
              padding: 20px;
              font-size: 14px;
              color: #888888;
              border-top: 1px solid #dddddd;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Reset Your Password</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>You requested to reset your password. Click the button below to reset it.</p>
              <div class="button"><a href="${resetUrl}">Reset Password</a></div>
              <p>If you don't want password reset, please ignore this email.</p>
              <p>Thank you,<br>The Easy Shop Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Easy Shop. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await resend.emails.send(emailData);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
