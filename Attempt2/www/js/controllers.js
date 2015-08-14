angular.module('starter.controllers', ['nfcFilters'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
            $scope.loginData = {};
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('MainController', function ($scope, nfcService, balanceTracker) {
            /*$scope.currs = [
                {name: 'Euro'},
                {name: 'Pound'}
            ];*/
    $scope.balance = function(curr){
        return balanceTracker.getBalance(curr);
    };
    $scope.tag = nfcService.tag;
    $scope.clear = function() {
        nfcService.clearTag();
    };
})

.factory('nfcService', function ($rootScope, $ionicPlatform, balanceTracker) {
         var tag = {};
         $ionicPlatform.ready(function() {
            nfc.addNdefListener(function (nfcEvent) {
                console.log(JSON.stringify(nfcEvent.tag, null, 4));
                $rootScope.$apply(function(){
                    angular.copy(nfcEvent.tag, tag);
                    // if necessary $state.go('some-route')
                });
            }, function () {
                console.log("Listening for NDEF Tags.");
            }, function (reason) {
                alert("Error adding NFC Listener " + reason);
            });
         })
         return {
            tag: tag,
            clearTag: function () {
                angular.copy({}, this.tag);
            }
         }
})

.service('balanceTracker', function () {
         var balance = { Euro: 305,
                         Pound: 537,
                         Dollar: 1189};
         var check = { isSet: false };
         return {
            setBalance: function(value, curr) {
                //balance.Total--;
                //document.write(balance[curr]+' down, ');
                balance[curr] = value;
            },
            getBalance: function (curr) {
                //balance.Total--;
                //document.write(balance[curr] + ' up, ');
                return balance[curr];
            },
            setCheck: function(bool) {
                //balance.Total--;
                //document.write(check.isSet + ' down, ');
                check.isSet = bool;
            },
            wasChecked: function () {
                //balance.Total--;
                //document.write(check.isSet + ' up, ');
                return check.isSet;
            }
         };
})

.controller('BrowseCtrl', function($scope, balanceTracker) {
            $scope.theBalance = function(curr){
                return balanceTracker.getBalance(curr);
            }
            var addBalance = function(amount, curr){
                balanceTracker.setBalance(amount+balance, curr);
                return balance;
            }
})

.controller('PlaylistsCtrl', function($scope) {
  /*$scope.playlists = [
    { title: 'Euro', id: 0 },
    { title: 'Pound', id: 1 },
    { title: 'Dollar', id: 2 },
    ];*/
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
