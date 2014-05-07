// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'kinvey', 'starter.controllers', 'starter.services', 'flow'])

    .run(['$ionicPlatform', '$kinvey', '$rootScope', '$state', function ($ionicPlatform, $kinvey, $rootScope, $state) {

        console.log($ionicPlatform);

        $ionicPlatform.ready(function () {
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

            // Kinvey initialization starts
            var promise = $kinvey.init({
                appKey: 'kid_VVjSrSQ6c9',
                appSecret: 'fc57b63b3dae4f2e82e1fa20f560981a'
            });
            promise.then(function () {
                // Kinvey initialization finished with success
                console.log("Kinvey init with success");
                determineBehavior($kinvey, $state, $rootScope);

                // setup the stateChange listener
                $rootScope.$on("$stateChangeStart", function (event, toState /*, toParams, fromState, fromParams*/) {
                    if (toState.name !== 'signin') {
                        determineBehavior($kinvey, $state, $rootScope);
                    }
                });

            }, function (errorCallback) {
                // Kinvey initialization finished with error
                console.log("Kinvey init with error: " + JSON.stringify(errorCallback));
                determineBehavior($kinvey, $state, $rootScope);
            });
        });
    }])

    .config(function ($stateProvider, $urlRouterProvider, flowFactoryProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider
            .state('signin', {
                url: "/sign-in",
                templateUrl: "templates/sign-in.html",
                controller: 'SignInCtrl'
            })
            .state('forgotpassword', {
                url: "/forgot-password",
                templateUrl: "templates/forgot-password.html"
            })
            // setup an abstract state for the tabs directive
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html"
            })

            // Each tab has its own nav history stack:

            .state('tab.dash', {
                url: '/dash',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-dash.html',
                        controller: 'DashCtrl'
                    }
                }
            })

            .state('tab.friends', {
                url: '/friends',
                views: {
                    'tab-friends': {
                        templateUrl: 'templates/tab-friends.html',
                        controller: 'FriendsCtrl'
                    }
                }
            })
            .state('tab.friend-detail', {
                url: '/friend/:friendId',
                views: {
                    'tab-friends': {
                        templateUrl: 'templates/friend-detail.html',
                        controller: 'FriendDetailCtrl'
                    }
                }
            })

            .state('tab.account', {
                url: '/account',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/tab-account.html',
                        controller: 'AccountCtrl'
                    }
                }
            })

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise("/sign-in");


        flowFactoryProvider.defaults = {
            testChunks : false,
            singleFile: true
        };
        flowFactoryProvider.on('catchAll', function (event) {
            console.log('catchAll', JSON.stringify(event));
        });
        // Can be used with different implementations of Flow.js
        // flowFactoryProvider.factory = fustyFlowFactory;
    });


//function selects the desired behavior depending on whether the user is logged or not
function determineBehavior($kinvey, $state, $rootScope) {
    var activeUser = $kinvey.getActiveUser();
    console.log("$state: " + $state);
    console.log("activeUser: " + JSON.stringify(activeUser));
    if ((activeUser === null)) {
        $state.go('signin');
    } else if ($state.current.name === 'signin') {
        $state.go('tab.dash');
    }
}

