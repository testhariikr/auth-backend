const nodemailer = require('nodemailer');
const path = require('path');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'testhariikr@gmail.com',
    pass: 'kdej lzeq onsy hdie',
  },
});

async function sendEmail(mailOptions) {
  try {
    const status = await transporter.sendMail(mailOptions);
    return status;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}

async function sendMail(message, userEmail) {
  const mailOptions = {
    from: 'testhariikr@gmail.com',
    to: userEmail,
    subject: 'Subject of the Email',
    text: message,
  };

  try {
    const status = await sendEmail(mailOptions);
    console.log('Email sent successfully:', status);
    return status;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

module.exports = {
  sendMail,
};
