'use strict';

appModule.controller('ContactController', ['$scope', '$http', '$location', '$stateParams', '$rootScope', '$timeout', '$state', 'icdb', 'alertService',
    function($scope, $http, $location, $stateParams, $rootScope, $timeout, $state, icdb, alertService) {

    	$scope.conObj = {};
        $scope.conObj.init = {};


        $scope.conObj.initAds = function() {
            // if (ENV != 'development') {
            //     $timeout(function() {
            //         (adsbygoogle = window.adsbygoogle || []).push({});
            //     }, 1000);
            // }
        }


        // -------------- Post Inquirey -------------------
        $scope.conObj.inqObj = {};
        $scope.conObj.inqObj.model = {};
        $scope.conObj.inqObj.isSubmited = false;
        $scope.conObj.inqObj.isReqSent = false;
        $scope.conObj.inqObj.palceHolder = 'Enter your name';
        $scope.conObj.inqObj.inquireyFor = 1;

        $scope.conObj.inqObj.submit = function(form) {
            if (!form.$valid) {
                $scope.conObj.inqObj.isSubmited = true;
                return;
            }

            $scope.conObj.inqObj.isReqSent = true;
            
            icdb.insert('Inquiry', $scope.conObj.inqObj.model, function(result) {
                $scope.conObj.inqObj.model = {};
                $scope.conObj.inqObj.isSubmited = false;
                $scope.conObj.inqObj.isReqSent = false;
                $('#thankyou-contact').modal('show');
            });
        }
	}
]);