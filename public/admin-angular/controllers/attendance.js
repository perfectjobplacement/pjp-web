'use strict';
appModule.controller('AttendanceController', ['$scope', '$http', '$location', '$uibModal', '$stateParams', '$rootScope', 'alertService', '$timeout', 'icdb',
    function($scope, $http, $location, $uibModal, $stateParams, $rootScope, alertService, $timeout, icdb) {

        $scope.atdObj = {};


        // Init adv data
        $scope.atdObj.list = {};
        $scope.atdObj.list.loading = false;

        $scope.atdObj.list.init = function() {
            $scope.atdObj.list.loading = true;

            icdb.get('ourEmployee', function(response) {
                $scope.atdObj.list.data = response;
                    $timeout(function() {
                    $scope.atdObj.list.loading = false;
                }, 10);
            });
        };


        // ----------------------------
        // Manage ui
        // ----------------------------
        var now = new Date();

        function getDaysArray(year, month) {
            var numDaysInMonth, daysInWeek, daysIndex, index, i, l, daysArray;

            numDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            daysInWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            daysIndex = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
            index = daysIndex[(new Date(year, month - 1, 1)).toString().split(' ')[0]];
            daysArray = [];

            for (i = 0, l = numDaysInMonth[month - 1]; i < l; i++) {
                daysArray.push({
                    day: (i + 1),
                    dayname: daysInWeek[index++],
                });
                if (index == 7) index = 0;
            }

            return daysArray;
        }
        

        // ---------------------------------------
        // Get days and display
        // ---------------------------------------

        $scope.atdObj.cal = {};
        $scope.atdObj.cal.model = {};
        $scope.atdObj.cal.today = now.getDate();

        $scope.atdObj.cal.data = getDaysArray(now.getFullYear(), now.getMonth() + 1);


    }
]);
