'use strict';

const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const hbs = require('hbs');
const mongoose = require('mongoose');
const fs = require('fs');


exports.sendMail = (mailOptions, cb) => {
	const transport = nodemailer.createTransport(smtpTransport({
		secure: true,
		service: "gmail",
		host: 'smtp.gmail.com',
		port: 465,
		auth: {
			user: 'hrd.pjob@gmail.com',
			pass: 'royal12345'
		}
	}));

	transport.sendMail(mailOptions, (err, response) => {
		if (err) {
			return cb(err, null);
		}
		return cb(null, response);
	});
};

exports.sendHTMLEmail = (view, dynamicFields, mailOptions) => {
    fs.readFile(__dirname + '/../views/email-templates/' + view, 'utf8', (err, htmlData) => {
        const template = hbs.compile(htmlData);
        const compiledHTML = template(dynamicFields || {});
        mailOptions.html = compiledHTML;
        exports.sendMail(mailOptions);
    });
};

exports.fixedFiledName = (name) => {

	if (typeof(name) == 'string') {
		return name.replace(/XXXX/g," ");
	}

	return name;
};

exports.sortByKeyDesc = (array, key) => {
    return array.sort((a, b) => {
        const x = a[key];
        const y = b[key];
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
}