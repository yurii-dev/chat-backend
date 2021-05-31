const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const confirmEmail = (email, name, hash) => {
  sgMail.send({
    to: email,
    from: "yuriidevac@gmail.com",
    subject: "Thanks for joining in!",
    text: `Welcome to the app, ${name}.`,
    html: `<div>Для того, чтобы подтвердить почту, перейдите <a href="http://localhost:5000/users/verify?hash=${hash}">по этой ссылке</a></div>`,
  });
};

const resetPasswordEmail = (email, name, hash) => {
  sgMail.send({
    to: email,
    from: "yuriidevac@gmail.com",
    subject: `Hello ${name}`,
    text: `Reset password link`,
    html: `<div> Reset password form <a href="http://localhost:3000/setpassword?token=${hash}">here</a></div>`,
  });
};
module.exports = {
  confirmEmail,
  resetPasswordEmail,
};
