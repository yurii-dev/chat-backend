const sgMail = require("@sendgrid/mail"),
  { verify_email_template } = require("./emailTemplates/verifyEmailTemplate"),
  {
    forgot_password_email_template,
  } = require("./emailTemplates/forgotPasswordEmailTemplate");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const confirmEmail = (email, name, hash) => {
  sgMail.send({
    to: email,
    from: "yuriidevac@gmail.com",
    subject: "Thanks for joining in!",
    text: `Welcome to the app, ${name}.`,
    html: verify_email_template(hash),
  });
};

const resetPasswordEmail = (email, name, hash) => {
  sgMail.send({
    to: email,
    from: "yuriidevac@gmail.com",
    subject: `Reset password link`,
    html: forgot_password_email_template(hash),
  });
};
module.exports = {
  confirmEmail,
  resetPasswordEmail,
};
