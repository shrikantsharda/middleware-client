'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.min.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
        'public/lib/nvd3/build/nv.d3.min.css'
      ],
      js: [
        'public/lib/angular/angular.min.js',
        'public/lib/angular-resource/angular-resource.min.js',
        'public/lib/angular-animate/angular-animate.min.js',
        'public/lib/angular-messages/angular-messages.min.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        'public/lib/angular-ui-utils/ui-utils.min.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'public/lib/angular-file-upload/angular-file-upload.min.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/angular-cookies/angular-cookies.min.js',
        'public/lib/d3/d3.min.js',
        'public/lib/nvd3/build/nv.d3.min.js',
        'public/lib/angular-nvd3/dist/angular-nvd3.min.js',
        'public/lib/chart.js/dist/Chart.min.js',
        'public/lib/angular-chart.js/dist/angular-chart.min.js',
        'public/lib/ngmap/build/scripts/ng-map.min.js',
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyCVNedWYN-bpnM0ewNxWGIiEV9k6zjwzTM'
      ]
    },
    css: 'public/dist/application.min.css',
    js: 'public/dist/application.min.js'
  }
};
