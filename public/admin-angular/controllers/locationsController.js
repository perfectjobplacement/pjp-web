appModule.controller('LocationController', ['$scope', '$http', '$location', '$uibModal', '$stateParams', '$rootScope', '$timeout', '$state', 'icdb', 'alertService',
    function($scope, $http, $location, $uibModal, $stateParams, $rootScope, $timeout, $state, icdb, alertService) {



		// ---------------------- Job Locations ------------------------------------
		$scope.jl = {};


		// ---------------- Init section ----------------
		$scope.jl.list = {};
		$scope.jl.list.loading = false;
		$scope.jl.list.data = [];

		$scope.jl.list.init = function() {
			$scope.jl.list.loading = true;

			icdb.get('JobLocations', function(result) {
				$scope.jl.list.data = result;

				$timeout(function() {
					$scope.jl.list.loading = false;
				}, 10);
	        });
		}


		// ---------------- Insert section ----------------
		$scope.jl.add = {};
	    $scope.jl.add.model = {};

		$scope.jl.add.submit = function() {

			for (var i in $scope.jl.list.data) {
				if ($scope.jl.list.data[i].city.toLowerCase() === $scope.jl.add.model.city.toLowerCase()) {
					alertService.flash('error', 'Duplicate not allowed.');
					return;
				}
			}

			icdb.insert('JobLocations', $scope.jl.add.model, function(response) {
				$scope.jl.add.model = {};
				$scope.jl.list.data.push(response.result);
	            alertService.flash('success', 'Job Location has been created successfully.');
	        });
		}


		// ---------------- Update section ----------------
		$scope.jl.edit = {};
		$scope.jl.edit.model = {};

		$scope.jl.edit.openModal = function(row) {
			for (var i in $scope.jl.list.data) {
				$scope.jl.list.data[i].isEdit = false;
			}

			row.isEdit = true;
			$scope.jl.edit.model = angular.copy(row);
		}

		$scope.jl.edit.closeModal = function(row) {
			row.isEdit = false;
			$scope.jl.edit.model = {};
		}


		$scope.jl.edit.submit = function(dataRow) {
			
			for (var i in $scope.jl.list.data) {
				if ($scope.jl.list.data[i].city.toLowerCase() === $scope.jl.edit.model.city.toLowerCase() &&
					$scope.jl.edit.model._id != $scope.jl.list.data[i]._id) {
					alertService.flash('error', 'Duplicate not allowed.');
					return;
				}
			}

			icdb.update('JobLocations', dataRow._id, {
	            city: $scope.jl.edit.model.city
	        }, function(response) {
				dataRow.isEdit = false;
					
				for (var i in $scope.jl.list.data) {
					if ($scope.jl.list.data[i]._id == dataRow._id) {
						$scope.jl.list.data[i].city = dataRow.city;
					}
				}

				alertService.flash('success', 'Job Location has been updated successfully.');
			});
		}

		$scope.jl.edit.activeQa = function(row, status) {
			row.status = status;
			icdb.update('JobLocations', row._id, row, function(response) {
				if (status) {
	            	alertService.flash('success', 'Job Location has been Activated successfully.');
				} else {
					alertService.flash('success', 'Job Location has been Deactivated successfully.');
				}
	        });
		}


		// ---------------- Delete section ----------------
		$scope.jl.delete = {};
		$scope.jl.delete.openModal = function(dataRow) {

			$('#common-delete-modal').modal('show');
			
			$scope.jl.delete.submit = function() {

				icdb.remove('JobLocations', dataRow._id, function(result) {
					
					for (var i in $scope.jl.list.data) {
						if ($scope.jl.list.data[i]._id == dataRow._id) {
							$scope.jl.list.data.splice(i, 1);
						}
					}

		            alertService.flash('success', 'Job Location has been deleted successfully.');
		        });
		    }

		    $rootScope.g.submitDelete = $scope.jl.delete.submit;
		}








		// ---------------------- Area of interest ------------------------------------
		$scope.jl.aofintObj = {};

		// ---------------- Init section ----------------
		$scope.jl.aofintObj.list = {};
		$scope.jl.aofintObj.list.loading = false;
		$scope.jl.aofintObj.list.data = [];


		$scope.jl.aofintObj.init = function() {

			$scope.jl.aofintObj.list.loading = true;

			icdb.get('AreaOfInterest', function(result) {
				$scope.jl.aofintObj.list.data = result;

		   		$timeout(function() {
					$scope.jl.aofintObj.list.loading = false;
				}, 10);
	        });
		}

		$scope.jl.aofintObj.init();


		// ---------------- Insert section ----------------
		$scope.jl.aofintObj.add = {};
	    $scope.jl.aofintObj.add.model = {};

		$scope.jl.aofintObj.add.submit = function() {

			for (var i in $scope.jl.aofintObj.list.data) {
				if ($scope.jl.aofintObj.list.data[i].title.toLowerCase() === $scope.jl.aofintObj.add.model.title.toLowerCase() && $scope.jl.aofintObj.list.data[i].department === $scope.jl.aofintObj.add.model.department) {
					alertService.flash('error', 'Duplicate not allowed.');
					return;
				}
			}

			icdb.insert('AreaOfInterest', $scope.jl.aofintObj.add.model, function(response) {
				$scope.jl.aofintObj.add.model = {};				
				$scope.jl.aofintObj.list.data.push(response.result);

	            alertService.flash('success', 'Area Of Interest has been created successfully.');
	        });
		}


		// ---------------- Update section ----------------
		$scope.jl.aofintObj.edit = {};
		$scope.jl.aofintObj.edit.model = {};

		$scope.jl.aofintObj.edit.openModal = function(row) {
			for (var i in $scope.jl.aofintObj.list.data) {
				$scope.jl.aofintObj.list.data[i].isEdit = false;
			}

			row.isEdit = true;
			$scope.jl.aofintObj.edit.model = angular.copy(row);
		}


		$scope.jl.aofintObj.edit.closeModal = function(row) {
			row.isEdit = false;
			$scope.jl.aofintObj.edit.model = {};
		}


		$scope.jl.aofintObj.edit.submit = function(row) {

			for (var i in $scope.jl.aofintObj.list.data) {
				if ($scope.jl.aofintObj.list.data[i]._id != $scope.jl.aofintObj.edit.model._id) {
					if ($scope.jl.aofintObj.list.data[i].title.toLowerCase() === $scope.jl.aofintObj.edit.model.title.toLowerCase() && 
						$scope.jl.aofintObj.list.data[i].department === $scope.jl.aofintObj.edit.model.department) {
						alertService.flash('error', 'Duplicate not allowed.');
						return;
					}
				}
			}


			icdb.update('AreaOfInterest', $scope.jl.aofintObj.edit.model._id, {
	            title: $scope.jl.aofintObj.edit.model.title,
	            department: $scope.jl.aofintObj.edit.model.department
	        }, function(response) {
				row.isEdit = false;

				for (var i in $scope.jl.aofintObj.list.data) {
					if ($scope.jl.aofintObj.list.data[i]._id == $scope.jl.aofintObj.edit.model._id) {
						$scope.jl.aofintObj.list.data[i].city = $scope.jl.aofintObj.edit.model.city;
					}
				}

	            alertService.flash('success', 'Area Of Interest has been updated successfully.');
	        });
		}


		$scope.jl.aofintObj.edit.activeQa = function(row, status) {
			row.status = status;
			icdb.update('AreaOfInterest', row._id, row, function(response) {

				if (status) {
	            	alertService.flash('success', 'Area Of Interest has been Activated successfully.');
				} else {
					alertService.flash('success', 'Area Of Interest has been Deactivated successfully.');
				}
	        });
		}


		// ---------------- Delete section ----------------
		$scope.jl.aofintObj.delete = {};
		$scope.jl.aofintObj.delete.openModal = function(row) {

			$('#common-delete-modal').modal('show');

			$scope.jl.aofintObj.delete.submit = function() {

				icdb.remove('AreaOfInterest', row._id, function(response) {

					for (var i in $scope.jl.aofintObj.list.data) {
						if ($scope.jl.aofintObj.list.data[i]._id == row._id) {
							$scope.jl.aofintObj.list.data.splice(i, 1);
						}
					}

		            alertService.flash('success', 'Area Of Interest has been deleted successfully.');
		        });
		    }

		    $rootScope.g.submitDelete = $scope.jl.aofintObj.delete.submit;
		}



		// ---------------- Track contact section ----------------
		$scope.tcObj = {};
		$scope.tcObj.data = [];
		$scope.tcObj.loading = false;

		$scope.tcObj.init = function(row) {
			$scope.tcObj.loading = true;

			icdb.get('TrackUniqueContact', function(result) {
				$scope.tcObj.data = result;

				$timeout(function() {
					$scope.tcObj.loading = false;
				}, 10);
	        });
		}

		$scope.tcObj.delete = function(row) {
			$('#common-delete-modal').modal('show');

			$scope.tcObj.submitDelete = function() {
				icdb.remove('TrackUniqueContact', row._id, function(response) {
					for (var i in $scope.tcObj.data) {
						if ($scope.tcObj.data[i]._id == row._id) {
							$scope.tcObj.data.splice(i, 1);
						}
					}

		            alertService.flash('success', 'Contact has been deleted successfully.');
		        });
		    }

		    $rootScope.g.submitDelete = $scope.tcObj.submitDelete;
		}


		$scope.tcObj.deleteMultiple = function(row) {
			$('#common-delete-modal').modal('show');

			$scope.tcObj.deleteMulti = function() {
				var removeId = [];

				for (var i in $scope.tcObj.data) {
					if ($scope.tcObj.data[i].isDelete) {
						icdb.remove('TrackUniqueContact', $scope.tcObj.data[i]._id, function(response) {});
					}
				}

	        	alertService.flash('success', 'Contact has been deleted successfully.');
		    }

		    $rootScope.g.submitDelete = $scope.tcObj.deleteMulti;
		}

	}
]);