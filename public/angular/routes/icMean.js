'use strict';

var checkUserIsLoggedOrNot = function($q, $timeout, $http, $location, $rootScope, $state, status) {

    var deferred = $q.defer();

    $http.get('/users/me').success(function(user) {

        if (user && user._id) {
            $rootScope.g.loggedUser = user;
            $timeout(deferred.resolve);
        } else {
            $state.go('home');
        }
    }).error(function() {
        $timeout(deferred.resolve);
    });

    return deferred.promise;
}


var justCheckLogin = function($q, $timeout, $http, $location, $rootScope, $state, status) {

    $http.get('/users/me').success(function(user) {

        if (user && user._id) {
            $rootScope.g.loggedUser = user;
        }
    });
}



var checkLoggedIn = function($q, $timeout, $http, $location, $rootScope, $state) {
    return checkUserIsLoggedOrNot($q, $timeout, $http, $location, $rootScope, $state, true);
};


var checkLoggedOut = function($q, $timeout, $http, $location, $rootScope, $state) {
    return checkUserIsLoggedOrNot($q, $timeout, $http, $location, $rootScope, $state, false);
};

var _justCheckLogin = function($q, $timeout, $http, $location, $rootScope, $state) {
    return justCheckLogin($q, $timeout, $http, $location, $rootScope, $state, false);
};





var appModule = angular.module('tm', ['ngRoute', 'ngCookies', 'ngResource', 'ui.bootstrap', 'ui.router', 'toastr', 'ngAnimate']);

appModule.run(function($rootScope, $timeout, $location, icdb, $http, alertService) {

    $rootScope.g = {};
    $rootScope.g.adminData = {};
    $rootScope.g.adminData = globalObj;
    $rootScope.g.infoText = {};


    $rootScope.$on( "$stateChangeSuccess", function(event, next, current) {
        $("html, body").animate({ scrollTop: 0 }, "slow");
    });

    $rootScope.g.getActiveClass = function(key) {
        if ($location.path() == key) {
            return 'active';
        }
    }
    


    // Send resume via email
    $rootScope.g.postResume = {};
    $rootScope.g.postResume.isSubmited = false;
    $rootScope.g.postResume.model = {};
    $rootScope.g.postResume.openModal = function() {
        $rootScope.g.postResume.model = {};
        angular.element("input[type='file']").val(null);
        $('#upload-resume').modal('show');
        
        $rootScope.g.postResume.submit = function(form) {
            if (!form.$valid) {
                $rootScope.g.postResume.isSubmited = true;
                return;
            }

            if (!$rootScope.g.postResume.model.resume) {
                return;
            }


            $http.post('/api/v1/post/resume',  $rootScope.g.postResume.model).success(function(response) {
                $('#upload-resume').modal('hide');
                alertService.flash('success', 'Your resume has been sent successfully.');
            });
        }
    }


    $rootScope.g.siteContent = {};
    $rootScope.g.siteContent.init = function() {
        icdb.get('AppConfig', function(response) {
            $rootScope.g.siteContent.data = {};
            $rootScope.g.siteContent.data = response[0];
        });
    }

    $rootScope.g.siteContent.init();
});


appModule.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);

appModule.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});




appModule.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {

        $locationProvider.html5Mode({
            enabled: false,
            requireBase: true
        }).hashPrefix('!');


        $stateProvider.state('login', {
            url: '/login',
            templateUrl: '/angular/views/users/login.html',
            resolve: {
                loggedin: _justCheckLogin
            }
        });

        $stateProvider.state('signup', {
            url: '/signup',
            templateUrl: '/angular/views/users/signup.html',
            resolve: {
                loggedin: _justCheckLogin
            }
        });

        $stateProvider.state('forgot-password', {
            url: '/forgot-password',
            templateUrl: '/angular/views/users/forgot-password.html',
            resolve: {
                loggedin: _justCheckLogin
            }
        });

        $stateProvider.state('home', {
            url: '/home',
            templateUrl: '/angular/views/index.html',
            resolve: {
                loggedin: _justCheckLogin
            }
        });

        $stateProvider.state('aboutus', {
            url: '/aboutus',
            templateUrl: '/angular/views/about-us.html',
            resolve: {
                loggedin: _justCheckLogin
            }
        });

        $stateProvider.state('category', {
            url: '/category/:key/:categoryId',
            templateUrl: '/angular/views/job-search.html',
            resolve: {
                loggedin: _justCheckLogin
            }
        });

        $stateProvider.state('contact', {
            url: '/contact',
            templateUrl: '/angular/views/contact.html',
            resolve: {
                loggedin: _justCheckLogin
            }
        });

        $stateProvider.state('user-dashboard', {
            url: '/user-dashboard',
            templateUrl: '/angular/views/users/user-dashboard.html',
            resolve: {
                loggedin: checkLoggedIn
            }
        });


        $stateProvider.state('user-register', {
            url: '/user-register',
            templateUrl: '/angular/views/candidate-register.html'
        });


        $urlRouterProvider.otherwise('/home');
    }
]);
