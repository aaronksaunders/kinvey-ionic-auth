angular.module('starter.controllers', [])

    .controller('DashCtrl',
    ['$scope', '$kinvey', "$state", function ($scope, $kinvey, $state) {
        $scope.logout = function () {
            console.log("logout");

            //Kinvey logout starts
            var promise = $kinvey.User.logout();
            promise.then(
                function () {
                    //Kinvey logout finished with success
                    console.log("user logout");
                    $kinvey.setActiveUser(null);
                    $state.go('signin');
                },
                function (error) {
                    //Kinvey logout finished with error
                    alert("Error logout: " + JSON.stringify(error));
                });
        }
    }])

    .controller('FriendsCtrl', function ($scope, Friends) {
        $scope.friends = Friends.all();
    })

    .controller('FriendDetailCtrl', function ($scope, $stateParams, Friends) {
        $scope.friend = Friends.get($stateParams.friendId);
    })
    .controller('SignInCtrl',
    ['$scope', '$kinvey', "$state", function ($scope, $kinvey, $state) {

        $scope.signIn = function (user) {
            console.log('Sign-In', user);

            //Kinvey login starts
            var promise = $kinvey.User.login({
                username: user.username,
                password: user.password
            });
            promise.then(
                function (response) {
                    //Kinvey login finished with success
                    $scope.submittedError = false;
                    $state.go('tab.dash');
                },
                function (error) {
                    //Kinvey login finished with error
                    $scope.submittedError = true;
                    $scope.errorDescription = error.description;
                    console.log("Error login " + error.description);//
                }
            );
            //$state.go('tab.dash');
        };

    }])
    .controller('AccountCtrl', function ($scope) {
    });
