import nodemailer from "nodemailer";
import "dotenv/config";

const sendEmail = (payload) => {
  const isPapercut = process.env.SMTP_DRIVER === "papercut";
  const nodemailerConfig = isPapercut
    ? {
        host: "127.0.0.1",
        port: 25,
        secure: false,
      }
    : {
        host: "smtp.ukr.net",
        port: 465,
        secure: true,
        auth: {
          user: process.env.FROM_EMAIL,
          pass: process.env.FROM_EMAIL_PASSWORD,
        },
      };

  const email = { ...payload, from: process.env.FROM_EMAIL };
  const transport = nodemailer.createTransport(nodemailerConfig);

  return transport.sendMail(email);
};

const createVerificationEmail = (to, verificationToken) => {
  const { PUBLIC_URL } = process.env;

  return {
    to,
    subject: "Verify email",
    html: `<a href="${PUBLIC_URL}/api/auth/verify/${verificationToken}" target="_blank">Click verify email</a>`,
  };
};

const emailService = {
  sendEmail,
  createVerificationEmail
};

export default emailService;
