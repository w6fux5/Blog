import { google } from 'googleapis';
import nodeMailer from 'nodemailer';
import dotenv from 'dotenv';
import log from 'log-beautify';

dotenv.config();

const oauthLink = 'https://developers.google.com/oauthplayground';

const { EMAIL, MAIL_SERVICE_ID, MAIL_REFRESH_TOKEN, MAIL_SERVICE_SECRET } =
  process.env;

if (!EMAIL || !MAIL_SERVICE_ID || !MAIL_REFRESH_TOKEN || !MAIL_SERVICE_SECRET) {
  throw new Error('No email env setup');
}

const auth = new google.auth.OAuth2(
  MAIL_SERVICE_ID,
  MAIL_SERVICE_SECRET,
  oauthLink,
);

auth.setCredentials({ refresh_token: MAIL_REFRESH_TOKEN });
const accessToken = auth.getAccessToken();

const sendEmail = (email, htmlStr) => {
  const stmp = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: EMAIL,
      clientId: MAIL_SERVICE_ID,
      clientSecret: MAIL_SERVICE_SECRET,
      refreshToken: MAIL_REFRESH_TOKEN,
      accessToken,
    },
  });

  const option = {
    from: EMAIL,
    to: email,
    subject: 'Blog 驗證',
    html: htmlStr,
  };

  stmp.sendMail(option, (err, res) => {
    if (err) return err;
    return res;
  });
};

export const sendEmailByUser = (email, msg) => {
  try {
    const stmp = nodeMailer.createTransport({
      service: 'Gmail',
      auth: {
        user: msg.from,
        pass: 'h945/4vmp',
      },
    });

    const option = {
      from: msg.from,
      to: email,
      subject: msg.subject,
      html: msg.message,
    };

    stmp.sendMail(option, (err, res) => {
      if (err) return err;
      return res;
    });
  } catch (error) {
    log.error(error);
  }
};

export default sendEmail;
