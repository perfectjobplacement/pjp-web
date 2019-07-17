'use strict';

var nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport'),
	hbs = require('hbs'),
	mongoose = require('mongoose'),
	fs = require('fs');




/**
 *
 */
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



/**
 *
 */
exports.sendHTMLEmail = function(view, dynamicFields, mailOptions) {
    fs.readFile(__dirname + '/../views/email-templates/' + view, 'utf8', function(err, htmlData) {
        var template = hbs.compile(htmlData);
        var compiledHTML = template(dynamicFields || {});
        mailOptions.html = compiledHTML;
        exports.sendMail(mailOptions);
    });
};



/**
 *
 */
exports.fixedFiledName = function(name) {

	if (typeof(name) == 'string') {
		return name.replace(/XXXX/g," ");
	}

	return name;
};
