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

const accessToken = auth
  .getAccessToken()
  .then((data) =>
    log.success(`Google Oauth access token: ${[data.res.statusText]}`),
  )
  .catch((e) => log.error(`[ Error ]: Mail Service accessToken ${e.message}`));

const sendEmail = (email, htmlStr) => {
  try {
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
  } catch (error) {
    log.error(error);
  }
};

export default sendEmail;
