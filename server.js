const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors'); // Ajout du module CORS

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors()); // Utilisation de CORS

app.get('/', (req, res) => {
    res.send('Bienvenue sur la page d\'accueil.');
});

app.post('/send-email', (req, res) => {
  const { to, subject, body } = req.body;

  const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '0ea6f036f14bbe',
      pass: 'da55f6d8e6c8fd',
    },
  });

  const mailOptions = {
    from: 'romualag@gmail.com', // Remplacez par votre adresse e-mail Gmail
    to,
    subject,
    text: body,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send('E-mail envoyé : ' + info.response);
  });
});

app.listen(port, () => {
  console.log(`Serveur écoutant sur le port ${port}`);
});

