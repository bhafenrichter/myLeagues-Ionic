// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js



Parse.initialize("9YWjBwWEmHzutMtWwettnLnKtMEbipD25NEiHq2b", "aCueHgf31iF2troFb6ZXhSG1dLoHrLGTm4Pja7cU");



angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives','ngRoute'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})