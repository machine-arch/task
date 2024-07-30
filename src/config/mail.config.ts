import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "in-v3.mailjet.com",
  port: 587,
  secure: false,
  auth: {
    user: "a1f5bd7e58a12aad378f502e13a97bf6",
    pass: "019c69905a63bd4d09ef7760e5b5067d",
  },
});
