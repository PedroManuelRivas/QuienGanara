const nodemailer = require("nodemailer");

const enviar = (to, subject, html) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "nodemailerADL@gmail.com",
      pass: "desafiolatam",
    },
  });

  let mailOptions = {
    from: "nodemailerADL@gmail.com",
    to,
    subject,
    html,
  };

  const envioCorreo = transporter.sendMail(mailOptions);
  return envioCorreo;
};
module.exports = enviar;
