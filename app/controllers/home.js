// Global var
var uid = require('uid');



/**
 * Site dashboard
 */
exports.index = function(req, res) {
	if (req.session.user && req.session.user.isAdmin) {
		res.redirect('/admin#!/dashboard');
		return;	
	}

	res.render('siteLayout', {
		env: process.env.NODE_ENV
	});
}


/**
 * Admin dashboard
 */
exports.index1 = function(req, res) {	
	if (req.session.user && !req.session.user.isAdmin) {
		res.redirect('/');
		return;	
	}

    res.render('adminIndex', {
		env: process.env.NODE_ENV
    });
}
