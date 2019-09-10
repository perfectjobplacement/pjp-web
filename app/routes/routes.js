'use strict';

var express = require('express');
var router = express.Router();
var cors = require('cors');
var connectMultiparty = require('connect-multiparty');
var multipartMiddleware = connectMultiparty();
require('../models/model');

var ctrl = {
    home: require('../controllers/home'),
    common: require('../controllers/common'),
    siteMgmt: require('../controllers/siteMgmt'),
    users: require('../controllers/users'),
    adminUsers: require('../controllers/adminUsers'),
    manageAdminCtrl: require('../controllers/adminMgmtController'),
    userDashboard: require('../controllers/userDashboardController')
};



// define the home page route
router.get('/', ctrl.home.index);
router.get('/admin', ctrl.home.index1);


// Common routes
router.post('/api/common/add-data', cors(), ctrl.common.postAddData);
router.post('/api/common/get-data', ctrl.common.getData);
router.post('/api/common/get-condition', cors(), ctrl.common.getCondition);
router.post('/api/common/single-data', ctrl.common.getSingle);
router.post('/api/common/edit-data', ctrl.common.getEditData);
router.post('/api/common/delete', ctrl.common.getDeleteData);
router.post('/api/common/delete-condition', ctrl.common.getDeleteDataCondition);
router.post('/api/common/file/upload/:key', multipartMiddleware, ctrl.common.commonUploadFile);
router.post('/api/common/get/load-more', ctrl.common.loadMore);

router.post('/api/site/user-visitor', ctrl.common.siteVisitor);
router.post('/api/v1/post/resume', ctrl.common.SendResumrViaEmail);


// Auth routes
router.post('/api/user/register', ctrl.users.register);
router.post('/api/user/login', ctrl.users.login);
router.post('/api/user/forgot-pass', ctrl.users.forgotPassword);
router.post('/api/user/change-pass', ctrl.users.changePassword);
router.get('/users/me', ctrl.users.me);
router.get('/users/signout', ctrl.users.signout);

// Admin Route
router.get('/api/admin-user/register', ctrl.adminUsers.register);
router.post('/api/admin-user/login', ctrl.adminUsers.login);
router.get('/api/admin/get/dashboard-counts', ctrl.adminUsers.getDbCount);

//
router.post('/api/admin/get-data/with-condition', ctrl.manageAdminCtrl.getDataWithCondition);
router.post('/api/admin/get-job/all', ctrl.manageAdminCtrl.getJobList);
router.post('/api/admin/get-candidates/by-job', ctrl.manageAdminCtrl.getJobsCandidates);
router.post('/api/admin/filter-candidates', ctrl.manageAdminCtrl.filterJobsCandidates);

// Other routes
router.all('/api/site/get-jobs', ctrl.siteMgmt.getCurrentJobs);
router.all('/api/site/get-jobsby-filter', ctrl.siteMgmt.getJobsByFilter);

// User dashboars
router.post('/api/v1/get-client-jobs', ctrl.userDashboard.getAllJobs);


// Mobile Routes
router.all('/api/v1/app/get-jobs', cors(), ctrl.siteMgmt.getCurrentJobs);
router.all('/api/v1/app/filter-jobs', cors(), ctrl.siteMgmt.getAppJobsByFilter);
router.all('/api/v1/app/jobs-by-location', cors(), ctrl.siteMgmt.getJobsByLocation);
router.all('/api/v1/app/check-contact/unique', cors(), ctrl.siteMgmt.checkUniqueContact);
router.all('/api/v1/app/track/unique-contact', cors(), ctrl.siteMgmt.uniqueContact);
router.all('/api/v1/app/get/get-assets-data', cors(), ctrl.siteMgmt.getAssetsData);
router.all('/api/v1/app/post/job-view', cors(), ctrl.siteMgmt.postJobViews);



module.exports = router;
