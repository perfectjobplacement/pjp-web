appModule.controller('DashboardController', ['$scope', '$http', '$location', '$uibModal', '$stateParams', '$rootScope', '$timeout', '$state', 'icdb', 'alertService',
    function($scope, $http, $location, $uibModal, $stateParams, $rootScope, $timeout, $state, icdb, alertService) {



		// -------------- Manage Dashboard ---------------
		$scope.dbObj = {};
		$scope.dbObj.comObj = {};	


		$scope.dbObj.comObj.loading = false;

		$scope.dbObj.comObj.initGlobal = function() {
			$scope.dbObj.comObj.loading = true;

			$http.get('/api/admin/get/dashboard-counts').then(function(response) {
				$scope.dbObj.comObj.totalCounts = response.data;

				$timeout(function() {
					$scope.dbObj.comObj.loading = false;
				}, 10);
			});
		}


		// -------------- Create Job -------------------
		$scope.job = {};
		$scope.job.create = {};
		$scope.job.create.model = {};

		$scope.job.create.openModal = function() {
			$scope.job.create.model.jobWorkType = 1;
			$scope.job.create.model.candidateType = 1;
			$scope.job.create.model.salaryType = 1;
			$scope.job.create.model.interviewDateFrom = new Date();
			$scope.job.create.model.interviewDateTo = new Date();
			$scope.job.create.model.requiredDoc = [];
			$scope.job.create.model.department = [];
			$scope.job.create.model.requiredDoc.push($rootScope.g.adminData.requiredDocuments[0]);
			$('#add-new-job').modal('show');
		}

		$scope.job.create.closeModal = function() {
			$scope.job.create.model = {};
			$scope.job.create.isSubmited = false;
			$scope.job.create.isReqSent = false;
			$('#add-new-job').modal('hide');
		}


		$scope.job.create.isSubmited = false;
		$scope.job.create.isReqSent = false;
		$scope.job.create.submit = function(form) {

			if (!form.$valid) {
				$scope.job.create.isSubmited = true;
				return;
			}

			$scope.job.create.isReqSent = true;
			$scope.job.create.model.userId = $rootScope.g.loggedUser._id;

			icdb.insert('JobsBazaar', $scope.job.create.model, function(result) {
				$scope.job.create.closeModal();
	            alertService.flash('success', 'Job has been created successfully.');
	        });
		}




		// -------------- Register User -------------------
		$scope.cdUser = {};
		$scope.cdUser.create = {};
		$scope.cdUser.create.model = {};

		$scope.cdUser.create.openModal = function() {
			$scope.cdUser.create.model.jobWorkType = 1;
			$scope.cdUser.create.model.candidateType = 1;
			$scope.cdUser.create.model.salaryType = 1;
			$scope.cdUser.create.model.gender = 'male';
			$scope.cdUser.create.model.areaOfInterest = [];
			$('#candidate-register-modal').modal('show');
		}


		$scope.cdUser.create.closeModal = function() {
			$scope.cdUser.create.model = {};
			$scope.cdUser.create.isSubmited = false;
			$scope.cdUser.create.isReqSent = false;
			$('#candidate-register-modal').modal('hide');
		}



		$scope.cdUser.create.isSubmited = false;
		$scope.cdUser.create.isReqSent = false;

		$scope.cdUser.create.submit = function(form) {

			if (!form.$valid) {
				$scope.cdUser.create.isSubmited = true;
				return;
			}

			$scope.cdUser.create.isReqSent = true;


	        icdb.insert('CandidateRegister', $scope.cdUser.create.model, function(response) {
				$scope.cdUser.create.closeModal();
	            alertService.flash('success', 'Job has been created successfully.');
	        });
		}


	}
]);