import * as nodemailer from 'nodemailer'
import { config } from 'dotenv'

config()

export const sendEmail = async (mailDetails) => {
    try {
        // Send email
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            service: "gmail",
            requireTLS: true,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        return await transporter.sendMail(mailDetails)
    } catch (error) {
        console.log(error);
    }
}