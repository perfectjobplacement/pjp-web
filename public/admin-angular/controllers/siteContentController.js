appModule.controller('SiteMgmtController', ['$scope', '$http', '$location', '$uibModal', '$stateParams', '$rootScope', '$timeout', '$state', 'icdb', 'alertService',
    function($scope, $http, $location, $uibModal, $stateParams, $rootScope, $timeout, $state, icdb, alertService) {
	

		// -------------- Manage Dashboard -----------------------------
		$scope.stMgmt = {};
		$scope.stMgmt.siteObj = {};



		// -------------------------------------------------
		$scope.stMgmt.siteObj.appsSettings = {};
		$scope.stMgmt.siteObj.appsSettings.model = {};

		$scope.stMgmt.siteObj.appsSettings.init = function() {
			icdb.get('AppConfig', function(result) {
				$scope.stMgmt.siteObj.appsSettings.model = result[result.length-1];
	        });
		}

		$scope.stMgmt.siteObj.appsSettings.submit = function() {

			if (!$scope.stMgmt.siteObj.appsSettings.model._id) {
				icdb.insert('AppConfig', $scope.stMgmt.siteObj.appsSettings.model, function(result) {
					alertService.flash('success', 'AppConfig has been created successfully.');
				});
			} else {
				icdb.update('AppConfig', $scope.stMgmt.siteObj.appsSettings.model._id, $scope.stMgmt.siteObj.appsSettings.model, function(result) {
					alertService.flash('success', 'AppConfig has been updated successfully.');
				});
			}
		}






		// ---------------- Manage team member ----------------
		$scope.stMgmt.siteObj.team = {};
		$scope.stMgmt.siteObj.team.loading = false;
		$scope.stMgmt.siteObj.team.data = [];
		$scope.stMgmt.siteObj.team.model = {};

		$scope.stMgmt.siteObj.team.init = function() {
			$scope.stMgmt.siteObj.team.loading = true;

			icdb.get('OurTeam', function(result) {
				$scope.stMgmt.siteObj.team.data = result;

				$timeout(function() {
					$scope.stMgmt.siteObj.team.loading = false;
				}, 10);
	        });
		}

		$scope.stMgmt.siteObj.team.init();


		$scope.stMgmt.siteObj.team.openModal = function(row) {
			$('#manage-team-membe').modal('show');

			if (row && row._id) {
				$scope.stMgmt.siteObj.team.model = angular.copy(row);
			}
		}

		$scope.stMgmt.siteObj.team.closeModal = function() {
			$scope.stMgmt.siteObj.team.model = {};
			$scope.stMgmt.siteObj.team.isSubmited = false;
			$('#manage-team-membe').modal('hide');
		}

		$scope.stMgmt.siteObj.team.isSubmited = false;
		$scope.stMgmt.siteObj.team.submit = function(form) {

			if (!form.$valid) {
				$scope.stMgmt.siteObj.team.isSubmited = true;
				return;
			}

			if (!$scope.stMgmt.siteObj.team.model._id) {
				icdb.insert('OurTeam', $scope.stMgmt.siteObj.team.model, function(result) {
					$scope.stMgmt.siteObj.team.data.push(result.result);
					$scope.stMgmt.siteObj.team.closeModal();
		            alertService.flash('success', 'Team Member has been created successfully.');
		        });
			}

			if ($scope.stMgmt.siteObj.team.model._id) {
				icdb.update('OurTeam', $scope.stMgmt.siteObj.team.model._id, $scope.stMgmt.siteObj.team.model, function(result) {
					
					for (var row in $scope.stMgmt.siteObj.team.data) {
						if ($scope.stMgmt.siteObj.team.data[row]._id == $scope.stMgmt.siteObj.team.model._id) {
							$scope.stMgmt.siteObj.team.data[row] = angular.copy($scope.stMgmt.siteObj.team.model);
						}
					}

					$scope.stMgmt.siteObj.team.closeModal();
		            alertService.flash('success', 'Team Member has been updated successfully.');
		        });
			}
		}


		// ---------------- Delete section ----------------
		$scope.stMgmt.siteObj.team.delete = {};
		$scope.stMgmt.siteObj.team.delete.openModal = function(dataRow) {

			$('#common-delete-modal').modal('show');

			$scope.stMgmt.siteObj.team.delete.submit = function() {

				icdb.remove('OurTeam', dataRow._id, function(result) {
					for (var row in $scope.stMgmt.siteObj.team.data) {
						if ($scope.stMgmt.siteObj.team.data[row]._id == dataRow._id) {
							$scope.stMgmt.siteObj.team.data.splice(row, 1);
						}
					}
		            alertService.flash('success', 'Team Member has been deleted successfully.');
		        });
		    }

		    $rootScope.g.submitDelete = $scope.stMgmt.siteObj.team.delete.submit;
		}

	}
]);