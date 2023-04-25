import nodemailer from 'nodemailer';

const sendMail = async (recipient, code, checker) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: recipient.recipientEmail,
    subject: recipient.emailSubject,
    text: recipient.emailBody,
  };

  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      console.error(error);
      checker += 1;
    } else {
      console.log(`Email sent: ${info}`);
    }
  });
  return checker;
};

export default sendMail;
