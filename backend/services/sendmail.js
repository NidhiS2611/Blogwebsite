const nodemailler = require('nodemailer');

const sendmail = async (to, subject, text) => {
    try {
        console.log('Setting up transporter with email:', process.env.APP_EMAIL);
        console.log('Setting up transporter with password:', process.env.APP_PASSWORD ? '******' : 'No password set');
     const transporter = nodemailler.createTransport({
            // 'service' ko hata kar manual host/port dena Render par better hai
     host: "smtp.gmail.com",
      port: 587,        // ✅ FIXED
      secure: false,    // ✅ FIXED
      family: 4, 
       // 🔥 important
      auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_PASSWORD,
      },
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