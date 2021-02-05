const SibApiV3Sdk = require("sib-api-v3-sdk");
const { SENDINBLUE_API_KEY /* , MAIL_TO */ } = require("../env");
require("dotenv").config();

const sendMail = (email, password) => {
  // email from the user, password just created
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications["api-key"];
  apiKey.apiKey = SENDINBLUE_API_KEY;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  // const { firstname, lastname, email, message, purpose } = datas;
  sendSmtpEmail.subject = "Bienvenue chez OUF !";
  sendSmtpEmail.htmlContent = `<p>Votre compte adhérent chez OUF a bien été créé ! <br/> Vous pouvez y accéder en utilisant votre adresse mail, ainsi que le mot de passe : ${password}</>`;
  sendSmtpEmail.sender = { name: "OUFGarden", email: process.env.EMAIL_USER };
  sendSmtpEmail.to = [{ email }];
  sendSmtpEmail.replyTo = { email: "contact@oufgarden.com", name: `OUF` }; // ?

  try {
    apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("sent mail successfully");
    return;
  } catch (err) {
    console.error(err);
  }
};

module.exports = { sendMail };
