'use strict';

appModule.controller('CommonController', ['$scope', '$http', '$location', '$uibModal', '$stateParams', '$rootScope', '$timeout', '$state', 'icdb', 'alertService',
    function($scope, $http, $location, $uibModal, $stateParams, $rootScope, $timeout, $state, icdb, alertService) {

        $scope.comnObj = {};


        if ($(window).width() < 768) {
            if ($('#nav-menu-container').length) {
                $('body').on('click', '#close-sidebar-on-click', function(e) {
                    $('body').toggleClass('mobile-nav-active');
                    $('#mobile-nav-toggle i').toggleClass('lnr-cross lnr-menu');
                    $('#mobile-body-overly').toggle();
                });
            }
        }


        $rootScope.g.manageJobsData = function(jobs, cities) {
            for (var i in jobs) {
                for (var j in cities) {
                    if (jobs[i].jobCity == cities[j]._id) {
                        jobs[i].cityName = cities[j].city;
                    }
                }
            }

            return jobs;
        }


        // -------------- Init Global data --------------------

        $rootScope.g.globalvarObj = {};

        $scope.comnObj.init = function() {

            icdb.get('JobLocations', function(response) {
                $rootScope.g.globalvarObj.cites = response;
            });

            icdb.get('Qualifications', function(response) {
                $rootScope.g.globalvarObj.qualification = response;
            });

            icdb.get('AreaOfInterest', function(response) {
                $rootScope.g.globalvarObj.areaOfInterest = response;
            });
        }

        $scope.comnObj.init();
	}
]);