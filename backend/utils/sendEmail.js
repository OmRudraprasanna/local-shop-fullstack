import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  try {
    // Create Transporter using Gmail
    // IMPORTANT: We use port 465 (SSL) which is more reliable on cloud hosts
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify connection configuration (Optional but good for debugging)
    // This will log if the connection itself fails immediately
    await transporter.verify();
    console.log('SMTP Server connection successful');

    const mailOptions = {
      from: `"Local Shop Support" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    
  } catch (error) {
    console.error('Nodemailer Error:', error);
    // Throwing the error ensures the controller knows it failed
    throw new Error('Email sending failed: ' + error.message);
  }
};

export default sendEmail;