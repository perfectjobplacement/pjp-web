// Global var
const uid = require('uid');



/**
 * Site dashboard
 */
exports.index = (req, res) => {
	if (req.session.user && req.session.user.isAdmin) {
		res.redirect('/admin#!/dashboard');
		return;	
	}

	res.render('siteLayout', {
		env: "prod"
	});
}


/**
 * Admin dashboard
 */
exports.index1 = (req, res) => {
	if (req.session.user && !req.session.user.isAdmin) {
		res.redirect('/');
		return;	
	}

    res.render('adminIndex', {
		env: "prod"
    });
}
