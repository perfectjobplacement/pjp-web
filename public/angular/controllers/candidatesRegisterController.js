'use strict';

appModule.controller('CandidateRegisterController', ['$scope', '$http', '$location', '$rootScope', '$timeout', '$state', 'icdb', 'alertService',
    function($scope, $http, $location, $rootScope, $timeout, $state, icdb, alertService) {

        $scope.newReg = {};
        $scope.newReg.commonData = {};


        $scope.newReg.initAds = function() {
            // if (ENV != 'development') {
            //     $timeout(function() {
            //         (adsbygoogle = window.adsbygoogle || []).push({});
            //     }, 1000);
            // }
        }


        // ---------------------------------------------------------------------
        // Apply for job
        // ---------------------------------------------------------------------

        $scope.newReg.post = {};
        $scope.newReg.post.selectedStep = 1;
        $scope.newReg.post.model = {};
        $scope.newReg.post.model.gender = 'male';
        $scope.newReg.post.model.areaOfInterest = [];



        $scope.newReg.confirm = {};
        $scope.newReg.confirm.model = {};
        $scope.newReg.confirm.isSubmited = false;
        $scope.newReg.confirm.isReqSent = false;

        /**
         *
         */
        $scope.newReg.confirm.submit = function(form) {

            if (!form.$valid) {
                $scope.newReg.confirm.isSubmited = true;
                return;
            }

            $scope.newReg.confirm.isReqSent = true;
            $rootScope.g.infoText = {};


            icdb.getCondition('TrackUniqueContact', {
                contact: $scope.newReg.confirm.model.mobile
            }, function(cResponse) {

                if (cResponse.length) {
                    alertService.flash('success', 'You are already register user, You can apply to any job using this contact.');
                } else {
                    $scope.newReg.post.model.mobile = $scope.newReg.confirm.model.mobile;
                    $scope.newReg.post.selectedStep = 2;
                }

                $scope.newReg.confirm.isReqSent = false;
                $scope.newReg.confirm.isSubmited = false;
            });
        }


       
        $scope.newReg.post.isReqSent = false;
        $scope.newReg.post.isSubmited = false;

        $scope.newReg.post.submit = function(form, status) {
            if (!form.$valid) {
                $scope.newReg.post.isSubmited = true;
                return;
            }

            $scope.newReg.post.isReqSent = true;

            icdb.insert('CandidateRegister', $scope.newReg.post.model, function(response) {
                icdb.insert('TrackUniqueContact', {
                    jobId: '',
                    contact: $scope.newReg.post.model.mobile
                }, function(response1) {
                    $scope.newReg.post.isReqSent = false;
                    alertService.flash('success', 'Congratulations, You are successfully register.');
                    $location.path('/');
                });
            });
        }



	}
]);