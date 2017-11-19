var app = angular.module('app', ['ngAnimate', 'ngMaterial', 'ui.router', 'toaster']);

app.config(['$qProvider', '$stateProvider', function ($qProvider, $stateProvider) {
    $qProvider.errorOnUnhandledRejections(false);
	function registerState(name) {
		var path = name.replace(/-/g, '/');
		$stateProvider.state(name, {
			url: '/' + path,
			templateUrl: '/static/apps/admin/modules/' + path + '.html',
		});
	}

	var pages = ['applications', 'users', 'lock',
		'example-dashboard',
		'example-dashboard1',
		'example-calendar',
		'example-widgets',
		'example-forms-general',
		'example-forms-advanced',
		'example-forms-editors',
		'example-mailbox-compose',
		'example-mailbox-mailbox',
		'example-mailbox-read-mail',
		'example-tables-data',
		'example-tables-simple',
		'example-ui-buttons',
		'example-ui-general',
		'example-ui-icons',
		'example-ui-modals',
		'example-ui-sliders',
		'example-ui-timeline',
	];

	$stateProvider.state('default', {
		url: '',
		redirectTo: 'example-dashboard'
	});
	for (var idx in pages) {
		var p = pages[idx];
		registerState(p);
	}
}]);

app.factory('appDialog', [
	'$mdDialog',
	'toaster',
	function ($mdDialog, toaster) {
		var service = {};

		service.info = function (title, msg) {
			toaster.pop({
				type: 'info',
				title: title,
				body: msg,
				timeout: 5000
			});
		};
		service.wait = function (title, msg) {
			var id = 'wait-toastid-' + Math.random();
			toaster.pop({
				type: 'wait',
				title: title,
				body: msg,
				showCloseButton: false,
				toastId: id,
				timeout: 0
			});
			return id;
		};
		service.clearWait = function (wait) {
			toaster.clear(null, wait);
		};
		service.warning = function (title, msg) {
			toaster.pop({
				type: 'warning',
				title: title,
				body: msg,
				timeout: 0
			});
		};
		service.success = function (title, msg) {
			if (!title)
				title = 'Success';
			toaster.pop({
				type: 'success',
				title: title,
				body: msg,
				timeout: 3000
			});
		};
		service.error = function (title, msg) {
			if (!title)
				title = 'Operation Failed';
			toaster.pop({
				type: 'error',
				title: title,
				body: msg,
				timeout: 0
			});
		};

		service.alert = function (title, msg) {
			$mdDialog.alert().clickOutsideToClose(true).title(title)
				.textContent(msg).ok('OK')
		};

		service.confirm = function (title, msg, fnOK, fnCancel) {
			var confirm = $mdDialog.confirm().title(title).textContent(msg)
				.ok('OK').cancel('Cancel');

			$mdDialog.show(confirm).then(function () {
				if (fnOK)
					fnOK();
			}, function () {
				if (fnCancel)
					fnCancel();
			});
		};

		service.confirmDeletion = function (fnOK) {
			service.confirm('Delete?',
				'Are you sure you want to remove this item?', fnOK);
		};

		// TODO: need to test
		service.showWin = function (data, controller, templateUrl, fnOK,
			fnCancel) {
			$mdDialog.show({
				locals: {
					data: data
				},
				controller: controller,
				templateUrl: templateUrl,
				parent: angular.element(document.body),
				clickOutsideToClose: false
			}).then(function (result) {
				if (fnOK)
					fnOK(result);
			}, function () {
				if (fnCancel)
					fnCancel();
			});
		};

		return service;
	}
]);

app.controller('LayoutCtrl', ['$http', '$scope',
    function($http, $scope) {
        // menus
        $scope.menus = [];
        $http.get('/static/apps/admin/mockdata/menus.json').then(function(res) {
            $scope.menus = res.data;
        });

        // search
        $scope.searchOptions = {
            value: '',
            search: function() {
                if ($scope.searchOptions.value) {
                    // TODO
                    alert('TODO: search ' + $scope.searchOptions.value);
                }
            }
        };

        // messages
        $scope.messages = [];
        $http.get('/static/apps/admin/mockdata/messages.json').then(function(res) {
            $scope.messages = res.data;
            $scope.messages1 = angular.copy(res.data);
            for (var idx = 0; idx < $scope.messages1.length; idx++) {
                $scope.messages1[idx].img = null;
            }
            $scope.messages2 = angular.copy(res.data);
            for (var idx = 0; idx < $scope.messages2.length; idx++) {
                $scope.messages2[idx].img = null;
                $scope.messages2[idx].description = null;
            }
        });
        $scope.messageClick = function(item) {
            // TODO
            alert('You have viewed `' + item.title + '`.');
        };
        $scope.messageMoreClick = function() {
            // TODO
            alert('Link to more messages.');
        };

        // lock screen
        $scope.lockScreen = function() {
            $('.lockscreen').show();
            $('body').addClass('no-scroll');
        };

        $scope.unlockScreen = function() {
            $('body').removeClass('no-scroll');
            $('.lockscreen').hide();
        };
    }
]);

angular.element(document).ready(function () {
	angular.bootstrap(document, ['app']);
});


$(function () {
	// fix the actions of AdminLTE in AngularJS
	$('body').on('click', '[data-widget=collapse]', function (event) {
		var iconTag = $(this).find('i');
		if (iconTag.hasClass('fa-minus')) {
			iconTag.removeClass('fa-minus');
			iconTag.addClass('fa-plus');
		} else {
			iconTag.addClass('fa-minus');
			iconTag.removeClass('fa-plus');
		}
		$(this).closest('.box').find('.box-body').slideToggle();
		$(this).closest('.box').find('.box-footer').slideToggle();
		event.preventDefault();
	});
	$('body').on('click', '[data-widget=remove]', function (event) {
		$(this).closest('.box').slideToggle();
		event.preventDefault();
	});
});