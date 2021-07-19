const KEYAPI = '10cad1f11ae1bd2dba928feb8d65fd5c';
let resultsAPI;
const daysFrensh = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const imgIcone = document.querySelector('.logo-meteo');
const chargementContainer = document.querySelector('.overlay');

//const days
let today = new Date();
let options = {weekday: 'long'};
let currentDay = today.toLocaleDateString('fr-FR', options)
currentDay = currentDay.charAt(0).toUpperCase() + currentDay.slice(1);
let daysOrder = daysFrensh.slice(daysFrensh.indexOf(currentDay)).concat(daysFrensh.slice(0, daysFrensh.indexOf(currentDay)));
const time = document.querySelector('.temps');
const tempurature = document.querySelector('.tempurature');
const localisation = document.querySelector('.localisation');
const hours = document.querySelectorAll('.heure-prevision-nom');
const hoursTmp = document.querySelectorAll('.heure-prevision-valeur');
const days = document.querySelectorAll('.jour-prevision-nom');
const daysTmp = document.querySelectorAll('.jour-prevision-valeur');
if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        const long = position.coords.longitude;
        const lat = position.coords.latitude;
        callAPI(lat, long);
    }, () => {
        alert('Activer la géolocalisation!');
    });
}

function callAPI(lat, long) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&lang=fr&exclude=minutely&units=metric&appid=${KEYAPI}`)
    .then((response)=> {
        return response.json();
    })
    .then((data) => {
        resultsAPI = data;
        time.innerText = resultsAPI.current.weather[0].description;
        tempurature.innerText = Math.trunc(resultsAPI.current.temp) + '°';
        localisation.innerText = resultsAPI.timezone;
        let currentHour = new Date().getHours();
        console.log(currentHour)
        for(let i = 0; i < hours.length; i++) {
            let incHour = currentHour + i * 3;
            if(incHour==24)
                hours[i].innerText = '00:00h';
            else if(incHour>24)
                hours[i].innerText = incHour-24 + ':00h';
            else
                hours[i].innerText = incHour + ':00h';
            hoursTmp[i].innerText = Math.trunc(resultsAPI.hourly[i*3].temp) + '°';
        } 
        for(let i = 0; i < days.length; i++) {
            days[i].innerText = daysOrder[i];
            daysTmp[i].innerText = Math.trunc(resultsAPI.daily[i].feels_like.day) + '°';
        }
        
        if(currentHour >= 6 && currentHour < 21) {
             imgIcone.src = `./ressources/jour/${resultsAPI.current.weather[0].icon}.svg`;
        } else  {
            imgIcone.src = `./ressources/nuit/${resultsAPI.current.weather[0].icon}.svg`;
        }


         chargementContainer.classList.add('disparition');
    });
}