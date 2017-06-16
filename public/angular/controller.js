var expenseTrackerApp = angular.module('expenseTrackerApp', ['ngRoute', 'ui.bootstrap']);

expenseTrackerApp.factory('UpdateExpense', function () {
    var expense;

    return {
        store: store,
        get: get
    };

    function store(obj) {
        expense = obj;
        console.log("Expense: " + expense);
    }

    function get() {
        return expense;
    }
});

//configure routes
expenseTrackerApp.config(function ($routeProvider) {

    $routeProvider
        // routes for the user validation
        .when('/', {
            templateUrl: 'screens/login.ejs',
            controller: 'loginController'
        })
        .when('/register', {
            templateUrl: 'screens/register.ejs',
            controller: 'registerController'
        })


        // routes for the expense detail page
        .when('/createExpense', {
            templateUrl: 'screens/expenseDetailsForm.ejs',
            controller: 'createExpenseController'
        })

        .when('/expenseProfile', {
            templateUrl: 'screens/expenseProfile.ejs',
            controller: 'expenseProfileController'
        })

        .when('/updateExpense', {
            templateUrl: 'screens/expenseDetailsForm.ejs',
            controller: 'updateExpenseController'
        })

        .when('/report', {
            templateUrl: 'screens/expenseReport.ejs',
            controller: 'reportController'
        })

});

expenseTrackerApp.controller('expenseTrackerController', function ($scope, $window) {
    $scope.logout = function () {
        $window.location.href = '/logout';
    }
});

expenseTrackerApp.controller('loginController', function ($http, $scope, $window, $location) {

    // Disable error messages
    $scope.invalid_login = true;

    // Check if user has selected user type
    $scope.typeChecked = true;
    $scope.enableSubmit = function(){
        $scope.typeChecked = false;
    }

    $scope.disableSubmit = function(){
        $scope.invalid_login = true;
        $scope.typeChecked = true;
    }

    // Validate user
    $scope.login = function () {
        $http({
            method: "POST",
            url: '/login',
            data: {
                email: $scope.email,
                password: $scope.pwd,
                uType: $scope.uType
            }
        }).then(function (result) {
            console.log(result.data);
            if (result.data.statusCode === 200) {
                $location.path("/createExpense")
            } else {
                $scope.typeChecked = true;
                $scope.invalid_login = false;
            }
        });
    }

});

expenseTrackerApp.controller('registerController', function ($http, $scope, $window, $location) {

    // Disable error messages
    $scope.invalid_email = true;
    $scope.invalid_password = true;
    $scope.user_exists = true;

    $scope.reset = function(){
        $scope.invalid_email = true;
        $scope.invalid_password = true;
        $scope.user_exists = true;
    }

    $scope.register = function () {
        var email = $scope.email;
        var pwd = $scope.pwd;
        var repwd = $scope.repwd;

        if (pwd !== repwd) {
            document.getElementById("pwd").value = "";
            document.getElementById("repwd").value = "";
            $scope.invalid_password = false;
        } else if (email == "") {
            document.getElementById("email").value = "";
            $scope.invalid_email = false;
        } else {
            $http({
                method: "POST",
                url: '/register',
                data: {
                    email: email,
                    password: pwd
                }
            }).then(function (result) {
                if (result.data.statusCode === 200) {
                    $location.path("/")
                }
                else {
                    $scope.user_exists = false;
                }
            });
        }
    }
});

expenseTrackerApp.controller('createExpenseController', function ($http, $scope, $window, $location) {

    $scope.userOperation = "Create";

    //date picker
    $scope.date = new Date();
    $scope.format = 'dd-MMMM-yyyy';
    $scope.popup = {
        opened: false
    };
    $scope.open = function () {
        $scope.popup.opened = true;
    };
    $scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(2020, 12, 31),
        minDate: new Date(),
        startingDay: 1
    };

    /* Create Expense */
    $scope.submitOp = function () {
        $http({
            method: "POST",
            url: '/create',
            data: {
                amount: $scope.amount,
                description:  $scope.description,
                date: $scope.date
            }
        }).then(function (result) {
            if (result.data.statusCode === 200) {
                console.log("Expense created");
                $location.path("/expenseProfile")
            }
        });
    }
});

expenseTrackerApp.controller('expenseProfileController', function ($scope, $location, $http, $window, UpdateExpense) {
    $scope.allExpenses = [];

    $scope.retrieveExpenses = function () {
        $http({
            method: "GET",
            url: '/retrieve',
        }).then(function (result) {
            $scope.allExpenses = result.data;
        });
    }


    $scope.update = function (expense) {
        UpdateExpense.store(expense);
        $location.path("/updateExpense")
    }

    $scope.delete = function (id) {
        deleteRecord(id).then(deleteDBRecord);
    }

    function deleteDBRecord(id) {
        return new Promise(function (resolve, reject) {
            $http({
                method: "DELETE",
                url: '/delete/' + id
            }).then(function (result) {
                if (result.data.statusCode === 200) {
                    return resolve();
                }
            });
        })
    }

    function deleteRecord(expenseId) {
        return new Promise(function (resolve, reject) {
            $scope.allExpenses = $scope.allExpenses.filter(function (_expense) {
                return _expense.id != expenseId
            });
            return resolve(expenseId);
        });
    }

});

expenseTrackerApp.controller('updateExpenseController', function ($scope, $http, $location, UpdateExpense) {
    $scope.userOperation = "Update";


    var expense = UpdateExpense.get();
    console.log("Get Expense: " + expense.id + " " + expense.amount + " " + expense.description + " " + expense.date + " " + expense.userEmail);
    $scope.id = expense.id;

    document.getElementById("amount").value = 100;
    document.getElementById("description").value = expense.description;


    //date picker
    $scope.date = new Date(expense.date);
    $scope.format = 'dd-MMMM-yyyy';
    $scope.popup = {
        opened: false
    };
    $scope.open = function () {
        $scope.popup.opened = true;
    };
    $scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(2020, 6, 01),
        minDate: new Date(2010, 6, 01),
        startingDay: 1
    };


    $scope.submitOp = function () {
        $http({
            method: "POST",
            url: '/update',
            data: {
                id: $scope.id,
                amount: document.getElementById("amount").value,
                description: document.getElementById("description").value,
                date: $scope.date,
                userId: 1
            }
        }).then(function (result) {
            if (result.data.statusCode === 200) {
                console.log("Expense created");
                $location.path("/expenseProfile")
            }
        });
    }
});


expenseTrackerApp.controller('reportController', function ($scope, $http, $location) {

    $scope.showReport = true;

    //date picker
    $scope.end_date = new Date();
    // Populate with one week time initially
    $scope.start_date = new Date($scope.end_date.getTime() - (7 * 24 * 60 * 60 * 1000));
    $scope.format = 'dd-MMMM-yyyy';
    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
        opened: false
    };

    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function () {
        $scope.popup2.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(2020, 12, 31),
        minDate: new Date(2010, 6, 1),
        startingDay: 1
    };


    //expense
    $scope.allExpenses = [];
    $scope.totalAmount = 0;


    $scope.viewExpenses = function () {
       $http({
            method: "POST",
            url: '/viewExpenses',
            data: {
                start_date: $scope.start_date,
                end_date: $scope.end_date,
            }
        }).then(function (result) {
            $scope.showReport = false;
            $scope.allExpenses = result.data;
            var sum = 0;

            for (var i = 0; i < result.data.length; i++) {
                sum += result.data[i].amount;
            }
            $scope.totalAmount = sum;
        });
    }
});


