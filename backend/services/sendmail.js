const nodemailler = require('nodemailer');

const sendmail = async (to, subject, text) => {
    try {
        const transporter = nodemailler.createTransport({
            // service: 'gmail' ki jagah host/port manual dena Render par better hai
            host: 'smtp.gmail.com',
            port: 465, 
            secure: true, // Port 465 ke liye true
            auth: {
                user: process.env.APP_EMAIL,
                pass: process.env.APP_PASSWORD // Tera 16-digit App Password
            },
            // Ye wala part connection timeout fix karne mein help karta hai
            tls: {
                rejectUnauthorized: false
            },
            connectionTimeout: 10000, // 10 seconds wait karega
        });

        const mailOptions = {
            from: process.env.APP_EMAIL,
            to,                                 
            subject,
            text
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Isse tere main function ko pata chalega ki fail hua hai
    }           
}

module.exports = sendmail;