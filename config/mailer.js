const nodemailer = require('nodemailer');

var transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: 'c7e9312d57797e',
        pass: '5f500d684625cc'
    }
});

module.exports = transport;