'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uid = require('uid');
const async = require('async');
const helperCTRL = require('./helper');

const jobsModel = mongoose.model('JobsBazaar');
const cityModel = mongoose.model('JobLocations');
const trackContact = mongoose.model('TrackUniqueContact');
const qualificationModel = mongoose.model('Qualifications');
const locationsModel = mongoose.model('JobLocations');
const areaOfInterestModel = mongoose.model('AreaOfInterest');
const candidateRegisterModel = mongoose.model('CandidateRegister');


const getCityName = (result, cb) => {
	let jobCityids = [];

	for (let i in result) {
		if (result[i].jobCity) {
			jobCityids.push(result[i].jobCity);
		}
	}

	cityModel.find({_id: {$in: jobCityids}}, {city: true}).lean().exec((err, cityRes) => {
		for (let i in result) {
			for (let j in cityRes) {
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
exports.getCurrentJobs = (req, res) => {
	if (!req.body.skip) {
		req.body.skip = 0;
	}

	const finalRes = (fresponse) => {
		getCityName(fresponse, (result) => {
			jobsModel.countDocuments({ status: 2 }).exec((err, count) => {

				let remainingCount = 0;

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

	jobsModel.find({status: 2}).sort({ createdAt: -1 }).skip(req.body.skip).limit(250).lean().exec((err, jobResponse) => {
		// console.log(jobResponse);

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
exports.getJobsByLocation = (req, res) => {
	const finalRes = (result) => {
		jobsModel.countDocuments({ status: 2 }).exec((err, count) => {
			res.json({
				result: result,
				count: count
			});
        });
	}

	cityModel.find({},{city: true}).lean().exec((err, cityRes) => {

		if (cityRes && cityRes.length) {
			let cityids = [];
			let cityArray = [];

			for (let j in cityRes) {
				cityids.push(cityRes[j]._id);
			}

			jobsModel.find({ jobCity: { $in: cityids }}, {jobCity: true,}).exec((err, jobResponse) => {
				for (let i in jobResponse) {
					if (!cityArray[jobResponse[i].jobCity]) {
						cityArray[jobResponse[i].jobCity] = [];
					}
					cityArray[jobResponse[i].jobCity].push(jobResponse[i].jobCity);
				}

				for (let i in cityRes) {
					if (cityArray[cityRes[i]._id]) {
						cityRes[i].count = cityArray[cityRes[i]._id].length;
					}
				}

				let cttArr = [];
				for (let i in cityRes) {
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
exports.getJobsByFilter = (req, res) => {
	req.body.condition.status = 2;

	const finalRes = (result) => {
		jobsModel.countDocuments(req.body.condition).exec((err, count) => {
			res.json({
				result: result,
				count: count
			});
        });
	}

	jobsModel.find(req.body.condition).skip(req.body.skip).limit(100).lean().exec((err, jobResponse) => {
		finalRes(jobResponse);
	});
};


/**
 *
 */
exports.getAppJobsByFilter = (req, res) => {
	let condition = {
		status: 2,
	};

	if (req.body.key == '1') {
		condition.jobCategory = req.body.id;
	}
	if (req.body.key == '2') {
		condition.jobCity = req.body.id;
	}

	const finalRes = (fresponse) => {
		getCityName(fresponse, (result) => {
			jobsModel.countDocuments(condition).exec((err, count) => {
				if (result && result.length) {
					for (let i in result) {
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
	trackContact.find({contact: req.body.contact}).exec(function(err, uniqueRes) {
		res.json(uniqueRes.length);
	});
};


/**
 *
 */
exports.postJobViews = function(req, res) {
	jobsModel.update({_id: req.body.jobId,},{$inc: { totalView: 1 }}).exec(function(err, result) {
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
	candidateRegisterModel.findOne({mobile: parseInt(req.body.mobile)}).exec(function(err, response) {
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
	        	message: 'User not found.'
	        });
	        return;
    	}
		candidateRegisterModel.update({mobile: parseInt(req.body.mobile)},{password: req.body.mobile}).exec(function(err, result) {});
    	res.json({
			status: true,
		});
    });
};


/**
 *
 */
exports.getJobsId = function(req, res) {
	trackContact.find({contact: req.body.mobile},{jobId: true}).exec(function(err, contactRes) {
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