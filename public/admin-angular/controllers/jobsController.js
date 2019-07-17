appModule.controller('JobMgmtController', ['$scope', '$http', '$location', '$uibModal', '$stateParams', '$rootScope', '$timeout', '$state', 'icdb', 'alertService',
    function($scope, $http, $location, $uibModal, $stateParams, $rootScope, $timeout, $state, icdb, alertService) {
		
		
		$scope.jobMgmtObj = {};


		// --------- Get job data -------------
		$scope.jobMgmtObj.list = {};
		$scope.jobMgmtObj.list.loading = false;
		$scope.jobMgmtObj.list.data = [];

		$scope.jobMgmtObj.list.init = function() {
			$scope.jobMgmtObj.list.loading = true;

			$http.post('api/admin/get-job/all').success(function(response) {
				$scope.jobMgmtObj.list.data = response.data;

				$timeout(function() {
	        		$scope.jobMgmtObj.list.loading = false;
	        	}, 10);
	        });
		}



		$scope.jobMgmtObj.cdList = {};
		$scope.jobMgmtObj.cdList.rowObj = {};
		$scope.jobMgmtObj.cdList.data = [];
		$scope.jobMgmtObj.cdList.loading = false;
		
		$scope.jobMgmtObj.cdList.init = function(jobRow) {
			$scope.jobMgmtObj.cdList.loading = true;
			
			$scope.jobMgmtObj.cdList.data = [];
			$scope.jobMgmtObj.cdList.rowObj = angular.copy(jobRow);

			$('#candidates-list').modal('show');

			$http.post('api/admin/get-candidates/by-job', {
				jobId: jobRow._id
			}).success(function(response) {

				$scope.jobMgmtObj.cdList.data = response.data;
				
				for (var i in $rootScope.globalvarObj.cites) {
					for (var j in $scope.jobMgmtObj.cdList.data) {
						if ($scope.jobMgmtObj.cdList.data[j].city == $rootScope.globalvarObj.cites[i]._id) {
							$scope.jobMgmtObj.cdList.data[j].cityName = $rootScope.globalvarObj.cites[i].city;
						}
					}
				}

				$timeout(function() {
	        		$scope.jobMgmtObj.cdList.loading = false;
	        	}, 10);
	        });
		}


		// -------------- Update Job -------------------
		$scope.job = {};
		$scope.job.create = {};
		$scope.job.create.model = {};

		$scope.job.create.openModal = function(dataRow) {
			$scope.job.create.model = angular.copy(dataRow);
			$scope.job.create.model.interviewDateFrom = new Date(dataRow.interviewDateFrom);
			$scope.job.create.model.interviewDateTo = new Date(dataRow.interviewDateTo);
			$('#add-new-job').modal('show');
		}


		$scope.job.create.closeModal = function() {
			$scope.job.create.model = {};
			$scope.job.create.isSubmited = false;
			$scope.job.create.isReqSent = false;
			$('#add-new-job').modal('hide');
		}


		$scope.job.create.isSubmited = false;
		$scope.job.create.isReqSent = false;
		$scope.job.create.submit = function(form) {

			if (!form.$valid) {
				$scope.job.create.isSubmited = true;
				return;
			}

			$scope.job.create.isReqSent = true;


			icdb.update('JobsBazaar', $scope.job.create.model._id, $scope.job.create.model, function(result) {
				$scope.job.create.closeModal();
	            alertService.flash('success', 'Job has been Updated successfully.');
	        });
		}



		$scope.jobMgmtObj.jobStatsus = {};
		$scope.jobMgmtObj.jobStatsus.submit = function(row) {
			icdb.update('JobsBazaar', row._id,{
				status: row.status
			}, function(response) {
				alertService.flash('success', 'Job status has been updates successfully.');
			});
		}



		// -------------- Delete Job -------------------
		$scope.jobMgmtObj.delete = {};
		$scope.jobMgmtObj.delete.openModal = function(row) {
			$('#common-delete-modal').modal('show');

			$scope.jobMgmtObj.delete.submit = function() {

				icdb.remove('JobsBazaar', row._id, function(response) {
					for (var i in $scope.jobMgmtObj.list.data) {
						if ($scope.jobMgmtObj.list.data[i]._id == row._id) {
							$scope.jobMgmtObj.list.data.splice(i, 1);
						}
					}
				});
			}

			$rootScope.g.submitDelete = $scope.jobMgmtObj.delete.submit;
		}


		// -------------- Delete Job -------------------
		$scope.jobMgmtObj.clone = {};
		$scope.jobMgmtObj.clone.create = function(cloneData) {
			
			var postData = angular.copy(cloneData);
			delete postData._id;

			icdb.insert('JobsBazaar', postData, function(response) {
				if (response.status) {
					$scope.jobMgmtObj.list.data.push(response.result);

					alertService.flash('success', 'Job has been clone successfully.');
				}
			});
		}

	}
]);