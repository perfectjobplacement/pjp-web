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
exports.getDataWithCondition = function(req, res) {

	if (!req.body.model) {
		res.json([]);
		return;
	}

	var commonModel = mongoose.model(req.body.model);

	commonModel.find(req.body.condition).sort({ createdAt: -1 }).limit(100).skip(req.body.skip).exec(function(err, responseData) {

		if(err) {
			res.json({
				status: false,
				count: 0,
				data: []
			});
			return;
		}

		commonModel.find(req.body.condition).count(function(err, count) {
			res.json({ 
				status: true,
				data: responseData,
				count: count,
			});
			return;
		});
	});
};




/**
 * Get job list with user data
 */
exports.getJobList = function(req, res) {

	var JobsBazaarModel = mongoose.model('JobsBazaar');
	var cityModel = mongoose.model('JobLocations');
	var jobIds = [];


	JobsBazaarModel.find({ status: { $ne: 3 }}).lean().exec(function(err, responseData) {

		var finalres = function() {
			if(err) {
				res.json({
					status: false,
					data: []
				});
				return;
			}

			if (responseData.length) {
				for (var i in responseData) {
					if (responseData[i].updatedAt) {
						responseData[i].createdAt = responseData[i].updatedAt;
					}
				}
				responseData = helperCTRL.sortByKeyDesc(responseData, 'createdAt');
			}

			res.json({
				status: true,
				data: responseData
			});
		}

		var cities = [];
		if (responseData && responseData.length) {
			for (var i in responseData) {
				cities.push(responseData[i].jobCity);
			}


			cityModel.find({
				_id: { $in: cities }
			}).exec(function(err, citesRes) {
				for (var i in responseData) {
					for (var j in citesRes) {
						if (citesRes[j]._id == responseData[i].jobCity) {
							responseData[i].cityName = citesRes[j].city;
						}
					}
				}

                finalres();
            });
		} else {
			finalres();
		}
	});
};




/**
 * Get job's candidates with user data
 */
exports.getJobsCandidates = function(req, res) {

	var TrackUniqueContactModel = mongoose.model('TrackUniqueContact');
	var CandidateRegister = mongoose.model('CandidateRegister');
	var Qualifications = mongoose.model('Qualifications');
	var contactNumber = [];


	TrackUniqueContactModel.find({ jobId:  req.body.jobId }, { contact: true }).exec(function(err, trackData) {

		if(err) {
			res.json({
				status: false,
				data: []
			});
			return;
		}

		if (!trackData.length) {
			res.json({
				status: false,
				data: []
			});
			return;
		}

		for (var i in trackData) {
			contactNumber.push(trackData[i].contact);
		}


		CandidateRegister.find({ mobile: { $in: contactNumber }}, {
			name: true,
			mobile: true,
			qualifiction: true,
			city: true,
			gender: true,
			experience: true,
			areaOfInterest: true,
			qualification: true,
			expectedSalary: true,
			createdAt: true,
		}).exec(function(err, caRes) {

			if (caRes.length) {

				caRes = JSON.parse(JSON.stringify(caRes));

				var qlname = [];
				for (var row in caRes) {
					qlname.push(caRes[row].qualification);
				}

				Qualifications.find({ qualifyIn: { $in: qlname } }).exec(function(err, qaResponse) {

					for (var qarow in qaResponse) {
						for (var caResRow in caRes) {
							if (caRes[caResRow].qualification == qaResponse[qarow].qualifyIn) {
								caRes[caResRow].qualificationName = qaResponse[qarow].name;
							}
						}
					}

					res.json({
						status: true,
						data: caRes
					});
				});
			} else {
				res.json({
					status: true,
					data: caRes
				});
			}
		});
	});
};




/**
 * Filter candidates with user data
 */
exports.filterJobsCandidates = function(req, res) {

	var CandidateRegister = mongoose.model('CandidateRegister');
	var Qualifications = mongoose.model('Qualifications');
	var cityModel = mongoose.model('JobLocations');

	var condition = {};


	if (req.body.filter.experience) {
		condition.experience = req.body.filter.experience;
	}

	if (req.body.filter.gender) {
		condition.gender = req.body.filter.gender;
	}

	if (req.body.filter.qualification) {
		condition.qualification = req.body.filter.qualification;
	}

	if (req.body.filter.areaOfInterest) {
		condition.areaOfInterest = { $in:[req.body.filter.areaOfInterest] };
	}


    async.parallel({
        getCandidates: function(callback) {
            CandidateRegister.find(condition).lean().exec(function(err, caRes) {
                callback(null, caRes);
            });
        },
        getQualification: function(callback) {
            Qualifications.find({}).exec(function(err, qaResponse) {
            	callback(null, qaResponse);
            });
        },
        getCities: function(callback) {
            cityModel.find({}).exec(function(err, citesRes) {
                callback(null, citesRes);
            });
        }
    }, function(err, results) {

    	if (results.getCandidates && results.getCandidates.length) {
    		
    		var finaldata = results.getCandidates;

    		for (var i in results.getQualification) {
				for (var j in finaldata) {
					if (finaldata[j].department == results.getQualification[i]._id) {
						finaldata[j].qualificationName = results.getQualification[i].name;
					}
				}
			}
			
			for (var i in results.getCities) {
				for (var j in finaldata) {
					if (finaldata[j].city == results.getCities[i]._id) {
						finaldata[j].cityName = results.getCities[i].city;
					}
				}
			}

			res.json(finaldata);
    		return;
    	}

        res.json([]);
    });
};





/**
 * Get job list with user data
 */
exports.downloadCsv = function(req, res) {

	var ourClients = mongoose.model('OurClients');
	const json2csv = require('json2csv').parse;


	ourClients.find({}).exec(function(err, clients) {

		clients = JSON.parse(JSON.stringify(clients));

		if (clients.length) {
			for (var i in clients) {

				if (!clients[i].city) {
					clients[i].city = '-';
				}

				delete clients[i]._id;
				delete clients[i].isActive;
				delete clients[i].password;
				delete clients[i].createdAt;
				delete clients[i].__v;
			}
		}
		

		if (req.body.isDownloadCSV == 'true') {

	        var _fileds = Object.keys(clients[0]);
	        var data = [];

	        for (var d in clients) {
	            var tmpObj = {};

	            for (var d1 in clients[d]) {
	                tmpObj[d1] = helperCTRL.fixedFiledName(clients[d][d1]);
	            }

	            data.push(tmpObj);
	        }

			const opts = { _fileds };

			try {
			  	const csv = json2csv(data, opts);

			  	res.set({
	                'Content-Type': 'text/csv',
	                'Content-disposition': 'attachment; filename=' + req.body.csvName + '.csv'
	            });
	            res.end(csv);
			} catch (err) {
			  	console.error(err);
			}
	    }
	});
};