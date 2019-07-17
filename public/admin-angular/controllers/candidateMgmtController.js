appModule.controller('CandidateMgmtController', ['$scope', '$http', '$location', '$uibModal', '$stateParams', '$rootScope', '$timeout', '$state', 'icdb', 'alertService',
    function($scope, $http, $location, $uibModal, $stateParams, $rootScope, $timeout, $state, icdb, alertService) {
		
		$scope.candObj = {};


		// Manage data
		var manageDataRow = function(row) {

			for (var i in $rootScope.globalvarObj.qualification) {
				if ($rootScope.globalvarObj.qualification[i]._id == row.department) {
					row.departmentName = $rootScope.globalvarObj.qualification[i].name;
				}
			}

			for (var i in $rootScope.globalvarObj.cites) {
				if ($rootScope.globalvarObj.cites[i]._id == row.city) {
					row.cityName = $rootScope.globalvarObj.cites[i].city;
				}
			}

			return row;
		}


		// --------- Get job data -------------
		$scope.candObj.list = {};
		$scope.candObj.list.loading = false;
		$scope.candObj.list.data = [];

		$scope.candObj.list.init = function() {
			$scope.candObj.list.loading = true;

			icdb.get('CandidateRegister', function(response) {
				
				if (response && response.length) {
					for (var row in response) {
						response[row] = manageDataRow(response[row]);
					}
				}

				$scope.candObj.list.data = response;

				$timeout(function() {
					$scope.candObj.list.loading = false;
				}, 10);
			});
		}






		// ------------ Filter data ssection --------------------------
		$scope.candObj.fltObj = {};
		$scope.candObj.fltObj.list = {};
		$scope.candObj.fltObj.list.data = [];
		$scope.candObj.fltObj.isLoading = false;
		$scope.candObj.fltObj.model = {};

		$scope.candObj.fltObj.submit = function() {
			$('#filter-candidates-list').modal('show');
			$scope.candObj.fltObj.isLoading = true;

			$http.post('/api/admin/filter-candidates', {
				filter: $scope.candObj.fltObj.model
			}).then(function(response) {

				$scope.candObj.fltObj.list.data = response.data;

				$timeout(function() {
					$scope.candObj.fltObj.isLoading = false;
				}, 10);
			});
		}


		$scope.candObj.fltObj.reset = function() {
			$scope.candObj.fltObj.model = {};
			$scope.candObj.fltObj.isLoading = false;
			$scope.candObj.fltObj.list.data = [];
		}






		// -------------- Update candidates -------------------
		$scope.cdUser = {};
		$scope.cdUser.create = {};
		$scope.cdUser.create.model = {};

		$scope.cdUser.create.openModal = function(dataRow) {
			$scope.cdUser.create.model = angular.copy(dataRow);
			
			if (!isNaN(new Date(dataRow.birthDate))) {
				$scope.cdUser.create.model.birthDate = new Date(dataRow.birthDate);
			} else {
				$scope.cdUser.create.model.birthDate = new Date();
			}

			$('#candidate-register-modal').modal('show');
		}


		$scope.cdUser.create.closeModal = function() {
			$scope.cdUser.create.model = {};
			$scope.cdUser.create.isSubmited = false;
			$scope.cdUser.create.isReqSent = false;
			$('#candidate-register-modal').modal('hide');
		}



		$scope.cdUser.create.isSubmited = false;
		$scope.cdUser.create.isReqSent = false;

		$scope.cdUser.create.submit = function(form) {

			if (!form.$valid) {
				$scope.cdUser.create.isSubmited = true;
				return;
			}

			$scope.cdUser.create.isReqSent = true;

			icdb.update('CandidateRegister', $scope.cdUser.create.model._id, $scope.cdUser.create.model, function(response) {
				$scope.cdUser.create.closeModal();
				alertService.flash('success', 'Job has been updates successfully.');
			});
		}




		// -------------- Delete Job -------------------
		$scope.candObj.delete = {};
		$scope.candObj.delete.openModal = function(dataRow) {
			$('#common-delete-modal').modal('show');

			$scope.candObj.delete.submit = function() {

				icdb.remove('CandidateRegister', dataRow._id, function(result) {

					for (var i in $scope.candObj.list.data) {
						if ($scope.candObj.list.data[i]._id == dataRow._id) {
							$scope.candObj.list.data.splice(i, 1);
						}
					}

					alertService.flash('success', 'Candidate has been deleted successfully');
				});


				icdb.removeWithCondition('TrackUniqueContact', {
					contact: ''+dataRow.mobile
				}, function(result) {});
			}

			$rootScope.g.submitDelete = $scope.candObj.delete.submit;
		}



	}
]);