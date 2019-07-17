'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    hbs = require('hbs'),
    async = require('async'),
    helperCTRL = require('./helper');







/**
 * Logout
 */
exports.signout = function(req, res) {

    if (res.session && res.session.user) {
        res.session.user = undefined;
    }

    req.session = null;
    res.redirect('/');
};




/**
 * Send User
 */
exports.me = function(req, res) {
    res.json(req.user || null);
};



/**
 * Register
 */
exports.register = function(req, res) {
    var userModel = mongoose.model('AdminUsers');

    userModel.find({}).exec(function(err, response) {

        if (response.length) {
            res.json({status: true});
            return;
        }

        var user = new userModel({
            firstName: 'Perfectjob',
            lastName: 'Placement',
            email: 'pjp@gmail.com',
            password: 'perfect@123',
            isAdmin: true,
            createdAt: new Date().getTime(),
            isActive: true,
        });

        user.save(function(err, userResponse) {
            if (err) {
                res.json({status: false});
                return;
            }
            res.json({status: true});
        });
    });
}



/**
 * Login
 */
exports.login = function(req, res) {
    var userModel = mongoose.model('AdminUsers');

    // var response = {
    //     "_id" : "5d1c8bc7d5b5ecd65cfda184",
    //     "firstName" : "nalin",
    //     "lastName" : "R",
    //     "email" : "pjp@gmail.com",
    //     "password" : "123",
    //     "isAdmin" : true,
    // };

    // response.isAdmin = true;
    // req.session.user = response;

    // res.json({
    //     status: true,
    //     response: response,
    // });
    // return;


    userModel.findOne({
        email: req.body.email.toLowerCase(),
        password: req.body.password,
    }).lean().exec(function(err, response) {

        if (err) {
            res.json({
                status: false
            });
            return;
        }

        if (response && response._id) {
            response.isAdmin = true;
            req.session.user = response;

            res.json({
                status: true,
                response: response
            });
            return;
        }

        res.json({
            status: false,
        });
        return;
    });
}



/**
 * Forgot Password
 */
exports.forgotPassword = function(req, res) {
    var ourClients = mongoose.model('OurClients');

    ourClients.findOne({
        email: req.body.email.toLowerCase()
    }).exec(function(err, result) {

        if (err) {
            res.json({
                status: 1
            });
            return;
        }

        if (result && result._id) {
            let newPassword = '123';

            let htmlData = ('<table>').toString()
                .concat('<tr>')
                    .concat('<td style="font-weight: bold;">Email</td><td>&nbsp;&nbsp;:&nbsp;&nbsp;</td>')
                    .concat('<td>').concat(req.body.email).concat('</td>')
                .concat('</tr>')
                .concat('<tr>')
                    .concat('<td style="font-weight: bold;">New Password</td><td>&nbsp;&nbsp;:&nbsp;&nbsp;</td>')
                    .concat('<td>').concat(newPassword).concat('</td>')
                .concat('</tr>')
            .concat('</table>');

            const template = hbs.compile(htmlData);
            const compiledHTML = template({
                host: req.headers.host
            });

            helperCTRL.sendMail({
                to: req.body.email,
                from: 'hrd.pjob@gmail.com',
                subject: 'Forgot Password',
                html: compiledHTML
            }, (mailError, mailResponse) => {
                if (mailError) {
                    return res.json({
                        status: false,
                        msg: 'Problem into email send'
                    });
                }

                ourClients.update({
                     email: req.body.email.toLowerCase()
                }, {
                    password: newPassword
                } ).exec(function(err, result) {});

                return res.json({
                    status: 2
                });
            });
            return;
        }

        res.json({
            status: 3,
        });
        return;
    });
}



/**
 * Change Password
 */
exports.changePassword = function(req, res) {
    var ourClients = mongoose.model('OurClients');

    ourClients.update({
        _id: req.body._id
    }, {
        password: req.body.password
    }).exec(function(err, result) {

        if (err) {
            res.json({
                status: false
            });
            return;
        }

        req.session.user.password = req.body.password;

        res.json({
            status: true,
        });
        return;
    });
}




/**
 * Get Count
 */
exports.getDbCount = function(req, res) {
    var siteVisitor = mongoose.model('SiteVisitor');
    var ourClients = mongoose.model('OurClients');
    var candidateRegister = mongoose.model('CandidateRegister');
    var jobsBazaar = mongoose.model('JobsBazaar');


    async.parallel({
        getSiteVisitor: function(callback) {
            siteVisitor.find({}).count(function(err, count) {
                callback(null, count)
            });
        },
        getOurClients: function(callback) {
            ourClients.find({}).count(function(err, count) {
                callback(null, count)
            });
        },
        getCandidateRegister: function(callback) {
            candidateRegister.find({}).count(function(err, count) {
                callback(null, count)
            });
        },
        getJobsBazaar: function(callback) {
            jobsBazaar.find({ status: 2 }).count(function(err, count) {
                callback(null, count)
            });
        }
    }, function(err, results) {
        res.json(results);
    });
}