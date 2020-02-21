'use strict';

appModule.controller('AboutusController', ['$scope', '$http', '$location', '$stateParams', '$rootScope', '$timeout', '$state', 'icdb', 'alertService',
    function($scope, $http, $location, $stateParams, $rootScope, $timeout, $state, icdb, alertService) {

    	$scope.absObj = {};


        // -------------------------------------------------
        $scope.absObj.team = {};
        $scope.absObj.team.teamMember = [];

        $scope.absObj.team.init = function() {
            if (ENV != 'development') {
                icdb.get('OurTeam', function(response) {
                    $scope.absObj.team.teamMember = response;
                });
            }
        }


        $scope.absObj.initads = function() {
            if (ENV != 'development') {
                $timeout(function() {
                    (adsbygoogle = window.adsbygoogle || []).push({});
                }, 1000);
            }
        }

        $scope.absObj.initads1 = function() {
            if (ENV != 'development') {
                $timeout(function() {
                    (adsbygoogle = window.adsbygoogle || []).push({});
                }, 1000);
            }
        }

        $scope.absObj.initads2 = function() {
            if (ENV != 'development') {
                $timeout(function() {
                    (adsbygoogle = window.adsbygoogle || []).push({});
                }, 1000);
            }
        }
	}
]);