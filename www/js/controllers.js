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
      
.controller('leagueHomeCtrl', function($scope, LeagueService, $ionicModal, $rootScope) {
    $ionicModal.fromTemplateUrl('templates/addGame.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.mainModal = modal
    })  

    $scope.openModal = function(isChooseUser) {
        if(!isChooseUser){
            $scope.mainModal.show();
        }else{
            
        }
        
    }

    $scope.closeModal = function(isChooseUser) {
        if(!isChooseUser){
            $scope.mainModal.hide();
        }else{
            
        }
        setTimeout($scope.resetModal, 500);
    };

    $scope.$on('$destroy', function(isChooseUser) {
        if(!isChooseUser){
            $scope.mainModal.remove();
        }else{
            
        }
        
    });
    
    //add game logic
    $scope.headlineTransition = function(){
        var main = angular.element(document.getElementById("score"));
        main.css("display","none");
        var headline = angular.element(document.getElementById("headline"));
        headline.css("display","");
        var mainButton = angular.element(document.getElementById("mainButton"));
        mainButton.css("display","none");
        var headlineButton = angular.element(document.getElementById("headlineButton"));
        headlineButton.css("display","");
    };
    
    $scope.userPickTransition = function(){
        var main = angular.element(document.getElementById("score"));
        main.css("display","none");
        var mainButton = angular.element(document.getElementById("mainButton"));
        mainButton.css("display","none");
        var userPick = angular.element(document.getElementById("userPick"));
        userPick.css("display","");
        
    };
    $scope.resetModal = function(){
        //show first modal
        var main = angular.element(document.getElementById("score"));
        main.css("display","");
        var mainButton = angular.element(document.getElementById("mainButton"));
        mainButton.css("display","");
        
        //hide headline modal
        var headline = angular.element(document.getElementById("headline"));
        headline.css("display","none");
        var headlineButton = angular.element(document.getElementById("headlineButton"));
        headlineButton.css("display","none");
        
        //hide user pick modal
        var userPick = angular.element(document.getElementById("userPick"));
        userPick.css("display","none");
        
        console.log("Reset Modal");
    };
    
    $scope.searchUsers = function(searchText){
        LeagueService.searchUserLeagues(searchText, "ngX2tFbJXt").then(function(data){
            $scope.searchedUsers = data;   
            $scope.$apply();
        });
    };
    
    $scope.selectedUser = function(user){
        $scope.opponent = user;
        $scope.resetModal();
        console.table($scope.opponent);
    }

    $scope.submitGame = function(){
        LeagueService.addGame($scope.user, 
                             $scope.opponent,
                             $scope.game.userScore,
                             $scope.game.opponentScore,
                             $scope.game.headlineText,
                             "ngX2tFbJXt",
                             null,
                             null);         
    }
    $scope.opponent = LeagueService.generateEmptyUser();
    $scope.game = {};
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
   
.controller('leagueStandingsCtrl', function($scope, LeagueService, $ionicModal, $rootScope) {       
    $ionicModal.fromTemplateUrl('contact-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal
    })  

    $scope.openModal = function() {
        $scope.modal.show()
    }

    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
    
    $scope.searchUsers = function(searchText){
        LeagueService.searchUsers(searchText).then(function(data){
            $scope.searchedUsers = data;   
            $scope.$apply();
        });
    };
    
    $scope.addUserToLeague = function(id, leagueid, user){
        console.log(id);
        LeagueService.isUserInLeague(id, leagueid).then(function(data){  
            console.log(data);
            if(data == "1"){
                //add the user to the league because he doesn't exist
                alert("User is already in this league.");
            }else{
                //don't add the user, he's already in the database
                LeagueService.addUserToLeague(id,leagueid,user).then(function(data){
                    alert("User has been successfully added.");
                });
            }
        });
    };
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
    LeagueService.getRecentGamesForUser($stateParams.userleagueid, true).then(function(data){
        $scope.recentUserGames = data;
        $scope.$apply();
    });
    
    $scope.formatAverage = function(str){
        return str;
    }
    
    $scope.getUser = function(id){
        for(var j = 0; j < $rootScope.standings.length; j++){
            if(id == $rootScope.standings[j].id){
                return $rootScope.standings[j];    
            }
        }
    }; 
    
    $scope.printOpponent = function(game){
        if(game.get("userID") == $stateParams.userleagueid){
            return $scope.getUser(game.get("opponentID")).get("ShortName");
        }else{
            return $scope.getUser(game.get("userID")).get("ShortName");
        }
    };
})

.controller('leagueScheduleCtrl', function($scope, LeagueService, $stateParams, $rootScope){
    //gets all of the games 
    LeagueService.getRecentGamesForUser($stateParams.userleagueid, false).then(function(data){
        $scope.scheduledGames = data;
        $scope.$apply();
    });
    
    $scope.getUser = function(id){
        for(var j = 0; j < $rootScope.standings.length; j++){
            if(id == $rootScope.standings[j].id){
                return $rootScope.standings[j];    
            }
        }
    }; 
})

.controller('leagueGameCtrl', function($scope, LeagueService, $stateParams, $rootScope){
    $scope.getUser = function(id){
        for(var j = 0; j < $rootScope.standings.length; j++){
            if(id == $rootScope.standings[j].id){
                return $rootScope.standings[j];    
            }
        }
    }; 
    
    LeagueService.getGame($stateParams.gameid).then(function(data){
        $scope.game = data; 
        $scope.user = $scope.getUser(data.get("userID"));
        $scope.opponent = $scope.getUser(data.get("opponentID"));
        $scope.$apply();
    });
})

.controller('tabCtrl', function($rootScope, LeagueService){
    //gets league information
    LeagueService.getLeagueInformation("ngX2tFbJXt").then(function(data){
        $rootScope.league = data;
    });
    
    $rootScope.leagueid = "ngX2tFbJXt";
    
    //gets the league standings
    LeagueService.getLeagueStandings("ngX2tFbJXt").then(function(data){
        $rootScope.standings = data;
        console.table(data[0].toJSON());
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
    
    LeagueService.getUserLeagueInformation("ha6b6pW4tu").then(function(data){
        $rootScope.user = data;
        console.log(data);
    });
})
 