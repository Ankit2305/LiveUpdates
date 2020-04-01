var active = document.querySelector('#active'),
    confirmed = document.querySelector('#confirmed'),
    deaths = document.querySelector('#deaths'),
    recovered = document.querySelector('#recovered');

var coronaCasesData;
var graphData = [], currentCountry = "";


fetch("https://pomber.github.io/covid19/timeseries.json")
  .then(response => response.json())
  .then(data => {
    coronaCasesData = data;
    display('India');
    showCountryList();
});

  function display(country){
      return new Promise((resolve, reject) => {
        currentCountry = country;
        var len = coronaCasesData[country].length - 1;
        recovered.textContent = coronaCasesData[country][len].recovered;
        confirmed.textContent = coronaCasesData[country][len].confirmed;
        deaths.textContent = coronaCasesData[country][len].deaths;
        active.textContent = coronaCasesData[country][len].confirmed - coronaCasesData[country][len].deaths - coronaCasesData[country][len].recovered;

        graphData = [];
        if(coronaCasesData[country]){
            graphData.push(['Date', 'Active Cases', 'Deaths', 'Recovered', 'Confirmed Cases']);
            coronaCasesData[country].forEach(data => {
              graphData.push([ data.date, data.confirmed - data.deaths - data.recovered, data.deaths, data.recovered, data.confirmed ]);
            });
            drawChart();
            resolve();
        }
        else 
          reject("Something went wrong");
      });
      
  }

  //page no 257 - 271


google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

  var data = google.visualization.arrayToDataTable(graphData);

  var options = {
    title: currentCountry,
    curveType: 'function',
    legend: { position: 'bottom' }
  };

  var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

  chart.draw(data, options);
}

function showCountryList(){
    var countryList = document.querySelector("#countryList");
    var fields = Object.keys(coronaCasesData);
    countryList.innerHTML = "";
    fields.forEach( country => {
        var len = coronaCasesData[country].length - 1;
        var deaths = coronaCasesData[country][len].deaths;
        var confirmed = coronaCasesData[country][len].confirmed;
        var recovered = coronaCasesData[country][len].recovered;
        var active = coronaCasesData[country][len].confirmed - coronaCasesData[country][len].deaths - coronaCasesData[country][len].recovered;
        countryList.innerHTML += `<td class="country">${country}</td><td>${active}</td><td>${confirmed}</td><td>${deaths}</td><td>${recovered}</td>`;
    });

    var countries = document.querySelectorAll(".country");

    for(var i=0;i<countries.length;i++){
        countries[i].addEventListener('click', function(){
            var countryName = this.textContent;
            display(countryName);
            scrollTo(0, 0);
        });
    }
}

