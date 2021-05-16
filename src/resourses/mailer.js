const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const confirmEmail = (email, name, hash) => {
  sgMail.send(
    {
      to: email,
      from: "yuriidevac@gmail.com",
      subject: "Thanks for joining in!",
      text: `Welcome to the app, ${name}.`,
      html: `<div>Для того, чтобы подтвердить почту, перейдите <a href="http://localhost:5000/signup/verify?hash=${hash}">по этой ссылке</a></div>`,
    },
    (error) => console.log(error)
  );
};

module.exports = {
  confirmEmail,
};
