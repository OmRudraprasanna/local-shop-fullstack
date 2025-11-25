import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // 1. Create the Transporter (Your Gmail Account)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your App Password
    },
  });

  // 2. Define the Email
  const mailOptions = {
    from: `"Local Shop Support" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.text, // We use HTML for better formatting
  };

  // 3. Send it
  await transporter.sendMail(mailOptions);
};

export default sendEmail;