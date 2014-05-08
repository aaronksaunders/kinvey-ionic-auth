angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
    .factory('Friends', function () {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var friends = [
            { id: 0, name: 'Scruff McGruff' },
            { id: 1, name: 'G.I. Joe' },
            { id: 2, name: 'Miss Frizzle' },
            { id: 3, name: 'Ash Ketchum' }
        ];

        return {
            all: function () {
                return friends;
            },
            get: function (friendId) {
                // Simple index lookup
                return friends[friendId];
            }
        }
    })
    .factory('Avatar', function () {

        /**
         * Constructor, with class name
         */
        function Avatar(file) {
            // Public properties, assigned to the instance ('this')
            this.name = file._filename;
            this.id = file._id;
            this.size = file.size;
            this.mimeType = file.mimeType;
            this.data = file._data;
            this.url = file._downloadURL;
        }

        /**
         * Public method, assigned to prototype
         */
        Avatar.prototype.getName = function () {
            return this.name;
        };

        Avatar.prototype.getSize = function () {
            return this.size;
        };

        Avatar.prototype.getType = function () {
            return this.mimeType;
        };

        Avatar.prototype.getURL = function () {
            return "";
        };


        /**
         * Static method, assigned to class
         * Instance ('this') is not available in static context
         */
        Avatar.build = function (data) {
            return new Avatar(data);
        };

        /**
         * Return the constructor function
         */
        return Avatar;
    })
    .factory('User', function (Avatar) {

        /**
         * Constructor, with class name
         */
        function User(_data, avatar) {
            // Public properties, assigned to the instance ('this')
            this.firstName = _data.firstName;
            this.lastName = _data.lastName;
            this.username = _data.username;
            this.id = _data._id;
            this.avatar = avatar;
        }

        /**
         * Public method, assigned to prototype
         */
        User.prototype.getFullName = function () {
            return this.firstName + ' ' + this.lastName;
        };

        User.prototype.getAvatar = function () {
            return this.avatar;
        };


        /**
         * Static method, assigned to class
         * Instance ('this') is not available in static context
         */
        User.build = function (data) {
            return new User( data,
                Avatar.build(data.avatar || {}) // another model
            );
        };

        /**
         * Return the constructor function
         */
        return User;
    })
    .factory('UserService', function ($kinvey, User) {
        var currentUser = null;

        return {
            /**
             *
             * @returns {*}
             */
            activeUser: function () {
                if (currentUser === null) {
                    currentUser = User.build($kinvey.getActiveUser());
                }
                return currentUser;
            },
            /**
             *
             * @param {String} _username
             * @param {String} _password
             * @returns {*}
             */
            login: function (_username, _password) {
                //Kinvey login starts
                var promise = $kinvey.User.login({
                    username: _username,
                    password: _password
                });

                promise.then(function (response) {
                    return User.build(response);
                }, function (error) {
                    //Kinvey login finished with error
                    console.log("Error login " + error.description);
                });

                return promise;
            }
        };

    })
    .factory('AvatarService', function ($kinvey, Avatar) {
        return {
            /**
             *
             * @returns {*}
             */
            find: function () {
                var query = new $kinvey.Query();
                var promise = $kinvey.File.find(query).then(function (_data) {
                    console.log("find: " + JSON.stringify(_data));
                    return _data
                        .map(Avatar.build)
                        .filter(Boolean);
                }, function error(err) {
                    console.log('[find] received error: ' + JSON.stringify(err));
                });

                return promise;
            },
            /**
             *
             * @param {String} _id
             * @returns {*}
             */
            remove: function (_id) {
                return $kinvey.File.destroy(_id);
            },
            /**
             *
             * @param {String} _id
             * @returns {*}
             */
            get: function (_id) {
                // create the kinvey file object
                var promise = $kinvey.File.download(_id).then(function (_data) {
                    console.log("download: " + JSON.stringify(_data));
                    return Avatar.build(_data);
                }, function error(err) {
                    console.log('[download] received error: ' + JSON.stringify(err));
                });

                return promise;
            },
            /**
             *
             * @param {File} _file
             * @returns {*}
             */
            upload: function (_file) {
                var promise = $kinvey.File.upload(_file.file, {
                    _filename: _file.file.name,
                    public: true,
                    size: _file.file.size,
                    mimeType: _file.file.type
                }).then(function (_data) {
                    console.log("$upload: " + JSON.stringify(_data));
                    return Avatar.build(_data);
                }, function error(err) {
                    console.log('[$upload] received error: ' + JSON.stringify(err));
                });

                return promise;
            }
        };
    });
