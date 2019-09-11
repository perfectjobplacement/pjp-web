'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	async = require('async'),
	uid = require('uid'),
	fs = require('fs'),
	hbs = require('hbs'),
	request = require('request'),
	helperCTRL = require('./helper');
	require('date-utils');

var filePath = {
	1: __dirname + '/../../public/assets/uploads/users/',
	2: __dirname + '/../../public/assets/uploads/advertisement/',
};




/**
 *
 */
exports.getSingle = function(req, res) {

	if (!req.body.model || !req.body._id) {
		res.json([]);
		return;
	}

	var commonModel = mongoose.model(req.body.model);

	commonModel.findById(req.body._id, function(err, result) {
		res.json(result);
	});
};



/**
 *
 */
exports.getData = function(req, res) {
	if (!req.body.model) {
		res.json([]);
		return;
	}

	var commonModel = mongoose.model(req.body.model);

	commonModel.find().exec(function(err, responseData) {

		if(err) {
			res.json({
				status: false,
				data: responseData
			});
			return;
		}

		res.json(responseData);
	});
};


/**
 *
 */
exports.loadMore = function(req, res) {
	if (!req.body.model) {
		res.json([]);
		return;
	}

	var commonModel = mongoose.model(req.body.model);

	commonModel.find({}).skip(req.body.skip)
	.limit(30).sort({ createdAt: -1 })
	.lean()
	.exec(function(err, response) {
		commonModel.count({}).exec(function(err, count) {
	        res.json({
	        	status: true,
	        	result: response,
	        	count: count,
	        });
	    });
    });
};



/**
 *
 */
exports.getCondition = function(req, res) {

	if (!req.body.model) {
		res.json([]);
		return;
	}

	var commonModel = mongoose.model(req.body.model);

	commonModel.find(req.body.condition).exec(function(err, responseData) {

		if(err) {
			res.json({
				status: false,
				data: responseData
			});
			return;
		}

		res.json(responseData);
	});
};



/**
 *
 */
exports.getEditData = function(req, res) {
    if (!req.body.model) {
        return res.json([]);
    }

    req.body.updatedAt = new Date().getTime();

    var commonModel = mongoose.model(req.body.model);

    commonModel.update({
        _id: req.body._id
    }, req.body, {
        multi: true
    }).exec(function(err, result) {

		if (req.body.model == 'OurTeam') {
			req.session.user = req.body;
		}

        res.json({
            status: true,
            result: req.body
        });
    });
};



/**
 *
 */
exports.commonUploadFile = function(req, res) {

	var fileObject = req.files.file,
		destinationpath = filePath[req.params.key];

	var extArray = fileObject.originalFilename.split('.');
	var ext = extArray[extArray.length - 1];
	var fileName = uid(10) + '.' + ext;

	fs.readFile(fileObject.path, function(err, data) {

		if(err) {
			res.send(err);
			return;
		}

		var newPath = destinationpath + fileName;

		fs.writeFile(newPath, data, function(err) {
			if (err) {
				res.send(err);
				return;
			}
			res.send({
				original: req.files.file.name,
				image: fileName,
				status: true
			});
		});
	});
};



/**
 *
 */
exports.postUpdateChildData = function(req, res) {

	if (!req.body.model || !req.body.entityId) {
		return res.json([]);
	}

	var commonModel = mongoose.model(req.body.model);
	var entityId = req.body.entityId,
		childEntityId = req.body.childEntityId,
		entityKey = req.body.entityKey;

	delete req.body.entityId;
	delete req.body.childEntityId;
	delete req.body.entityKey;


	var saveData = function() {

		var updateData = {};
		for (var row in req.body) {
			updateData[row] = req.body[row];
		}

		var condition = {
			_id: entityId
		};

		var pull = {};
		pull[entityKey] = {
			_id: mongoose.Types.ObjectId(childEntityId)
		}

		var push = {};
		updateData._id = mongoose.Types.ObjectId(childEntityId);
		push[entityKey] = updateData;

		commonModel.update({
			'_id': entityId
		}, {
			$pull: pull
		}).exec(function(err, result) {

			if (err) {
				res.json({
					status: false,
					err: err
				});
				return;
			}


			commonModel.update({
				'_id': entityId
			}, {
				$push: push
			}).exec(function(err, result) {

				if (err) {
					res.json({
						status: false,
						err: err
					});
					return;
				}

				var sendRS = function() {
					res.json({
						status: true,
						result: updateData
					});
				}

				switch(entityKey) {
					case 'something':
					break;
						default:
						sendRS();
						break;
				}
				return;
			});
		});
	}


	if (req.body.tags) {
		getDynamicTagsByName(req.body.tags, function(tags) {
			req.body.tags = tags;
			saveData();
		});
	} else {
		saveData();
	}
}



/**
 *
 */
exports.postUpdateData = function(req, res) {

	if (!req.body.model || !req.body.entityId) {
		return res.json([]);
	}

	commonModel.update({
		'_id': req.body.entityId
	}, req.body ).exec(function(err, result) {
		res.json(result);
	});
}




/**
 *
 */
exports.postAddData = function(req, res) {
	if (!req.body.model) {
		res.json([]);
		return;
	}

	var commonModel = mongoose.model(req.body.model);
	req.body.model = '';
	req.body.createdAt = new Date().getTime();
	
	var commonFormData = new commonModel(req.body);

	commonFormData.save(function(err, result) {
		if (err) {
			res.json({
				status: false
			});
			return;
		}

		res.json({
			status: true,
			result: result
		});
	});
}



/**
 *
 */
exports.getDeleteData = function(req, res) {

	if (!req.body.model || !req.body._id) {
		res.json([]);
		return;
	}

	var commonModel = mongoose.model(req.body.model);

	// Delete common Data
	commonModel.findOne({ _id: req.body._id}).remove(function(err, result) {
		if (err) {
			res.json({
				status: false
			});
			return;
		}

		res.json({
			status: true,
			responseIds: req.body._id
		});
	});
};




/**
 *
 */
exports.getDeleteDataCondition = function(req, res) {

	if (!req.body.model || !req.body._id) {
		res.json([]);
		return;
	}

	var commonModel = mongoose.model(req.body.model);

	// Delete common Data
	commonModel.find(req.body.condition).remove(function(err, result) {

		if (err) {
			res.json({
				status: false
			});
			return;
		}

		res.json({
			status: true
		});
	});
};
















/**
 *
 */
exports.siteVisitor = function(req, res) {

	var IPAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var siteVisitorsModel = mongoose.model('SiteVisitor');

	request({
		url: "http://www.geoplugin.net/json.gp?ip=" + IPAddress,
		json: true
	}, function(error, response, body) {

		var currentDate = new Date();
		currentDate.addHours(-4);

		siteVisitorsModel.find({
			ip_address: IPAddress,
			timestamp: {
				$gt: parseInt(currentDate.getTime() / 1000, 10)
			}
		}, {
			ip_address: true
		}).limit(1).exec(function(err, data) {

			if (data && data.length) {
				// logic if data is already exists
			} else {

				var userAgentData = {};
				if (req.useragent != undefined) {
					userAgentData = req.useragent;
				}

				var PostData = {
					user_id: '',
					session_id: req.body.session_id,
					site_mgmt_id: req.body.site_mgmt_id,
					ip_address: IPAddress,
					timestamp: parseInt(new Date().getTime() / 1000, 10),
					user_agent: userAgentData
				};

				// --
				// Avoid to generate an error that api does not return anythings..

				try {
					if (body) {
						PostData.country = body.geoplugin_countryName;
						PostData.region = body.geoplugin_region;
						PostData.areaCode = body.geoplugin_areaCode;
						PostData.countryCode = body.geoplugin_countryCode;
						PostData.continentCode = body.geoplugin_continentCode;
						PostData.latitude = body.geoplugin_latitude;
						PostData.longitude = body.geoplugin_longitude;
					}
				} catch (ExceErr) {
					if (ExceErr) {
					}
				}

				var siteVisitorsForm = new siteVisitorsModel(PostData);
				siteVisitorsForm.save(function() {});
			}
		});
	});

	res.send("200");
};




/**
 *
 */
exports.SendResumrViaEmail = function(req, res) {

	var attachments = [
        {   // encoded string as an attachment
            path: req.body.resume,
        }
    ];


    let htmlData = ('<table>').toString()
        .concat('<tr>')
            .concat('<td style="font-weight: bold;">Message</td><td>&nbsp;&nbsp;:&nbsp;&nbsp;</td>')
            .concat('<td>').concat(req.body.message).concat('</td>')
        .concat('</tr>')
    .concat('</table>');

    const template = hbs.compile(htmlData);
    const compiledHTML = template({
        host: req.headers.host
    });

    helperCTRL.sendMail({
        to: 'resume.pjp@gmail.com',
        from: 'hrd.pjob@gmail.com',
        subject: req.body.subject,
        html: compiledHTML,
        attachments: attachments
    }, (mailError, mailResponse) => {
        res.json(true);
    });
};