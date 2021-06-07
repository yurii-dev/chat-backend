const sgMail = require("@sendgrid/mail"),
  { verify_email_template } = require("./emailTemplates/verifyEmailTemplate"),
  {
    forgot_password_email_template,
  } = require("./emailTemplates/forgotPasswordEmailTemplate"),
  {
    account_delete_email_template,
  } = require("./emailTemplates/accountDeleteEmailTemplate");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const confirmEmail = (email, hash) => {
  sgMail.send({
    to: email,
    from: "yuriidevac@gmail.com",
    subject: "Thanks for joining in!",
    html: verify_email_template(hash),
  });
};

const resetPasswordEmail = (email, hash) => {
  sgMail.send({
    to: email,
    from: "yuriidevac@gmail.com",
    subject: `Reset Your Password`,
    html: forgot_password_email_template(hash),
  });
};

const deleteAccountEmail = (email) => {
  sgMail.send({
    to: email,
    from: "yuriidevac@gmail.com",
    subject: `Account deleted`,
    html: account_delete_email_template(),
  });
};
module.exports = {
  confirmEmail,
  resetPasswordEmail,
  deleteAccountEmail,
};
