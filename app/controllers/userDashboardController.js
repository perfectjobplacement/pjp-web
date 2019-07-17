'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	async = require('async'),
	uid = require('uid'),
	helperCTRL = require('./helper');




/**
 *
 */
exports.getAllJobs = function(req, res) {

	var jobsModel = mongoose.model('JobsBazaar');
	var cityModel = mongoose.model('JobLocations');

	var finalRes = function(result) {

		jobsModel.countDocuments({ userId: req.body.userId }).exec(function(err, count) {
			res.json({
				jobs: result,
				count: count
			});
        });
	}


	jobsModel.find({ userId: req.body.userId }).sort({ createdAt: -1 }).skip(req.body.skip).limit(20).exec(function(err, jobResponse) {

		if (jobResponse && jobResponse.length) {
			jobResponse = JSON.parse(JSON.stringify(jobResponse));

			var cities = [];
			for (var i in jobResponse) {
				cities.push(jobResponse[i].jobCity);
			}

			cityModel.find({
				_id: { $in: cities }
			}, {
				city: true
			}).exec(function(err, cityRes) {

				for (var j in cityRes) {
					for (var i in jobResponse) {
						if (jobResponse[i].jobCity == cityRes[j]._id) {
							jobResponse[i].cityName = cityRes[j].city;
							jobResponse[i].cityId = cityRes[j]._id;
						}
					}
				}
				
				finalRes(jobResponse);
			});
		} else{
			finalRes(jobResponse);
		}
	});
};