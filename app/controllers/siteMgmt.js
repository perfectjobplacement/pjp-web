'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uid = require('uid');
var async = require('async');
var helperCTRL = require('./helper');

var jobsModel = mongoose.model('JobsBazaar');
var cityModel = mongoose.model('JobLocations');
var trackContact = mongoose.model('TrackUniqueContact');
var qualificationModel = mongoose.model('Qualifications');
var locationsModel = mongoose.model('JobLocations');
var areaOfInterestModel = mongoose.model('AreaOfInterest');
var candidateRegisterModel = mongoose.model('CandidateRegister');


var getCityName = function(result, cb) {
	var jobCityids = [];

	for (var i in result) {
		if (result[i].jobCity) {
			jobCityids.push(result[i].jobCity);
		}
	}

	cityModel.find({
		_id: {
			$in: jobCityids,
		}
	}, {
		city: true
	}).lean().exec(function(err, cityRes) {

		for (var i in result) {
			for (var j in cityRes) {
				if (cityRes[j]._id == result[i].jobCity) {
					result[i].cityName = cityRes[j].city;
				}
			}
		}

		cb(result);
	});
}



/**
 *
 */
exports.getCurrentJobs = function(req, res) {
	if (!req.body.skip) {
		req.body.skip = 0;
	}

	var finalRes = function(fresponse) {
		getCityName(fresponse, function(result) {
			jobsModel.countDocuments({ status: 2 }).exec(function(err, count) {
				var remainingCount = 0;

				if (req.body.skip == 0) {
					remainingCount = (count - result.length);
				}

				if (req.body.skip != 0) {
					var total = (req.body.skip+result.length);
					remainingCount = (count - total);
				}

				if (result && result.length) {
					for (var i in result) {
						if (!result[i].totalView) {
							result[i].totalView = 0;
						}
						if (result[i].updatedAt) {
							result[i].createdAt = result[i].updatedAt;
						}
					}

					result = helperCTRL.sortByKeyDesc(result, 'createdAt');
				}

				res.json({
					result: result,
					count: count,
					remainingCount: remainingCount,
				});
			});
		});
	}


	jobsModel.find({
		status: 2
	}).sort({ createdAt: -1 }).skip(req.body.skip).limit(250).lean().exec(function(err, jobResponse) {
		if (jobResponse && jobResponse.length) {
			finalRes(jobResponse);
		} else{
			finalRes(jobResponse);
		}
	});
};


/**
 *
 */
exports.getJobsByLocation = function(req, res) {
	var finalRes = function(result) {
		jobsModel.countDocuments({ status: 2 }).exec(function(err, count) {
			res.json({
				result: result,
				count: count
			});
        });
	}


	cityModel.find({}, {
		city: true
	}).lean().exec(function(err, cityRes) {

		if (cityRes && cityRes.length) {
			var cityids = [];
			var cityArray = [];

			for (var j in cityRes) {
				cityids.push(cityRes[j]._id);
			}


			jobsModel.find({ jobCity: { $in: cityids }}, {
				jobCity: true,
			}).exec(function(err, jobResponse) {
				for (var i in jobResponse) {
					if (!cityArray[jobResponse[i].jobCity]) {
						cityArray[jobResponse[i].jobCity] = [];
					}
					cityArray[jobResponse[i].jobCity].push(jobResponse[i].jobCity);
				}

				for (var i in cityRes) {
					if (cityArray[cityRes[i]._id]) {
						cityRes[i].count = cityArray[cityRes[i]._id].length;
					}
				}

				var cttArr = [];
				for (var i in cityRes) {
					if (cityRes[i].count && cityRes[i].count > 0) {
						cttArr.push(cityRes[i]);
					}
				}

				res.json(cttArr);
			});
		} else {
			res.json(cityRes);
		}
	});
};




/**
 *
 */
exports.getJobsByFilter = function(req, res) {
	req.body.condition.status = 2;

	var finalRes = function(result) {
		jobsModel.countDocuments(req.body.condition).exec(function(err, count) {
			res.json({
				result: result,
				count: count
			});
        });
	}


	jobsModel.find(req.body.condition).skip(req.body.skip).limit(100).lean().exec(function(err, jobResponse) {
		if (jobResponse && jobResponse.length) {
			finalRes(jobResponse);
		} else{
			finalRes(jobResponse);
		}
	});
};


/**
 *
 */
exports.getAppJobsByFilter = function(req, res) {
	var condition = {
		status: 2,
	};

	if (req.body.key == '1') {
		condition.jobCategory = req.body.id;
	}
	if (req.body.key == '2') {
		condition.jobCity = req.body.id;
	}

	var finalRes = function(fresponse) {
		getCityName(fresponse, function(result) {
			jobsModel.countDocuments(condition).exec(function(err, count) {
				if (result && result.length) {
					for (var i in result) {
						if (!result[i].totalView) {
							result[i].totalView = 0;
						}
					}
				}

				res.json({
					result: result,
					count: count
				});
	        });
        });
	}

	jobsModel.find(condition).skip(req.body.skip).limit(100).lean().exec(function(err, jobResponse) {
		if (jobResponse && jobResponse.length) {
			finalRes(jobResponse);
		} else{
			finalRes(jobResponse);
		}
	});
};


/**
 *
 */
exports.checkUniqueContact = function(req, res) {
	trackContact.find({
		contact: req.body.contact,
	}).exec(function(err, cRes) {

		var insertContact = function(msg) {
			req.body.createdAt = new Date().getTime();
			req.body.platform = 'Android';

			var contactForm = new trackContact(req.body);

			contactForm.save(function(err, saveRes) {
				res.json({
					status: 1,
					message: msg,
				});
			});
		}

		if (cRes && cRes.length) {
			for (var i in cRes) {
				if (cRes[i].jobId == req.body.jobId) {
					res.json({
						status: 2,
						message: 'Sorry! You are already apply for this job.',
					});
					return;
				}
			}
			insertContact('Congratulations, You are successfully apply for job.');
		} else {
			res.json({
				status: 3,
			});
		}
	});
};


/**
 *
 */
exports.uniqueContact = function(req, res) {
	trackContact.find({
		contact: req.body.contact,
	}).exec(function(err, uniqueRes) {
		res.json(uniqueRes.length);
	});
};


/**
 *
 */
exports.postJobViews = function(req, res) {
	jobsModel.update({
        _id: req.body.jobId,
    },{
    	$inc: { totalView: 1 }
   	}).exec(function(err, result) {
        res.json({
        	status: true,
        	result: result,
        	err: err,
        });
    });
};


/**
 *
 */
exports.login = function(req, res) {
	candidateRegisterModel.findOne({
        mobile: parseInt(req.body.mobile),
    }).exec(function(err, response) {
    	if (!(response && response._id)) {
	        res.json({
	        	status: false,
	        	message: 'Uesr not found.'
	        });
	        return;
    	}

    	if (response.password != req.body.password) {
			res.json({
				status: false,
				message: 'Password is invalid.'
			});
			return;
    	}

    	res.json({
			status: true,
			result: response
		});
    });
};


/**
 *
 */
exports.resetPass = function(req, res) {
	candidateRegisterModel.findOne({
        mobile: parseInt(req.body.mobile),
    }).exec(function(err, response) {
    	if (!(response && response._id)) {
	        res.json({
	        	status: false,
	        	message: 'Uesr not found.'
	        });
	        return;
    	}

		candidateRegisterModel.update({
		    mobile: parseInt(req.body.mobile),
		},{
			password: req.body.mobile
		}).exec(function(err, result) {});

    	res.json({
			status: true,
		});
    });
};


/**
 *
 */
exports.getJobsId = function(req, res) {
	trackContact.find({
		contact: req.body.mobile
	}, {
		jobId: true,
	}).exec(function(err, contactRes) {
		var ids = [];

		for (var i in contactRes) {
			ids.push(contactRes[i].jobId);
		}

		res.json(ids);
	});
};



/**
 *
 */
exports.getAssetsData = function(req, res) {	
	async.parallel({
	    qualification: function(callback) {
			qualificationModel.find({
				status: true,
			}).exec(function(err, qualRes) {
				callback(null, qualRes);
			});
	    },
	    locations: function(callback) {
			locationsModel.find({
				status: true,
			}).exec(function(err, locaRes) {
				callback(null, locaRes);
			});
	    },
	    areaOfInterest: function(callback) {
			areaOfInterestModel.find({
				status: true,
			}).exec(function(err, ariRes) {
				callback(null, ariRes);
			});
	    }
	}, function(err, results) {
		res.json({
			qualification: results.qualification,
			locations: results.locations,
			areaOfInterest: results.areaOfInterest,
		});
	});
};