'use strict';

var myApp = angular.module('myApp', ['ngRoute', 'pascalprecht.translate', 'ghiscoding.validation']);

myApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/validate-Directive', { templateUrl: 'Directive.html', controller: 'CtrlValidationDirective' })
      .when('/validate-Service', { templateUrl: 'Service.html', controller: 'CtrlValidationService' })
      .otherwise({ redirectTo: 'validate-Directive'  });
  }])
  .config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(false);
  }])
	.config(['$translateProvider', function ($translateProvider) {
	  $translateProvider.useStaticFilesLoader({
	    prefix: '../locales/validation/',
	    suffix: '.json'
		});

  	// load English ('en') table on startup
		$translateProvider.preferredLanguage('en');
	}])

// -- Main page Controller
// ---------------------------------------------------
myApp.controller('Ctrl', ['$location', '$route', '$scope', '$translate', function ($location, $route, $scope, $translate) {
  // change the translation language & reload the page to make sure all errors were rendered properly
  $scope.switchLanguage = function (key) {
    $translate.use(key).then(function() {
      $route.reload();
    });
  };
  $scope.goto = function ( path ) {
    $location.path( path );
  };
}]);


// -- Controller to use Angular-Validation with Directive
// -------------------------------------------------------
myApp.controller('CtrlValidationDirective', ['$scope', '$translate', 'validationService', function ($scope, $translate, validationService) {
    $scope.$validationOptions = { debounce: 50 }; // set the debounce globally with very small time for faster Protactor sendKeys()

    $scope.switchLanguage = function (key) {
      $translate.use(key);
    };

    var validatorDataset = loadData();
    $scope.validations = explodeAndFlattenValidatorArray(validatorDataset);

    $scope.submitForm = function() {
      if(new validationService().checkFormValidity($scope.form01)) {
        alert('All good, proceed with submit...');
      }
    }
    $scope.showValidationSummary = function () {
      $scope.displayValidationSummary = true;
    }
  }]);

// -- Controller to use Angular-Validation with Service
// -------------------------------------------------------
myApp.controller('CtrlValidationService', ['$scope', '$translate', 'validationService', function ($scope, $translate, validationService) {
    var validatorDataset = loadData();
    $scope.validations = explodeAndFlattenValidatorArray(validatorDataset);

    // start by creating the service
    var myValidation = new validationService();
    myValidation.setGlobalOptions({ debounce: 50, scope: $scope })

    for(var i = 0, ln = $scope.validations.length; i < ln; i++) {
      myValidation.addValidator({
        elmName: 'input' + i,
        rules: 'required|' + ($scope.validations[i].validation === 'required' ? '' : $scope.validations[i].validation)
      });
    }

    $scope.switchLanguage = function (key) {
      $translate.use(key);
    };

    $scope.submitForm = function() {
      if(new validationService().checkFormValidity($scope.form01)) {
        alert('All good, proceed with submit...');
      }
    }
    $scope.showValidationSummary = function () {
      $scope.displayValidationSummary = true;
    }
  }]);

// -- Private functions available to all controllers
// --------------------------------------------------

// explode the validators data, a validator might have aliases and if that is the case then exploded them into multiple validators
function explodeAndFlattenValidatorArray(data) {
  var tempArray = [];
  var obj = {};

  for(var i=0, ln = data.length; i < ln; i++) {
    obj = { validation: data[i].validator + (typeof data[i].params !== "undefined" ? ':' + data[i].params : '') };
    tempArray.push(obj);
    if(typeof data[i].aliases !== "undefined") {
      for(var j = 0, jln = data[i].aliases.length; j < jln; j++) {
        var validator = data[i].validator;
        if(!!data[i].params) {
          validator += data[i].params;
        }
        obj = { validation: data[i].aliases[j] + (typeof data[i].params !== "undefined" ? ':' + data[i].params : '') };
        tempArray.push(obj);
      }
    }
  }

  return tempArray;
}

// load dataset of all possible validators
function loadData() {
  return [
    {
      'validator': 'alpha'
    },
    {
      'validator': 'alphaSpaces',
      'aliases': ['alpha_spaces']
    },
    {
      'validator': 'alphaNum',
      'aliases': ['alpha_num']
    },
    {
      'validator': 'alphaNumSpaces',
      'aliases': ['alpha_num_spaces']
    },
    {
      'validator': 'alphaDash',
      'aliases': ['alpha_dash']
    },
    {
      'validator': 'alphaDashSpaces',
      'aliases': ['alpha_dash_spaces']
    },
    {
      'validator': 'betweenLen',
      'aliases': ['between_len'],
      'params': '1,5'
    },
    {
      'validator': 'betweenNum',
      'aliases': ['between_num'],
      'params': '5,15'
    },
    {
      'validator': 'boolean'
    },
    {
      'validator': 'creditCard',
      'aliases': ['credit_card']
    },
    {
      'validator': 'dateEuroLong',
      'aliases': ['date_euro_long']
    },
    {
      'validator': 'dateEuroLongBetween',
      'aliases': ['date_euro_long_between', 'betweenDateEuroLong', 'between_date_euro_long'],
      'params': '01-01-2001,28-02-2001'
    },
    {
      'validator': 'dateEuroLongMax',
      'aliases': ['date_euro_long_max', 'maxDateEuroLong', 'max_date_euro_long'],
      'params': '30-05-2012'
    },
    {
      'validator': 'dateEuroLongMin',
      'aliases': ['date_euro_long_min', 'minDateEuroLong', 'min_date_euro_long'],
      'params': '25-05-2012'
    },
    {
      'validator': 'dateEuroShort',
      'aliases': ['date_euro_short'],
      'params': '25-05-12'
    },
    {
      'validator': 'dateEuroShortBetween',
      'aliases': ['date_euro_short_between', 'betweenDateEuroShort', 'between_date_euro_short'],
      'params': '25-05-12,04-06-12'
    },
    {
      'validator': 'dateEuroShortMax',
      'aliases': ['date_euro_short_max', 'maxDateEuroShort', 'max_date_euro_short'],
      'params': '04-06-12'
    },
    {
      'validator': 'dateEuroShortMin',
      'aliases': ['date_euro_short_min', 'minDateEuroShort', 'min_date_euro_short'],
      'params': '04-06-12'
    },
    {
      'validator': 'dateIso',
      'aliases': ['date_iso']
    },
    {
      'validator': 'dateIsoBetween',
      'aliases': ['date_iso_between', 'betweenDateIso', 'between_date_iso'],
      'params': '2012-05-25,2012-06-04'
    },
    {
      'validator': 'dateIsoMax',
      'aliases': ['date_iso_max', 'maxDateIso', 'max_date_iso'],
      'params': '2012-05-25'
    },
    {
      'validator': 'dateIsoMin',
      'aliases': ['date_iso_min', 'minDateIso', 'min_date_iso'],
      'params': '2012-05-25'
    },
    {
      'validator': 'dateUsLong',
      'aliases': ['date_us_long']
    },
    {
      'validator': 'dateUsLongBetween',
      'aliases': ['date_us_long_between', 'betweenDateUsLong', 'between_date_us_long'],
      'params': '01/01/1990,12/31/2015'
    },
    {
      'validator': 'dateUsLongMax',
      'aliases': ['date_us_long_max', 'maxDateUsLong', 'max_date_us_long'],
      'params': '01/01/1990'
    },
    {
      'validator': 'dateUsLongMin',
      'aliases': ['date_us_long_min', 'minDateUsLong', 'min_date_us_long'],
      'params': '01/01/1990'
    },
    {
      'validator': 'dateUsShort',
      'aliases': ['date_us_short']
    },
    {
      'validator': 'dateUsShortBetween',
      'aliases': ['date_us_short_between', 'betweenDateUsShort', 'between_date_us_short'],
      'params': '01/01/90,12/31/15'
    },
    {
      'validator': 'dateUsShortMax',
      'aliases': ['date_us_short_max', 'maxDateUsShort', 'max_date_us_short'],
      'params': '01/01/90'
    },
    {
      'validator': 'dateUsShortMin',
      'aliases': ['date_us_short_min', 'minDateUsShort', 'min_date_us_short'],
      'params': '01/01/90'
    },
    {
      'validator': 'email'
    },
    {
      'validator': 'exactLen',
      'aliases': ['exact_len'],
      'params': '11'
    },
    {
      'validator': 'float'
    },
    {
      'validator': 'floatSigned',
      'aliases': ['float_signed']
    },
    {
      'validator': 'iban'
    },
    {
      'validator': 'int',
      'aliases': ['integer']
    },
    {
      'validator': 'intSigned',
      'aliases': ['integerSigned', 'int_signed', 'integer_signed']
    },
    {
      'validator': 'ipv4'
    },
    {
      'validator': 'ipv6'
    },
    {
      'validator': 'maxLen',
      'aliases': ['max_len'],
      'params': '11'
    },
    {
      'validator': 'maxNum',
      'aliases': ['max_num'],
      'params': '99'
    },
    {
      'validator': 'minLen',
      'aliases': ['min_len'],
      'params': '3'
    },
    {
      'validator': 'minNum',
      'aliases': ['min_num'],
      'params': '1'
    },
    {
      'validator': 'numeric'
    },
    {
      'validator': 'numericSigned',
      'aliases': ['numeric_signed']
    },
    {
      'validator': 'required'
    },
    {
      'validator': 'url'
    },
    {
      'validator': 'time'
    }
  ];
}