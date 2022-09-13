var playerData, nflNews, userLineups, league, userData, liveScore;
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
   userLineups = data;
   console.log(userLineups);
   var lineup1 = userLineups[0].league_id;
   console.log(lineup1);
   var rosterArray = userLineups[0].roster_positions.filter(function (item){
      return item !== "BN"
   })

   $('#team1card-content').append("<h2 class=title is-4>" + userLineups[0].name + "</h2>"); 
      
      for (let i=0; i < rosterArray.length; i++){
         $('#teamcard-positions').append("<ul> <li>" + userLineups[0].roster_positions[i] + "</li></ul>");
      };

   return fetch("https://api.sleeper.app/v1/league/" + lineup1 + "/rosters");
})
.then(response => {
   return response.json();
})
.then(data => {
   league = data;
   console.log(data);
   console.log(userData.user_id);
   console.log(playerData);

   var matchingData = league.filter( (league) => {
      if(league.owner_id == userData.user_id){
         return true;
      }})
      console.log(matchingData);

      var matchingPlayers = matchingData[0].starters;
      console.log(matchingPlayers);
      
      var newPlayerData = Object.values(playerData)


      console.log(newPlayerData)
      console.log(Object.keys(playerData));
      console.log(Object.values(playerData));
      console.log(Object.entries(playerData));
      
      var newArray = []
      for (var varPlayer of matchingPlayers){
         newArray.push(playerData[varPlayer])
         }
      var finalArray = []
      console.log(newArray)
         for (let i=0; i < newArray.length; i++){ 
            if (newArray[i].full_name){
         $('#teamcard-players').append("<ul><li>"+ newArray[i].full_name + "</ul></li>")
            } else {
               $('#teamcard-players').append("<ul><li>"+ newArray[i].last_name + "</ul></li>")
            }
         } 
   });

};

// Search button event
searchBtn.addEventListener("click", searchClickHandler);

//Creating function to open new page on load