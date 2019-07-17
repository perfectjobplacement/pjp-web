// Global var
var uid = require('uid');



/**
 * Site dashboard
 */
exports.index = function(req, res) {
	
	var userId = '';

	if(req.session && req.session.user && req.session.user._id) {
		userId = req.session.user._id;
	}


	if (req.session.user && req.session.user.isAdmin) {
		res.redirect('/admin#!/dashboard');
		return;	
	}

	res.render('siteLayout', {
		userId: userId
	});
}




/**
 * Admin dashboard
 */
exports.index1 = function(req, res) {

	var userId = '';

	if(req.session && req.session.user && req.session.user._id) {
		userId = req.session.user._id;
	}

	
	if (req.session.user && !req.session.user.isAdmin) {
		res.redirect('/');
		return;	
	}

    res.render('adminIndex', {
		userId: userId
    });
}
