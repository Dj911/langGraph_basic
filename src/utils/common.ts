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
                user: "dharmaraj.jadeja@bytestechnolab.com",
                pass: "dj2122149",
            },
        });

        return await transporter.sendMail(mailDetails)
    } catch (error) {
        console.log(error);
    }
}