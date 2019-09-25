'use strict';

appModule.controller('AboutusController', ['$scope', '$http', '$location', '$uibModal', '$stateParams', '$rootScope', '$timeout', '$state', 'icdb', 'alertService',
    function($scope, $http, $location, $uibModal, $stateParams, $rootScope, $timeout, $state, icdb, alertService) {

    	$scope.absObj = {};


        // -------------------------------------------------
        $scope.absObj.team = {};
        $scope.absObj.team.teamMember = [];

        $scope.absObj.team.init = function() {
            icdb.get('OurTeam', function(response) {
                $scope.absObj.team.teamMember = response;
            });
        }


        $scope.absObj.initads = function() {
            $timeout(function() {
                (adsbygoogle = window.adsbygoogle || []).push({});
            }, 1000);
        }

        $scope.absObj.initads1 = function() {
            $timeout(function() {
                (adsbygoogle = window.adsbygoogle || []).push({});
            }, 1000);
        }

        $scope.absObj.initads2 = function() {
            $timeout(function() {
                (adsbygoogle = window.adsbygoogle || []).push({});
            }, 1000);
        }
	}
]);