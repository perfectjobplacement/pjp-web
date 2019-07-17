appModule.controller('companyUserMgmtController', ['$scope', '$http', '$location', '$uibModal', '$stateParams', '$rootScope', '$timeout', '$state', 'icdb', 'alertService',
    function($scope, $http, $location, $uibModal, $stateParams, $rootScope, $timeout, $state, icdb, alertService) {
		
		
		$scope.cpUserObj = {};


		// --------- Get subscriber data -------------
		$scope.cpUserObj.list = {};
		$scope.cpUserObj.list.loading = false;
		$scope.cpUserObj.list.data = [];

		$scope.cpUserObj.list.init = function() {
			$scope.cpUserObj.list.loading = true;

			icdb.get('OurClients', function(result) {
				$scope.cpUserObj.list.data = result;

				$timeout(function() {
					$scope.cpUserObj.list.loading = false;
				}, 1000);
			});
		}



		$scope.cpUserObj.downloadCSV = function() {
			var pssingObj = {
				model: 'OurClients',
				csvName: 'Company Users'
			};

			$rootScope.g.downloadCSV('/api/v1/download/csv-data', pssingObj);
		}




		// --------- Remove company user -------------
		$scope.cpUserObj.list.delete = {};
		
		$scope.cpUserObj.list.delete.openModal = function(dataRow) {

			$('#common-delete-modal').modal('show');
			
			$scope.cpUserObj.list.delete.submit = function() {

				icdb.remove('OurClients', dataRow._id, function(result) {
					
					for (var i in $scope.cpUserObj.list.data) {
						if ($scope.cpUserObj.list.data[i]._id == dataRow._id) {
							$scope.cpUserObj.list.data.splice(i, 1);
						}
					}

					alertService.flash('Success', 'User has been deleted successfully');
				});
			}

			$rootScope.g.submitDelete = $scope.cpUserObj.list.delete.submit;
		}


		// --------- Remove company user -------------
		$scope.cpUserObj.list.edit = {};
		$scope.cpUserObj.list.edit.isSubmited = false;
		$scope.cpUserObj.list.edit.isReqSent = false;
		$scope.cpUserObj.list.edit.model = {};
		
		$scope.cpUserObj.list.edit.openModal = function(dataRow) {

			$scope.cpUserObj.list.edit.model = angular.copy(dataRow);
			$('#update-cp-user').modal('show');


			$scope.cpUserObj.list.edit.submit = function(form) {
				if (!form.$valid) {
					$scope.cpUserObj.list.edit.isSubmited = true;
					return;
				}

				$scope.cpUserObj.list.edit.isReqSent = true;

				icdb.update('OurClients', dataRow._id, $scope.cpUserObj.list.edit.model, function(result) {
					alertService.flash('success', 'User has been successfully updated.');
					$scope.cpUserObj.list.edit.closeModal();
				});
			}
		}

		$scope.cpUserObj.list.edit.closeModal = function() {
			$('#update-cp-user').modal('hide');
			$scope.cpUserObj.list.edit.isSubmited = false;
			$scope.cpUserObj.list.edit.isReqSent = false;
			$scope.cpUserObj.list.edit.model = {};
		}

	}
]);