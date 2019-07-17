appModule.controller('QualificationController', ['$scope', '$http', '$location', '$uibModal', '$stateParams', '$rootScope', '$timeout', '$state', 'icdb', 'alertService',
    function($scope, $http, $location, $uibModal, $stateParams, $rootScope, $timeout, $state, icdb, alertService) {
	

		// -------------- Qualification -----------------------------
		$scope.qlObj = {};


		// ---------------- Init section ----------------
		$scope.qlObj.list = {};
		$scope.qlObj.list.loading = false;
		$scope.qlObj.list.data = [];
		$scope.qlObj.list.count = 0;

		$scope.qlObj.list.init = function() {
			$scope.qlObj.list.loading = true;

			$http.post('api/admin/get-data/with-condition', {
				model: 'Qualifications',
				skip: 0,
				condition: {},
			}).success(function(response) {
				
				if (response.data && response.data.length) {
					for (var row in response.data) {
						$scope.qlObj.list.data.push(response.data[row]);
					}
					$scope.qlObj.list.count = response.count;
				}

				$timeout(function() {
	        		$scope.qlObj.list.loading = false;
	        	}, 10);
			});
		}


		// ---------------- Insert section ----------------
		$scope.qlObj.add = {};
	    $scope.qlObj.add.model = {};
		$scope.qlObj.add.model.qualifyIn = '1';

		$scope.qlObj.add.submit = function() {

			for (var i in $scope.qlObj.list.data) {
				if ($scope.qlObj.list.data[i].name.toLowerCase() === $scope.qlObj.add.model.name.toLowerCase()) {
					alertService.flash('error', 'Duplicate not allowed.');
					return;
				}
			}

			icdb.insert('Qualifications', $scope.qlObj.add.model, function(response) {
				$scope.qlObj.add.model = {};
	            $scope.qlObj.add.model.qualifyIn = '1';
				$scope.qlObj.list.data.push(response.result);
	            alertService.flash('success', 'Qualifiction has been created successfully.');
	        });
		}


		// ---------------- Update section ----------------
		$scope.qlObj.edit = {};
		$scope.qlObj.edit.model = {};

		$scope.qlObj.edit.openModal = function(dataRow) {
			$scope.qlObj.edit.model = angular.copy(dataRow);
			$('#update-qualification').modal('show');
		}


		$scope.qlObj.edit.closeModal = function() {
			$scope.qlObj.edit.model = {};
			$('#update-qualification').modal('hide');
		}


		$scope.qlObj.edit.submit = function() {


			for (var i in $scope.qlObj.list.data) {
				if ($scope.qlObj.list.data[i].name.toLowerCase() === $scope.qlObj.edit.model.name.toLowerCase() && 
					$scope.qlObj.edit.model._id != $scope.qlObj.list.data[i]._id) {
					alertService.flash('error', 'Duplicate not allowed.');
					return;
				}
			}

			icdb.update('Qualifications', $scope.qlObj.edit.model._id, {
	            name: $scope.qlObj.edit.model.name,
	            qualifyIn: $scope.qlObj.edit.model.qualifyIn
	        }, function(result) {
				
				for (var i in $scope.qlObj.list.data) {
					if ($scope.qlObj.list.data[i]._id == $scope.qlObj.edit.model._id) {
						$scope.qlObj.list.data[i].name = $scope.qlObj.edit.model.name;
						$scope.qlObj.list.data[i].qualifyIn = $scope.qlObj.edit.model.qualifyIn;
					}
				}

	            alertService.flash('success', 'Qualifiction has been updated successfully.');
	            $scope.qlObj.edit.closeModal();
	        });
		}


		$scope.qlObj.edit.activeQa = function(row, status) {
			row.status = status;
			icdb.update('Qualifications', row._id, row, function(result) {
				if (status) {
	            	alertService.flash('success', 'Qualifiction has been Activated successfully.');
				} else {
					alertService.flash('success', 'Qualifiction has been Deactivated successfully.');
				}
	        });
		}


		// ---------------- Delete section ----------------
		$scope.qlObj.delete = {};
		$scope.qlObj.delete.openModal = function(dataRow) {

			$('#common-delete-modal').modal('show');

			$scope.qlObj.delete.submit = function() {

				icdb.remove('Qualifications', dataRow._id, function(result) {
					
					for (var i in $scope.qlObj.list.data) {
						if ($scope.qlObj.list.data[i]._id == dataRow._id) {
							$scope.qlObj.list.data.splice(i, 1);
						}
					}

					alertService.flash('success', 'Qualifiction has been deleted successfully.');
				});
			}

			$rootScope.g.submitDelete = $scope.qlObj.delete.submit;
		}

	}
]);