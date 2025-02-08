import nodemailer from 'nodemailer';

// Create the transporter using Elastic Email's SMTP details
const transporter = nodemailer.createTransport({
  host: 'smtp.elasticemail.com',
  port: 2525, // You can use 587 or 465 based on your setup
  auth: {
    user: process.env.EMAIL_USER,  // SMTP username (your Elastic Email email address)
    pass: process.env.EMAIL_PASS,  // SMTP password (your Elastic Email API key)
  },
});

export const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,  // Your sending email
    to,                            // Recipient email
    subject,                       // Email subject
    text,                          // Email body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(error);
  }
};