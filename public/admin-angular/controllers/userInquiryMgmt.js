appModule.controller('userInquiryMgmtController', ['$scope', '$http', '$location', '$uibModal', '$stateParams', '$rootScope', '$timeout', '$state', 'icdb', 'alertService',
    function($scope, $http, $location, $uibModal, $stateParams, $rootScope, $timeout, $state, icdb, alertService) {
		
		
		$scope.userInqObj = {};


		// --------- Get subscriber data -------------
		$scope.userInqObj.list = {};
		$scope.userInqObj.list.loading = false;
		$scope.userInqObj.list.data = [];

		$scope.userInqObj.list.init = function() {
			$scope.userInqObj.list.loading = true;

			icdb.get('Inquiry', function(result) {
				$scope.userInqObj.list.data = result;

				$timeout(function() {
					$scope.userInqObj.list.loading = false;
				}, 1000);
			});
		}




		// --------- Remove subscriber -------------
		$scope.userInqObj.list.delete = {};
		$scope.userInqObj.list.delete.openModal = function(dataRow) {

			$('#common-delete-modal').modal('show');
			
			$scope.userInqObj.list.delete.submit = function() {

				icdb.remove('Inquiry', dataRow._id, function(result) {
					
					for (var i in $scope.userInqObj.list.data) {
						if ($scope.userInqObj.list.data[i]._id == dataRow._id) {
							$scope.userInqObj.list.data.splice(i, 1);
						}
					}

					alertService.flash('Success', 'Inquiry has been deleted successfully');
				});
			}

			$rootScope.g.submitDelete = $scope.userInqObj.list.delete.submit;
		}





		// ------------------ Done -----------------------
		$scope.userInqObj.isRead = {};

		$scope.userInqObj.isRead.submit = function(dataRow, status) {

			var _status = !dataRow.isRead;

			icdb.update('Inquiry', dataRow._id, { isRead: _status }, function(result) {
				alertService.flash('Success', 'Done, Mark as read');
				dataRow.isRead = _status;
			});
		}

	}
]);