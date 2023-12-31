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
    const oauth2Client = new OAuth2(
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
          reject("Failed to create access token :(");
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