'use strict';
appModule.controller('AdvertisementController', ['$scope', '$http', '$location', '$uibModal', '$stateParams', '$rootScope', 'alertService', '$timeout', 'icdb',
    function($scope, $http, $location, $uibModal, $stateParams, $rootScope, alertService, $timeout, icdb) {

        $scope.advObj = {};


        var getSupportedFileExtension = function() {
            return ['jpg', 'jpeg', 'png'];
        }



        // Init adv data
        $scope.advObj.list = {};
        $scope.advObj.list.loading = false;

        $scope.advObj.list.init = function() {
            $scope.advObj.list.loading = true;

            icdb.get('advertisement', function(response) {
                $scope.advObj.list.data = response;

                $timeout(function() {
                    $scope.advObj.list.loading = false;
                }, 10);
            });
        };


        $scope.advObj.add = {};
        $scope.advObj.add.openModal = function(data) {
            if (data && data._id) {
               $scope.advObj.add.model = angular.copy(data);
            }

            $('#create-ads-modal').modal('show');
        };

        $scope.advObj.add.closeModal = function() {
            $scope.advObj.add.model = {};
            $('#create-ads-modal').modal('hide');
        };
        
        $scope.advObj.add.removeDzImag = function() {
            $scope.advObj.add.model.image = '';
        };

        $scope.advObj.initdz = function() {
            $timeout(function() {
                angular.element("#adv-dropzone").html('<div class="dropzone" id="adv-dropzone-id"></div>');

                angular.element("#adv-dropzone-id").dropzone({
                    url: '/api/common/file/upload/'+2,
                    maxFilesize: 5, // MB
                    maxFiles: 1,
                    addRemoveLinks: true,
                    dictRemoveFile: 'Remove',
                    uploadMultiple: false,
                    init: function() {
                        this.on("complete", function(file) {
                            if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0) {}
                        });
                    },
                    accept: function(file, done) {

                        $scope.advObj.add.isUplaoding = true;

                        var fileType = file.type;
                        $timeout(function() {
                            if (file.name) {

                                var fileT = file.name.split('.');
                                var IcExtension = fileT[fileT.length - 1];
                                var validFiles = getSupportedFileExtension();

                                if (validFiles.indexOf(IcExtension.toLowerCase()) != -1) {
                                    done();
                                } else {
                                    $scope.advObj.add.isUplaoding = false;
                                    $alert.flash('error', 'Selected file is invalid, Please choose valid file.', true);
                                    return false;
                                }
                            }
                        }, 10);
                    },
                    success: function(data, resData) {
                        console.log(resData);
                        if (resData) {
                            $scope.advObj.add.model.image = resData.image;
                        }

                        $timeout(function() {
                            $scope.advObj.add.isUplaoding = false;
                        }, 500);
                    },
                    removedfile: function(file, data) {
                        var _ref;
                        if (file && file.previewElement && file.previewElement.parentNode) {
                            return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
                        }
                    }
                });
            }, 100);
        };


        $scope.advObj.add.upload = function() {
            var _job_dropzone = angular.element("#adv-dropzone-id");
            if (_job_dropzone && _job_dropzone[0] && _job_dropzone[0].dropzone) {
                _job_dropzone[0].dropzone.removeAllFiles(true);
            }
            
            angular.element("#adv-dropzone-id").click();
        }



        $scope.advObj.add.model = {};
        $scope.advObj.add.isSubmited = false;

        $scope.advObj.add.submit = function(form) {
            if (!form.$valid) {
                $scope.advObj.add.isSubmited = true;
                return;
            }

            $scope.advObj.add.model.expireOn = new Date($scope.advObj.add.model.expireOn).getTime();

            if (!$scope.advObj.add.model._id) {

                icdb.insert('advertisement', $scope.advObj.add.model, function(result) {

                    if (result.status) {
                        $scope.advObj.list.data.push(result.result);
                    }

                    $scope.advObj.add.closeModal();
                    alertService.flash('success', 'Ads has been created successfully.');
                });
            } else{
                icdb.update('advertisement', $scope.advObj.add.model._id, $scope.advObj.add.model, function(result) {
                    $scope.advObj.add.closeModal();
                    alertService.flash('success', 'Ads has been updated successfully.');
                });
            }
        };


        $scope.advObj.delete = {};
        $scope.advObj.add.delete = function(status, dataRow) {
            if (!status) {
                dataRow.isDelete = true;
                return;
            }

            icdb.remove('advertisement', dataRow._id, function(result) {
                    
                for (var i in $scope.advObj.list.data) {
                    if ($scope.advObj.list.data[i]._id == dataRow._id) {
                        $scope.advObj.list.data.splice(i, 1);
                    }
                }

                alertService.flash('success', 'Ads has been deleted successfully.');
            });
        };

    }
]);
