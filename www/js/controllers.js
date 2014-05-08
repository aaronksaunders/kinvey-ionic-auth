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
    ['$scope', '$kinvey', "$state", function ($scope, $kinvey, $state, UserService) {

        $scope.signIn = function (user) {
            console.log('Sign-In', user);

            UserService.login(user.username, user.password).then(function (response) {
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
    .controller('AccountCtrl',
    ['$scope', '$kinvey', "$state", "AvatarService", function ($scope, $kinvey, $state, AvatarService) {


        AvatarService.get('b613fde4-7e33-4170-a1a3-817b36ef115f').then(function (_r) {
            console.log(_r);
        })

        AvatarService.find().then(function (_r) {
            console.log(_r);
        })

        // flow-file-added="!!{png:1,gif:1,jpg:1,jpeg:1}[$file.getExtension()]"
        // flow-files-submitted="$flow.upload()"

        $scope.$on('flow::fileAdded', function (event, $flow, flowFile) {
            //event.preventDefault();//prevent file from uploading
        });

        $scope.$on('flow::filesSubmitted', function (event, $flow, flowFile) {
            event.preventDefault();//prevent file from uploading

            if (flowFile.length === 0) {
                return;
            }
            /**
             *
             * @param $scope.uploadme  the HTML5 File object to be uploaded
             * @param _callback function to call when completed
             */
            console.log(JSON.stringify(flowFile[0].file));


            AvatarService.upload(flowFile[0]).then(function (_result) {
                console.log("$upload: " + JSON.stringify(_result));
                //file.cancel()
            }, function error(err) {
                console.log('[$upload] received error: ' + JSON.stringify(err));
            });

        });
    }]);
