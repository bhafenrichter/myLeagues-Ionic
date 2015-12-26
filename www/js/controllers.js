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
    
    $scope.setName = function(id){
        for(var j = 0; j < $rootScope.standings.length; j++){
            if(id == $rootScope.standings[j].get('UserID')){
                return $rootScope.standings[j].get('ShortName');    
            }
        }
    }
})
   
.controller('leagueStandingsCtrl', function($scope, LeagueService) {       
    
})
      
.controller('addGameCtrl', function($scope) {

})
   
.controller('leagueMemberCtrl', function($scope, $rootScope, LeagueService, $stateParams) { 
    
    LeagueService.getUserInformation($stateParams.userid).then(function(data){
        $scope.user = data;
        console.log(data);
    });
                                              
    //retrieves the userleague from the call already made initially                                                                                       
    for(var i = 0; i < $rootScope.standings.length; i++){
        //console.log($rootScope.standings[i].id);
        //console.log($stateParams.userid);
        if($stateParams.userleagueid == $rootScope.standings[i].id){
            $scope.userleague = $rootScope.standings[i];
            console.log($scope.userleague);
        }
    }                                                                                
                                                                                                    
})

.controller('tabCtrl', function($rootScope, LeagueService){
    //gets the league standings
    LeagueService.getLeagueStandings("ngX2tFbJXt").then(function(data){
        $rootScope.standings = data;
    });
    
    //gets the most recent games in the league
    LeagueService.getRecentGames("ngX2tFbJXt").then(function(data){
        $rootScope.recentGames = data;
    });
    
    LeagueService.getAllUserInformation("ngX2tFbJXt").then(function(data){
        $rootScope.users = data; 
    });
})
 