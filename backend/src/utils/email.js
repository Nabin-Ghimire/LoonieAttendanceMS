import nodemailer from "nodemailer";
import employeeCredsTemplate from "./templates/employee-creds-template.js";
import { Config } from "../Config/index.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: Config.USER_MAIL,
    pass: Config.USER_PASS
  },
});

const sendEmployeeCreds = async (firstName, lastName, email, password) => {
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const html = employeeCredsTemplate(firstName, lastName, email, password)

  const info = await transporter.sendMail({
    from: Config.USER_MAIL,
    to: email,
    subject: "Your Account Credentials",
    html,
  });
  return { success: true, info }
};

export default sendEmployeeCreds;




