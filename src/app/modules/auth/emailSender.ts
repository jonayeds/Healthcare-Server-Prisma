import nodemailer from "nodemailer";
import config from "../../../config";

const emailSender = async (email: string, html: string) => {
  // Create a test account or replace with real credentials.
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.email_sender.email,
      pass: config.email_sender.app_password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: '"Healthcare" <1juunaayeed@gmail.com>',
    to: email,
    subject: "Reset your password",
    text: "Hello world?",
    html,
  });
};

export default emailSender;
