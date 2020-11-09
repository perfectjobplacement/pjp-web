'use strict';

const express = require('express');
const router = express.Router();
const cors = require('cors');
const connectMultiparty = require('connect-multiparty');
const multipartMiddleware = connectMultiparty();
require('../models/model');

const ctrl = {
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
router.all('/api/common/add-data', cors(), ctrl.common.postAddData);
router.all('/api/common/get-data', cors(), ctrl.common.getData);
router.all('/api/common/get-condition', cors(), ctrl.common.getCondition);
router.all('/api/common/single-data', ctrl.common.getSingle);
router.all('/api/common/edit-data', cors(), ctrl.common.getEditData);
router.all('/api/common/delete', ctrl.common.getDeleteData);
router.all('/api/common/delete-condition', ctrl.common.getDeleteDataCondition);
router.all('/api/common/file/upload/:key', multipartMiddleware, ctrl.common.commonUploadFile);
router.all('/api/common/get/load-more', ctrl.common.loadMore);

router.all('/api/site/user-visitor', ctrl.common.siteVisitor);
router.all('/api/v1/all/resume', ctrl.common.SendResumrViaEmail);


// Auth routes
router.all('/api/user/register', ctrl.users.register);
router.all('/api/user/login', ctrl.users.login);
router.all('/api/user/forgot-pass', ctrl.users.forgotPassword);
router.all('/api/user/change-pass', ctrl.users.changePassword);
router.all('/users/me', ctrl.users.me);
router.all('/users/signout', ctrl.users.signout);

// Admin Route
router.all('/api/admin-user/register', ctrl.adminUsers.register);
router.all('/api/admin-user/login', ctrl.adminUsers.login);
router.all('/api/admin/get/dashboard-counts', ctrl.adminUsers.getDbCount);

//
router.all('/api/admin/get-data/with-condition', ctrl.manageAdminCtrl.getDataWithCondition);
router.all('/api/admin/get-job/all', ctrl.manageAdminCtrl.getJobList);
router.all('/api/admin/get-candidates/by-job', ctrl.manageAdminCtrl.getJobsCandidates);
router.all('/api/admin/filter-candidates', ctrl.manageAdminCtrl.filterJobsCandidates);

// Other routes
router.all('/api/site/get-jobs', ctrl.siteMgmt.getCurrentJobs);
router.all('/api/site/get-jobsby-filter', ctrl.siteMgmt.getJobsByFilter);

// User dashboars
router.all('/api/v1/get-client-jobs', ctrl.userDashboard.getAllJobs);


// Mobile Routes
router.all('/api/v1/app/get-jobs', cors(), ctrl.siteMgmt.getCurrentJobs);
router.all('/api/v1/app/filter-jobs', cors(), ctrl.siteMgmt.getAppJobsByFilter);
router.all('/api/v1/app/jobs-by-location', cors(), ctrl.siteMgmt.getJobsByLocation);
router.all('/api/v1/app/check-contact/unique', cors(), ctrl.siteMgmt.checkUniqueContact);
router.all('/api/v1/app/track/unique-contact', cors(), ctrl.siteMgmt.uniqueContact);
router.all('/api/v1/app/get/get-assets-data', cors(), ctrl.siteMgmt.getAssetsData);
router.all('/api/v1/app/post/job-view', cors(), ctrl.siteMgmt.postJobViews);
router.all('/api/v1/app/login', cors(), ctrl.siteMgmt.login);
router.all('/api/v1/app/get-jobs-id', cors(), ctrl.siteMgmt.getJobsId);
router.all('/api/v1/app/password/reset', cors(), ctrl.siteMgmt.resetPass);



module.exports = router;
