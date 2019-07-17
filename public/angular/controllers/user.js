'use strict';
appModule.controller('UserController', ['$scope', '$http', '$location', '$uibModal', '$stateParams', '$rootScope', 'alertService', '$timeout', '$state',
    function($scope, $http, $location, $uibModal, $stateParams, $rootScope, alertService, $timeout, $state) {


        $scope.uObj = {};



        // ------------------ Company user signup --------------------
        $scope.uObj.cuObj = {};
        $scope.uObj.cuObj.add = {};
        $scope.uObj.cuObj.add.model = {}


        $scope.uObj.cuObj.add.isSubmited = false;
        $scope.uObj.cuObj.add.isReqSent = false;
        $scope.uObj.cuObj.add.submit = function(form) {

            if (!form.$valid) {
                $scope.uObj.cuObj.add.isSubmited = true;
                return;
            }


            $scope.uObj.cuObj.add.isReqSent = true;

            $http.post('/api/user/register', $scope.uObj.cuObj.add.model).then(function(response) {

                if (response.data && response.data.status) {

                    if (response.data.userExist) {
                        $scope.uObj.cuObj.add.isSubmited = false;
                        $scope.uObj.cuObj.add.isReqSent = false;

                        alertService.flash('error', 'User already exist.');
                        return;
                    }

                    $scope.uObj.cuObj.add.isSubmited = false;
                    $scope.uObj.cuObj.add.isReqSent = false;
                    $scope.uObj.cuObj.add.model = {}
                    alertService.flash('success', 'You are successfully register.');
                    $state.go('login');
                } else {
                    alertService.flash('error', 'Something is wrong.');
                }
            });
        }






        // --------------- Login ------------------
        $scope.uObj.cuObj.login = {};
        $scope.uObj.cuObj.login.isSubmited = false;
        $scope.uObj.cuObj.login.isReqSent = false;

        $scope.uObj.cuObj.login.submit = function(form) {

            if (!form.$valid) {
                $scope.uObj.cuObj.login.isSubmited = true;
                return;
            }

            $scope.uObj.cuObj.login.isReqSent = true;


            $http.post('/api/user/login', $scope.uObj.cuObj.login.model).then(function(response) {
                if (response.data && response.data.status) {
                    alertService.flash('success', 'You are successfully loggedin.');
                    $scope.uObj.cuObj.login.isSubmited = false;
                    $scope.uObj.cuObj.login.isReqSent = false;
                    $state.go('user-dashboard');
                } else{
                    $scope.uObj.cuObj.login.isSubmited = false;
                    $scope.uObj.cuObj.login.isReqSent = false;
                    alertService.flash('error', 'User not found.');
                }
            });
        }






        // --------------- Forgot Password ------------------
        $scope.uObj.cuObj.fpass = {};
        $scope.uObj.cuObj.fpass.isSubmited = false;
        $scope.uObj.cuObj.fpass.isReqSent = false;

        $scope.uObj.cuObj.fpass.submit = function(form) {

            if (!form.$valid) {
                $scope.uObj.cuObj.fpass.isSubmited = true;
                return;
            }

            $scope.uObj.cuObj.fpass.isReqSent = true;

            $http.post('/api/user/forgot-pass', {
                email: $scope.uObj.cuObj.fpass.model.email
            }).then(function(response) {
                if (response.data.status == 1) {
                    alertService.flash('error', 'Something is wrong.');
                }
                if (response.data.status == 2) {
                    alertService.flash('success', 'Check your email for new Password.');
                }
                if (response.data.status == 3) {
                    alertService.flash('error', 'Email address not associated with any account.');
                }
            });
        }

    }
]);
