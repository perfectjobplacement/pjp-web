'use strict';

appModule.controller('AdminController', ['$scope', '$http', '$location', '$uibModal', '$stateParams', '$rootScope', '$timeout', '$state', 'icdb', 'alertService',
    function($scope, $http, $location, $uibModal, $stateParams, $rootScope, $timeout, $state, icdb, alertService) {


    	$scope.adminObj = {};

		$rootScope.globalvarObj = {};
		$rootScope.globalObj = {};

		$scope.adminObj.init = function() {

			icdb.get('JobLocations', function(response) {
				$rootScope.globalvarObj.cites = response;
			});

		    icdb.get('Qualifications', function(response) {
				$rootScope.globalvarObj.qualification = response;
			});

			icdb.get('AreaOfInterest', function(response) {
				$rootScope.globalvarObj.areaOfInterest = response;
			});

			icdb.getCondition('JobsBazaar', {
				status: 2
			}, function(response) {
				$rootScope.globalvarObj.activeJobs = response;
	        });
		}

		$scope.adminObj.init();
	    
	}
]);