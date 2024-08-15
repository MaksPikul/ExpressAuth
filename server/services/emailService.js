const nodemailer = require('nodemailer');

//singleton pattern?
const transporter = nodemailer.createTransport({
    host: "host",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "host@gmail.com",
      pass: "jn7jnAPss4f63QBp6D",
    },
});

export async function sendSignUpVerificationEmail(email, token) {
    try{
    const info = await transporter.sendMail({
        from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
        to: "mmaks522@gmail.com",//email, // list of receivers
        subject: "Verifiy Your Email ✔", // Subject line
        text: "Link to click", // plain text body
        html: "<b>Hello world?</b>", // html body
      });
    
      return ({status: "Email sent successfully"})
    }
    catch (err){
        console.log(err)
        //delete token and start process again
        return ({status: "Error sending email, "})
    }
}