'use strict';
appModule.controller('AccountController', ['$scope', '$http', '$location', '$uibModal', '$stateParams', '$rootScope', 'alertService', '$timeout', 'icdb',
    function($scope, $http, $location, $uibModal, $stateParams, $rootScope, alertService, $timeout, icdb) {

        $scope.accObj = {};


        // -----------------------------------------------
        // Add employees
        // -----------------------------------------------
        $scope.accObj.empObj = {};
        $scope.accObj.empObj.isloading = false;
        $scope.accObj.empObj.data = [];

        $scope.accObj.empObj.init = function() {
        	$scope.accObj.empObj.isloading = true;

        	icdb.get('ourEmployee', function(response) {
                $scope.accObj.empObj.data = response;

                $timeout(function() {
                    $scope.accObj.empObj.isloading = false;
                }, 10);
            });
        }


        $scope.accObj.empObj.add = {};
        $scope.accObj.empObj.add.model = {};
        $scope.accObj.empObj.add.isSubmited = false;

        $scope.accObj.empObj.add.submit = function(form) {
        	if (!form.$valid) {
        		$scope.accObj.empObj.add.isSubmited = true;
        		return;
        	}

        	$scope.accObj.empObj.add.isSubmited = false;
        	$scope.accObj.empObj.add.model.timestamp = new Date().getTime();

        	icdb.insert('ourEmployee', $scope.accObj.empObj.add.model, function(response) {
        		if (response.result) {
                	$scope.accObj.empObj.data.push(response.result);
        		}

        		$scope.accObj.empObj.add.model = {};
            });
        }


        $scope.accObj.empObj.delete = {};
        $scope.accObj.empObj.delete.submit = function(status, row, index) {
        	if (!status) {
        		row.isDelete = true;
        		return;
        	}

        	icdb.remove('ourEmployee', row._id, function(response) {
                $scope.accObj.empObj.data.splice(index, 1);
            });
        }

    }
]);
