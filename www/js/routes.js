angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
      
        
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'
    })
        
      
    
      
        
    .state('createAccount', {
      url: '/createAccount',
      templateUrl: 'templates/createAccount.html',
      controller: 'createAccountCtrl'
    })
        
      
    
      
    .state('yourLeagues', {
      url: '/leagueList',
      abstract:true,
      templateUrl: 'templates/yourLeagues.html'
    })
      
    
      
        
    .state('tabsController.leagueHome', {
      url: '/leagueHome',
      views: {
        'tab1': {
          templateUrl: 'templates/leagueHome.html',
          controller: 'leagueHomeCtrl'
        }
      }
    })
        
      
    
      
        
    .state('tabsController.recentGames', {
      url: '/recentGames',
      views: {
        'tab2': {
          templateUrl: 'templates/recentGames.html',
          controller: 'recentGamesCtrl'
        }
      }
    })
        
      
    
      
        
    .state('tabsController.leagueStandings', {
      url: '/leagueStandings',
      views: {
        'tab3': {
          templateUrl: 'templates/leagueStandings.html',
          controller: 'leagueStandingsCtrl'
        }
      }
    })
        
      
    
      
    .state('tabsController', {
      url: '/tabs',
      abstract:true,
      templateUrl: 'templates/tabsController.html'
    })
      
    
      
        
    .state('addGame', {
      url: '/addGame',
      templateUrl: 'templates/addGame.html',
      controller: 'addGameCtrl'
    })
        
      
    
      
        
    .state('leagueMember', {
      url: '/leagueMember',
      templateUrl: 'templates/leagueMember.html',
      controller: 'leagueMemberCtrl'
    })
        
      
    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});