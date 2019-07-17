'use strict';

appModule.controller('HomeController', ['$scope', '$http', '$location', '$uibModal', '$stateParams', '$rootScope', '$timeout', '$state', 'icdb', 'alertService',
    function($scope, $http, $location, $uibModal, $stateParams, $rootScope, $timeout, $state, icdb, alertService) {

        $scope.homeObj = {};
    	$scope.homeObj.cobj = {};


        $scope.homeObj.cobj.category = [{
            'id': '1',
            'name': 'Industrial',
            'iconClass': 'fa fa-industry',
        },{
            'id': '2',
            'name': 'Computer',
            'iconClass': 'fa fa-laptop',
        },{
            'id': '3',
            'name': 'Account',
            'iconClass': 'fa fa-briefcase',
        },{
            'id': '4',
            'name': 'Sales & Marketing',
            'iconClass': 'fa fa-handshake-o',
        },{
            'id': '5',
            'name': 'Back Office',
            'iconClass': 'fa fa-building-o',
        },{
            'id': '6',
            'name': 'Others',
            'iconClass': 'fa fa-question-circle-o',
        }];




        // ------------------- Common Section ------------------------

        $scope.homeObj.cobj.commingSoon = function() {
            $('#comming-soon').modal('show');
        }


        $scope.homeObj.cobj.gotoLocation = function(key, id) {
            $location.path('category/'+key+'/'+ id);
        }

        $scope.homeObj.advObj = {};
        $scope.homeObj.cobj.getAdvertisement = function() {
            icdb.getCondition('advertisement', {
                isActive: true,
            }, function(advResponse) {
                $scope.homeObj.advObj = advResponse[0];
            });
        }

        $scope.homeObj.cobj.getAdvertisement();

        

        //
        $scope.homeObj.cobj.filter = {
            isActive: 3
        };

        //
        $scope.homeObj.cobj.getFilterData = function(key) {

            if (key == 3) {
                $scope.homeObj.cobj.filter = {
                    isActive: 3
                };
                return;
            }

            $scope.homeObj.cobj.filter = {
                isActive: key,
                filterObj: {
                    jobWorkType: key
                }
            };
        }











        // ---------------------------------------------------------------------
        // Init jobs by category
        // ---------------------------------------------------------------------



        $scope.homeObj.jobjByFilter = {};
        $scope.homeObj.jobjByFilter.list = {};
        
        $scope.homeObj.jobjByFilter.list.isLoading = false;
        $scope.homeObj.jobjByFilter.skip = 0;
        $scope.homeObj.jobjByFilter.data = [];
        var skip = 0;

        $scope.homeObj.jobjByFilter.init = function() {
            $scope.homeObj.jobjByFilter.list.isLoading = true;
            getLocation();

            var condition = {};

            if ($state.params.key == 1) {
                condition.jobCategory = $state.params.categoryId;
            }

            if ($state.params.key == 2) {
                condition.jobCity = $state.params.categoryId;
            }


            $http.post('/api/site/get-jobsby-filter', {
                condition: condition,
                skip: skip
            }).success(function(response) {
                skip = skip + 20;
                $scope.homeObj.jobjByFilter.data = response.result;
                $scope.homeObj.jobjByFilter.totalJobs = response.count;

                $scope.homeObj.jobjByFilter.data = $rootScope.g.manageJobsData($scope.homeObj.jobjByFilter.data, $scope.homeObj.jobObj.list.jobsByLocation);
                
                $timeout(function() {
                    $scope.homeObj.jobjByFilter.list.isLoading = false;
                }, 200);
            });
        }











        // ---------------------------------------------------------------------
        // Get jobs
        // ---------------------------------------------------------------------


        $scope.homeObj.jobObj = {};
        $scope.homeObj.jobObj.list = {};
        
        $scope.homeObj.jobObj.list.isLoading = false;
        $scope.homeObj.jobObj.list.isLoadMore = false;
        $scope.homeObj.jobObj.list.data = [];
        $scope.homeObj.jobObj.list.totalJobs = 0;
        $scope.homeObj.jobObj.list.jobsByLocation = [];

        var getLocation = function() {
            $http.get('/api/v1/app/jobs-by-location').success(function(response) {
                $scope.homeObj.jobObj.list.jobsByLocation = response;
            });
        }

        $scope.homeObj.jobObj.init = function(status) {
            if (status) {
                $scope.homeObj.jobObj.list.isLoadMore = true;
            } else{
                $scope.homeObj.jobObj.list.isLoading = true;
            }

            getLocation();


            $http.post('/api/site/get-jobs', {
                skip: $scope.homeObj.jobObj.list.data.length
            }).success(function(response) {

                if (response.result && response.result.length) {
                    for (var r in response.result) {
                        $scope.homeObj.jobObj.list.data.push(response.result[r]);
                    }
                }

                $scope.homeObj.jobObj.list.totalJobs = response.count;
                $scope.homeObj.jobObj.list.data = $rootScope.g.manageJobsData(
                    $scope.homeObj.jobObj.list.data,
                    $scope.homeObj.jobObj.list.jobsByLocation
                );
                
                $timeout(function() {
                    $scope.homeObj.jobObj.list.isLoading = false;
                    $scope.homeObj.jobObj.list.isLoadMore = false;
                }, 200);
            });
        }



        



        



        // ---------------------------------------------------------------------
        // Get jobs preview
        // ---------------------------------------------------------------------


        $scope.homeObj.jobObj.preview = {};
        $scope.homeObj.jobObj.preview.data = {};


        $scope.homeObj.jobObj.preview.open = function(row) {
            $scope.homeObj.jobObj.preview.data = angular.copy(row);
            $('#job-preview').modal('show');

            if (!row.totalView) {
                row.totalView = 0;
            }

            row.totalView += 1;

            icdb.update('JobsBazaar', row._id, row, function(result) {});
        }


        $scope.homeObj.jobObj.preview.close = function(row) {
            $scope.homeObj.jobObj.preview.data = {};
            $('#job-preview').modal('hide');
        }












        // ---------------------------------------------------------------------
        // Apply for job
        // ---------------------------------------------------------------------

        $scope.homeObj.jobObj.applyjob = {};
        $scope.homeObj.jobObj.applyjob.model = {};


        $scope.homeObj.jobObj.applyjob.openModal = function(jobRow) {
            $scope.homeObj.jobObj.applyjob.model.jobId = jobRow._id;
            $scope.homeObj.jobObj.applyjob.model.areaOfInterest = [];
            $scope.homeObj.jobObj.applyjob.model.gender = 'male';

            $('#confirm-contact').modal('show');
        }

        $scope.homeObj.jobObj.applyjob.fromDetail = function(jobRow) {
            $('#job-preview').modal('hide');

            $timeout(function() {
                $scope.homeObj.jobObj.applyjob.openModal(angular.copy(jobRow));
            }, 1000);
        }

        $scope.homeObj.jobObj.applyjob.closeModal = function() {
            $scope.homeObj.jobObj.applyjob.model = {};
            $scope.homeObj.jobObj.applyjob.isSubmited = false;
            $scope.homeObj.jobObj.applyjob.isReqSent = false;
            $scope.homeObj.contactObj.isSubmited = false;
            $scope.homeObj.contactObj.isReqSent = false;

            $('#apply-for-job').modal('hide');
            $('#confirm-contact').modal('hide');
        }



        $scope.homeObj.contactObj = {};
        $scope.homeObj.contactObj.model = {};
        $scope.homeObj.contactObj.isSubmited = false;
        $scope.homeObj.contactObj.isReqSent = false;

        $scope.homeObj.contactObj.submit = function(form) {

            if (!form.$valid) {
                $scope.homeObj.contactObj.isSubmited = true;
                return;
            }

            $scope.homeObj.contactObj.isReqSent = true;

            $http.post('api/v1/app/check-contact/unique',{
                jobId: $scope.homeObj.jobObj.applyjob.model.jobId,
                contact: $scope.homeObj.jobObj.applyjob.model.mobile,
            }).success(function(response) {

                if (response.status == 1) {
                    alertService.flash('success', response.message);
                    $scope.homeObj.jobObj.applyjob.closeModal();
                }

                if (response.status == 2) {
                    alertService.flash('error', response.message);
                    $scope.homeObj.jobObj.applyjob.closeModal();
                }

                if (response.status == 3) {
                    $('#confirm-contact').modal('hide');

                    $timeout(function() {
                        $('#apply-for-job').modal('show');
                    }, 500);
                }
            });
        }



        $scope.homeObj.jobObj.applyjob.isSubmited = false;
        $scope.homeObj.jobObj.applyjob.isReqSent = false;

        $scope.homeObj.jobObj.applyjob.submit = function(form, status) {

            if (!status) {
                if (!form.$valid) {
                    $scope.homeObj.jobObj.applyjob.isSubmited = true;
                    return;
                }
            }

            $scope.homeObj.jobObj.applyjob.isReqSent = true;


            icdb.insert('CandidateRegister', $scope.homeObj.jobObj.applyjob.model, function(response1) {
                icdb.insert('TrackUniqueContact', {
                    jobId: $scope.homeObj.jobObj.applyjob.model.jobId,
                    contact: $scope.homeObj.jobObj.applyjob.model.mobile,
                }, function(response1) {});

                alertService.flash('success', 'Congratulations, You are successfully apply for job.');
                $scope.homeObj.jobObj.applyjob.closeModal();
            });
        }


	}
]);