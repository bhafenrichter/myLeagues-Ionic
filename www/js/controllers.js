angular.module('app.controllers', [])
  
.controller('loginCtrl', function($scope, $state, AccountService) {
    $scope.username = "bhafenri";
    $scope.password = "password";
    $scope.login = function(username,password){
        AccountService.login(username,password).then(function(data){
            if(data.id != ""){
                $state.go("tabsController.leagueHome");   
            }
        });
    };
})
   
.controller('createAccountCtrl', function($scope, AccountService, $q) {
    $scope.createAccount = function(username,password,email){
        AccountService.createAccount(username,password, email).then(function(data){
            if(data.id != ""){
                $state.go("tabsController.leagueHome");   
            }                                                               
        });
    }
})
      
.controller('leagueHomeCtrl', function($scope) {

})
   
.controller('recentGamesCtrl', function($scope, $rootScope, LeagueService) {
    
    $scope.getUser = function(id){
        for(var j = 0; j < $rootScope.standings.length; j++){
            if(id == $rootScope.standings[j].id){
                return $rootScope.standings[j];    
            }
        }
    }
})
   
.controller('leagueStandingsCtrl', function($scope, LeagueService) {       
    
})
      
.controller('addGameCtrl', function($scope) {

})
   
.controller('leagueMemberCtrl', function($scope, $rootScope, LeagueService, $stateParams) { 
                                              
    //retrieves the userleague from the call already made initially                                                                                       
    for(var i = 0; i < $rootScope.standings.length; i++){
        //console.log($rootScope.standings[i].id);
        //console.log($stateParams.userid);
        if($stateParams.userleagueid == $rootScope.standings[i].id){
            $scope.userleague = $rootScope.standings[i];
        }
        if($stateParams.userid == $rootScope.users[i].id){
            $scope.user = $rootScope.users[i];
        }
    }
    
    //get the recent games of that specific user
    LeagueService.getRecentGamesForUser($stateParams.userleagueid).then(function(data){
        $scope.recentUserGames = data;
    });
    
    $scope.formatAverage = function(str){
        return str.substring(0,3);
    }
    
    $scope.getUser = function(id){
        for(var j = 0; j < $rootScope.standings.length; j++){
            if(id == $rootScope.standings[j].id){
                return $rootScope.standings[j];    
            }
        }
    }                                                                                              
})

.controller('tabCtrl', function($rootScope, LeagueService){
    //gets the league standings
    LeagueService.getLeagueStandings("ngX2tFbJXt").then(function(data){
        $rootScope.standings = data;
    }).then(function(){
        //retrieves the deeper user information with the userleague ids
        var ids = new Array($rootScope.standings.length);
        for(var i = 0; i < $rootScope.standings.length; i++){
            ids[i] = $rootScope.standings[i].get("UserID");
        }
        //makes the call to the database
        LeagueService.getAllUserInformation(ids).then(function(data){
            $rootScope.users = data;
        });
    });
    
    //gets the most recent games in the league
    LeagueService.getRecentGames("ngX2tFbJXt").then(function(data){
        $rootScope.recentGames = data;
        
    });
    
    
})
 