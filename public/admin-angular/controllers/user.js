'use strict';
appModule.controller('UserController', ['$scope', '$http', '$location', '$uibModal', '$stateParams', '$rootScope', 'alertService', '$timeout', '$state',
    function($scope, $http, $location, $uibModal, $stateParams, $rootScope, alertService, $timeout, $state) {


        $scope.adObj = {};


        // -----------
        $scope.adObj.stateGo = function(key) {
            $state.go(key);
        }




        // ------------------ Company user signup --------------------
        $scope.adObj.regObj = {};
        $scope.adObj.regObj.add = {};
        $scope.adObj.regObj.add.model = {}


        $scope.adObj.regObj.add.isSubmited = false;
        $scope.adObj.regObj.add.isReqSent = false;
        $scope.adObj.regObj.add.submit = function(form) {

            if (!form.$valid) {
                $scope.adObj.regObj.add.isSubmited = true;
                return;
            }

            $scope.adObj.regObj.add.isReqSent = true;

            $http.post('/api/admin-user/register', $scope.adObj.regObj.add.model).then(function(response) {

                if (response.data && response.data.status) {
                    $scope.adObj.regObj.add.isSubmited = false;
                    $scope.adObj.regObj.add.isReqSent = false;
                    $scope.adObj.regObj.add.model = {}
                    alertService.flash('success', 'You are successfully register.');
                    $state.go('login');
                } else {
                    alertService.flash('error', 'Something is wrong.');
                }
            });
        }






        // --------------- Login ------------------
        $scope.adObj.login = {};
        $scope.adObj.login.isSubmited = false;
        $scope.adObj.login.isReqSent = false;

        $scope.adObj.login.submit = function(form) {

            if (!form.$valid) {
                $scope.adObj.login.isSubmited = true;
                return;
            }

            $scope.adObj.login.isReqSent = true;


            $http.post('/api/admin-user/login', $scope.adObj.login.model).then(function(response) {
                if (response.data && response.data.status) {
                    alertService.flash('success', 'You are successfully loggedin.');
                    $scope.adObj.login.isSubmited = false;
                    $scope.adObj.login.isReqSent = false;
                    $state.go('dashboard');
                } else{
                    $scope.adObj.login.isSubmited = false;
                    $scope.adObj.login.isReqSent = false;
                    alertService.flash('error', 'User not found.');
                }
            });
        }

    }
]);
