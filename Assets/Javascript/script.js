var playerData, nflNews, userLeagues, league, league1, league2, userData, liveScore, matchingRosterID, league1Data, matchupID;
var articleEL = $('#articles');
var spinner = $('#spinner');
var searchBtn = document.querySelector('#search-btn');
var nflScores = "http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";

//Variables for news/score updates
var scoreText = $('#nflScoreText');
var scoreImage = $('#scoreImage');
var newsText = $('#newsText');



//Fetching data from our local data, massive file of all NFL athletes and their names/stats
fetch("./Assets/Local data/playerdata.json")
.then(response => {
   return response.json();
})
.then(data => {
   //Logging NFL player data in a variable
   playerData = data;
   console.log(data) 
   //Fetching NFL news from ESPN's "secret" API
   return fetch("https://site.api.espn.com/apis/site/v2/sports/football/nfl/news");
})
.then(response => {
   return response.json();
})
.then (data => {
   //Storing NFL News data in a variable
   nflNews = data;
   console.log(data);
   
   //Looping through the NFL News data, appending it to our spinner element. Adding hrefs for
   for (let i = 0; i < nflNews.articles.length; i++) {
      var headlineLink = nflNews.articles[i].links.web.href
      $(spinner).append(" <i class='fa-solid fa-newspaper fa-xl'></i> " + "<a class='tag is-success'href=" + headlineLink + " target='_blank'>" + nflNews.articles[i].headline + "</a>" );
   }
   //Calling Marquee3k, a script that will create a spinning banner inside any div we call it to
   Marquee3k.init()
   //
   return fetch(nflScores)
})
.then(response =>{
   return response.json();
})
.then(data => {
   liveScore = data;
   console.log(liveScore);
   $(scoreText).text("Scores and News for Week " + liveScore.week.number + " of " + liveScore.season.year);
   for (let i=0; i < liveScore.events.length; i++){
      var gameDate = liveScore.events[i].date;
      var newDate = gameDate.split("T")[0];
      const date = new Date (newDate);
      $(newsText).append("<li>" + liveScore.events[i].name + " --- " + date + "</li>");
   }
})
;

//Function on click to fetch Sleeper APIS
//
//
function searchClickHandler (event) {
   event.preventDefault();
   var username = document.querySelector('#username').value;
   if (!event.target.matches('#search-btn')) {
      return;
   } else {
   userSearch(username);
   console.log(username);
   
   }
};

// Username Search Function for Fantasy Team
var userSearch = function (username) {
var apiURL = "https://api.sleeper.app/v1/user/"+ username;
fetch(apiURL)
.then(response => {
   return response.json();
})
.then(data => {
   userData = data;
   console.log(data)
   $('#welcome-user').append("<img src='https://sleepercdn.com/avatars/" + userData.avatar + "' id=user-image >");
   $('#welcome-user').append("<h2 class='title is-2 m-5'> Welcome " + username + "</h2>");
   $('#welcome-user').append("<button class='button is-success' id='leaguedata'> Leauge Data </button>");
   return fetch("https://api.sleeper.app/v1/user/" + userData.user_id + "/leagues/nfl/2022");
})
.then(response => {
   return response.json();
})
.then(data => {
   userLeagues = data;
   console.log(userLeagues);
   league1 = userLeagues[0].league_id;
   league2 = userLeagues[1].league_id;
   console.log(league1);
   console.log(league2);
   
   //Filter
   var rosterArray1 = userLeagues[0].roster_positions.filter(function (item){
      return item !== "BN"
   })
   var rosterArray2 = userLeagues[1].roster_positions.filter(function (item){
      return item !== "BN"
   })

   $('#team1card-content').append("<h2 class=title is-4 has-text-centered>" + userLeagues[0].name + "</h2>");
   $('#league2card-content').append("<h2 class=title is-4 has-text-centered>" + userLeagues[1].name + "</h2>"); 
      
      for (let i=0; i < rosterArray1.length; i++){
         $('#teamcard-positions').append("<ul><li class='is-size-5'>" + userLeagues[0].roster_positions[i] + "</li></ul>");
      };
      for (let i=0; i < rosterArray2.length; i++){
         $('#teamcard-positions2').append("<ul><li class='is-size-5'>" + userLeagues[1].roster_positions[i] + "</li></ul>");
      };

   return fetch("https://api.sleeper.app/v1/league/" + league1 + "/rosters");
})
.then(response => {
   return response.json();
})
.then(data => {
   league = data;
   console.log(data);
   console.log(userData.user_id);

   var matchingData = league.filter( (league) => {
      if(league.owner_id == userData.user_id){
         return true;
      }})
      console.log(matchingData);
      
      
      matchingRosterID = matchingData[0].roster_id;

      console.log(matchingRosterID);

      var matchingPlayers = matchingData[0].starters;
      console.log(matchingPlayers);
      
      var newArray = []
      for (var varPlayer of matchingPlayers){
         newArray.push(playerData[varPlayer])
         }
      var finalArray = []
      console.log(newArray)
         for (let i=0; i < newArray.length; i++){ 
            if (newArray[i].full_name){
         $('#teamcard-players').append("<ul class='has-text-left'><li class='is-size-5'>"+ newArray[i].full_name + "</ul></li>")
            } else {
               $('#teamcard-players').append("<ul class='has-text-left'><li class='is-size-5'>"+ newArray[i].last_name + "</ul></li>")
            }
         } 
   return fetch("https://api.sleeper.app/v1/league/" + league1 + "/matchups/1");
   })
   .then(response => {
      return response.json();
   })
   .then(data => {
      league1Data = data;
      console.log(league1Data)
      console.log(league1Data[3].roster_id);
      console.log(league1Data[3].matchup_id);
      console.log(matchingRosterID);


      var matchingID = league1Data.filter( (league1Data) => {
         if(league1Data.roster_id == matchingRosterID){
            return true;
         }})

      // Returning user status in league after referencing roster-id through array
      // Doing this to get matchup_id which we cannot get otherwise
      console.log(matchingID)
      for (let i=0; i < matchingID[0].starters_points.length; i++){
         $('#teamcard-players1points').append("<ul class='has-text-right has-text-info'><li class='is-size-5'>"+ matchingID[0].starters_points[i] + "</ul></li>");
      }
      
      var matchupID = matchingID[0].matchup_id; // always searched user because [0] refers only to one array we pull
      console.log(matchupID);
      
      var compareMatchingID = league1Data.filter( (league1Data) => {
         if(league1Data.matchup_id == matchupID){
            return true;
         }})
         console.log(compareMatchingID)
      
         var otherPlayerArr = compareMatchingID.filter( (compareMatchingID) => {
            if(compareMatchingID.roster_id !== matchingRosterID){
               return true;
            }})
         console.log(otherPlayerArr);
         
         for (let i=0; i < otherPlayerArr[0].starters_points.length; i++){
            $('#teamcard-players2points').append("<ul class='has-text-left has-text-info'><li class='is-size-5'>"+ otherPlayerArr[0].starters_points[i] + "</ul></li>");
         }
      
      var matchingPlayers = otherPlayerArr[0].starters;
      console.log(matchingPlayers);
      
         var newArray = []
            for (var varPlayer of matchingPlayers){
            newArray.push(playerData[varPlayer])
            }
            console.log(newArray);
            for (let i=0; i < newArray.length; i++){ 
               if (newArray[i].full_name){
            $('#teamcard-players2').append("<ul class='has-text-right'><li class='is-size-5'>"+ newArray[i].full_name + "</ul></li>")
               } else {
                  $('#teamcard-players2').append("<ul class='has-text-right'><li class='is-size-5'>"+ newArray[i].last_name + "</ul></li>")
               }
            } 
         $('#team1points').text(matchingID[0].points);
         $('#team2points').text(otherPlayerArr[0].points);
   })
   
};

// Search button event
searchBtn.addEventListener("click", searchClickHandler);

//Creating function to open new page on load