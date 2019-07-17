'use strict';

angular.module('adminModule').config(function(toastrConfig) {
    angular.extend(toastrConfig, {
        autoDismiss: false,
        containerId: 'toast-container',
        maxOpened: 0,
        newestOnTop: true,
        positionClass: 'toast-top-right',
        preventDuplicates: false,
        preventOpenDuplicates: false,
        target: 'body'
    });
});


angular.element(document).ready(function() {
    if (window.location.hash === '#_=_') window.location.hash = '#!';
    angular.bootstrap(document, ['adminModule']);

    setTimeout(function() {
        $("#front-spinner-bx").hide();
        $(".body-main-cn").show();
    }, 500);
});
