const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const nodemailer = require("nodemailer");

class EmailSender {
  constructor(clientId, clientSecret, refreshToken, email) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.refreshToken = refreshToken;
    this.email = email;
    this.transporter = null;
  }

  async createTransporter() {
   /* const oauth2Client = new OAuth2(
      this.clientId,
      this.clientSecret,
      "https://developers.google.com/oauthplayground"
    );

   oauth2Client.setCredentials({
      refresh_token: this.refreshToken
    });

    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject("Failed to create access token :("+err);
        }
        resolve(token);
      });
    });

    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: this.email,
        accessToken,
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        refreshToken: this.refreshToken
      }
    });*/
       this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false, // true si usas SSL/TLS,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendEmail(emailOptions) {
    if (!this.transporter) {
      await this.createTransporter();
    }

    await this.transporter.sendMail(emailOptions);
  }
}

module.exports = EmailSender;