const nodemailer = require('nodemailer');

var transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: '9cae1a9fc36349',
        pass: 'b506f4ffad62ea'
    }
});

module.exports = transport;