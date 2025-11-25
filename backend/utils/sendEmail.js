import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // Brevo uses STARTTLS on port 587, so secure is false
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify connection configuration
    await transporter.verify();
    console.log('SMTP Server connection successful');

    const mailOptions = {
      from: `"Local Shop Support" <${process.env.EMAIL_USER}>`, // Sender address
      to: options.to,
      subject: options.subject,
      html: options.text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    
  } catch (error) {
    console.error('Nodemailer Error:', error);
    throw new Error('Email sending failed: ' + error.message);
  }
};

export default sendEmail;