'use strict';

appModule.controller('UserDashboardController', ['$scope', '$http', '$location', '$uibModal', '$stateParams', '$rootScope', '$timeout', '$state', 'icdb', 'alertService',
    function($scope, $http, $location, $uibModal, $stateParams, $rootScope, $timeout, $state, icdb, alertService) {

    	$scope.udObj = {};









    	// ----------------------------------------------------------
    	// Get jobs
    	// ----------------------------------------------------------

    	$scope.udObj.jobObj = {};


    	// ------------ Manage Profile --------------
    	$scope.udObj.jobObj.list = {};
    	$scope.udObj.jobObj.list.data = [];
    	$scope.udObj.jobObj.list.isLoading = false;
    	
    	$scope.udObj.jobObj.list.init = function() {
    		$scope.udObj.jobObj.list.isLoading = true;

       		$http.post('/api/v1/get-client-jobs', {
       			skip: 0,
       			userId: $rootScope.g.loggedUser._id
       		}).success(function(response) {
		
				$scope.udObj.jobObj.list.data = response.jobs;

				$timeout(function() {
					$scope.udObj.jobObj.list.isLoading = false;
				}, 10);
			});
       	}

       	$scope.udObj.jobObj.list.init();







       	// ----------------------------------------------------------
    	// Manage profile data
    	// ----------------------------------------------------------


    	// ------------ Manage Profile --------------
    	$scope.udObj.profileObj = {};
    	$scope.udObj.profileObj.model = {};
    	$scope.udObj.profileObj.isSubmited = false;
       	
       	$scope.udObj.profileObj.init = function() {
       		$scope.udObj.profileObj.model = angular.copy($rootScope.g.loggedUser);
       	}

       	$scope.udObj.profileObj.submit = function(form) {
       		if (!form.$valid) {
       			$scope.udObj.profileObj.isSubmited = true;
       			return;
       		}
       		$scope.udObj.profileObj.isReqSent = true;

       		icdb.update('OurTeam', $scope.udObj.profileObj.model._id, $scope.udObj.profileObj.model, function(result) {
       			$scope.udObj.profileObj.isSubmited = false;
       			$scope.udObj.profileObj.isReqSent = false;
				alertService.flash('success', 'Profile has been updated successfully.');
			});
       	}





       	// ------------ Chnage Password -----------------
		$scope.udObj.chPassObj = {};
		$scope.udObj.chPassObj.model = {};
		$scope.udObj.chPassObj.isSubmited = false;
		$scope.udObj.chPassObj.isReqSent = false;

		$scope.udObj.chPassObj.submit = function(form) {
			if (!form.$valid) {
				$scope.udObj.chPassObj.isSubmited = true;
				return;
			}
			if ($scope.udObj.chPassObj.model.oldPassword != $rootScope.g.loggedUser.password) {
				alertService.flash('error', 'Old Password is incorrect.');
				return;
			}

			$scope.udObj.chPassObj.isReqSent = true;

			$http.post('/api/user/change-pass', {
				_id: $rootScope.g.loggedUser._id,
				password: $scope.udObj.chPassObj.model.password
			}).success(function(result) {
				$scope.udObj.chPassObj.isSubmited = false;
				$scope.udObj.chPassObj.isReqSent = false;
				$scope.udObj.chPassObj.model = {};
				alertService.flash('success', 'Password has been updated successfully.');
			});
		}












		// ----------------------------------------------------------
    	// Create new job
    	// ----------------------------------------------------------


		$scope.udObj.jobObj.add = {};
		$scope.udObj.jobObj.add.model = {};

		$scope.udObj.jobObj.add.openModal = function() {
			$scope.udObj.jobObj.add.model.jobWorkType = 1;
			$scope.udObj.jobObj.add.model.candidateType = 1;
			$scope.udObj.jobObj.add.model.salaryType = 1;
			$scope.udObj.jobObj.add.model.interviewDateFrom = new Date();
			$scope.udObj.jobObj.add.model.interviewDateTo = new Date();
			$scope.udObj.jobObj.add.model.requiredDoc = [];
			$scope.udObj.jobObj.add.model.department = [];
			$scope.udObj.jobObj.add.model.requiredDoc.push(globalObj.requiredDocuments[0]);

			$('#create-new-job').modal('show');
		}


		$scope.udObj.jobObj.add.closeModal = function() {
			$scope.udObj.jobObj.add.model = {};
			$scope.udObj.jobObj.add.isSubmited = false;
			$scope.udObj.jobObj.add.isReqSent = false;

			$('#create-new-job').modal('hide');
		}



		$scope.udObj.jobObj.add.isSubmited = false;
		$scope.udObj.jobObj.add.isReqSent = false;

		$scope.udObj.jobObj.add.submit = function(form) {

			if (!form.$valid) {
				$scope.udObj.jobObj.add.isSubmited = true;
				return;
			}

			if (!$rootScope.g.loggedUser._id) {
				alertService.flash('error', 'Plase login to post job.');
				return;
			}

			$scope.udObj.jobObj.add.isReqSent = true;
			$scope.udObj.jobObj.add.model.userId = $rootScope.g.loggedUser._id;
			$scope.udObj.jobObj.add.model.createdBy = 'User';
			
			icdb.insert('JobsBazaar', $scope.udObj.jobObj.add.model, function(result) {
				$scope.udObj.jobObj.add.closeModal();
	            alertService.flash('success', 'Job has been created successfully.');
	        });
		}



		// -------------- Update Job -------------------
		$scope.udObj.jobObj.edit = {};
		$scope.udObj.jobObj.edit.model = {};

		$scope.udObj.jobObj.edit.openModal = function(row) {
			$scope.udObj.jobObj.edit.model = angular.copy(row);
			$scope.udObj.jobObj.edit.model.interviewDateFrom = new Date(row.interviewDateFrom);
			$scope.udObj.jobObj.edit.model.interviewDateTo = new Date(row.interviewDateTo);

			$('#update-existing-job').modal('show');
		}

		$scope.udObj.jobObj.edit.closeModal = function() {
			$scope.udObj.jobObj.edit.model.model = {};
			$scope.udObj.jobObj.edit.isSubmited = false;
			$scope.udObj.jobObj.edit.isReqSent = false;
			$('#update-existing-job').modal('hide');
		}

		
		$scope.udObj.jobObj.edit.isSubmited = false;
		$scope.udObj.jobObj.edit.isReqSent = false;

		$scope.udObj.jobObj.edit.submit = function(form) {

			if (!form.$valid) {
				$scope.udObj.jobObj.edit.isSubmited = true;
				return;
			}

			$scope.udObj.jobObj.edit.isReqSent = true;
			$scope.udObj.jobObj.edit.model.createdBy = 'User';

			icdb.update('JobsBazaar', $scope.udObj.jobObj.edit.model._id, $scope.udObj.jobObj.edit.model, function(response) {
				$scope.udObj.jobObj.edit.closeModal();
				$scope.udObj.jobObj.list.data.push(response);
				alertService.flash('success', 'Job has been created successfully.');
			});
		}



		$scope.udObj.jobObj.delete = {};

		$scope.udObj.jobObj.delete.submit = function(row, status) {

			if (!status) {
				row.isDelete = false;
				return;
			}

			icdb.remove('JobsBazaar', row._id, function(response) {
				for (var r in $scope.udObj.jobObj.list.data) {
					if ($scope.udObj.jobObj.list.data[r]._id == row._id) {
						$scope.udObj.jobObj.list.data.splice(r, 1);
					}
				}
			});
		}







	}
]);