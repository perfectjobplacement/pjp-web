'use strict';

appModule.controller('AdminController', ['$scope', '$http', '$location', '$uibModal', '$stateParams', '$rootScope', '$timeout', '$state', 'icdb', 'alertService',
    function($scope, $http, $location, $uibModal, $stateParams, $rootScope, $timeout, $state, icdb, alertService) {

        $scope.adminObj = {};
        $rootScope.adobj = {};
    	$rootScope.adobj.comObj = {};
        $rootScope.g.isSiteAdmin = true;


        // -------------- Manage Sidebar -------------------
        $scope.adminObj.sidebarObj = {};
        $scope.adminObj.sidebarObj.isActive = 1;

        $scope.adminObj.sidebarObj.getActive = function(key) {
            $scope.adminObj.sidebarObj.isActive = key;
        }
    


        //
        extendsDashboardData($scope, $http, $location, $uibModal, $stateParams, $rootScope, $timeout, $state, icdb, alertService);
        extendsQualificationData($scope, $http, $location, $uibModal, $stateParams, $rootScope, $timeout, $state, icdb, alertService);
        extendsMangeLocationData($scope, $http, $location, $uibModal, $stateParams, $rootScope, $timeout, $state, icdb, alertService);
        extendsMangeSiteData($scope, $http, $location, $uibModal, $stateParams, $rootScope, $timeout, $state, icdb, alertService);
	}
]);