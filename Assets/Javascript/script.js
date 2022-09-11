var sleeperAPI, nflAPI;
var articleEL = $('#articles')
var spinner = $('#spinner')
fetch("./Assets/Local data/playerdata.json")
.then(response => {
   return response.json();
})
.then(data => {
   sleeperApi = data;
   console.log(data)
   return fetch("http://site.api.espn.com/apis/site/v2/sports/football/nfl/news");
})
.then(response => {
   return response.json();
})
.then (data => {
   nflAPI = data;
   console.log(data);
   
   for (let i = 0; i < nflAPI.articles.length; i++) {
      var headlineLink = nflAPI.articles[i].links.web.href
      $(spinner).append("<a class='tag is-success'href=" + headlineLink + ">" + nflAPI.articles[i].headline + "</a>" + " &#127944 ");
   }
   Marquee3k.init()
});
