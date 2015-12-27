angular.module('app.services', [])

.factory('AccountService', [function($q, $location){
    var factory = {};
    
    factory.login = function(username, password){
        return Parse.User.logIn(username, password,{
            success: function(user){
                return "true";
            },
            error: function(user, error){
                alert("Invalid Login, please try again.");
                console.log(error);
            }
        });
    };
    
    factory.createAccount = function(username,password, email){
        var user = new Parse.User();
        console.log(password);
        user.set("username", username);
        user.set("password", password);
        user.set("email",email);
        
        return user.signUp(null, {
            success: function(user){
                return "true";
            },
            error: function(user, error){
                alert("Error creating user.  Please try again with different credentials.");
                console.log(error);
            }
        });
    }
    
    return factory;
}])

.service('LeagueService', [function(){
    var factory = {};
    
    factory.getRecentGames = function(leagueid){
        var recentGames = Parse.Object.extend("Game");
        var query = new Parse.Query(recentGames);
        query.equalTo("LeagueID",leagueid);
        query.descending("createdAt");
        query.limit(10);
        return query.find({
            success:function(results){
                //console.log(results);
            },
            error: function(error){
                console.log(error);   
            }
        });
    };
    
    factory.getLeagueStandings = function(leagueid){
        var standings = Parse.Object.extend("UserLeague");
        var query = new Parse.Query(standings);
        query.equalTo("LeagueID",leagueid);
        query.include(Parse.User);
        query.descending("Wins");
        return query.find({
            success:function(results){console.log(results);},
            error:function(error){console.log(error);}
        });
    };
    
    factory.getUserInformation = function(userid){ 
        console.log(userid);
        var query = new Parse.Query(Parse.User);
        query.equalTo("objectId", userid);
        return query.first({
            success:function(user){},
            error:function(error){console.log(error);}
        });
    };
    
    factory.getUserLeagueInformation = function(userleagueid){
        var query = new Parse.Query("UserLeague");
        query.equalTo("objectId", userleagueid);
        return query.first({
            success:function(user){},
            error:function(error){console.log(error);}
        });    
    };
    
    factory.getAllUserInformation = function(userleaguearray){
        
        var query = new Parse.Query(Parse.User);
        query.containedIn("objectId", userleaguearray);
        return query.find({
            success:function(results){console.table(results);},
            error:function(error){console.log(error);}
        });
    };
    
    factory.getRecentGamesForUser = function(userleagueid, isLimited){
        
        var gamesAsUser = new Parse.Object.extend("Game");
        var query1 = new Parse.Query(gamesAsUser);
        query1.equalTo("userID", userleagueid);
        
        var gamesAsOpponent = new Parse.Object.extend("Game");
        var query2 = new Parse.Query(gamesAsOpponent);
        query2.equalTo("opponentID", userleagueid);
        
        var mainQuery = Parse.Query.or(query1, query2);
        mainQuery.descending("createdAt");     
        mainQuery.limit(3);
        return mainQuery.find({
            success:function(results){},
            error:function(error){console.log(error);}
        });
    };
    
    return factory;
}]);

