var input = document.getElementById('location');
var button = document.getElementById('button');
var description = document.getElementById('description');
var temp = document.getElementById('temperature');
var nbhood = document.getElementById('locationlabel');
var timeLabel = document.getElementById('hourtime') 
var body = document.getElementById('body');
var locality = document.getElementById('locality')

window.addEventListener('load', getWeather);

function getWeather(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;
            console.log(position);
            var nbhood = document.getElementById('locationlabel');

            var proxy = 'https://cors-anywhere.herokuapp.com/';
            var api = `${proxy}https://api.darksky.net/forecast/fd9d9c6418c23d94745b836767721ad1/${lat},${long}`
            var location = `${proxy}https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=pt`
            var today = new Date()
            var hourTime = String(today.getHours()).padStart(2, '0') 
            var minuteTime = String(today.getMinutes()).padStart(2, '0')
            var time = hourTime + ':' + minuteTime;
            console.log(time)
            timeLabel.textContent = time

            
            Promise.all([
                fetch(api),
                fetch(location),
            ]).then(function (responses) {
                return Promise.all(responses.map(function (response) {
                    return response.json();
                }));
            }).then(function (data) {
                console.log(data)
                var {temperature, summary, icon } = data[0].currently;
                var locality = data[1].locality
                temp.textContent = ((temperature - 32) * 5/9).toFixed(1);
                description.textContent = summary; 
                nbhood.textContent = locality
                setIcons(icon, document.querySelector('.icon'));
            })

            
            if(hourTime < 18 && hourTime > 6){
                body.style.cssText = 'background: #2980b9; background: -webkit-linear-gradient(to bottom, #2c3e50, #2980b9); background: linear-gradient(to bottom, #2c3e50, #2980b9);'
                
            }
            else{
                body.style.cssText = 'background: #948E99; background: -webkit-linear-gradient(to bottom, #2E1437, #948E99);  background: linear-gradient(to bottom, #2E1437, #948E99);'
            }

        })
    } else{
        h1.textContent = 'Hey, please enable your geolocation to us!'
    }

    function setIcons(icon, iconID){
        var skycons = new Skycons({color: '#eaeaea'})
        var currentIcon = icon.replace(/-/g, "_").toUpperCase();
        skycons.play();
        return skycons.set(iconID, Skycons[currentIcon]);
    }

    input.addEventListener('keyup', function(event){
        if(event.key === 'Enter'){
            return searchWeather();
        }
    })

    button.addEventListener('click', searchWeather);

    function searchWeather(){
        var location = input.value;
        console.log(location);
        
        
        var proxy = 'https://cors-anywhere.herokuapp.com/';
        var api = `${proxy}http://api.weatherapi.com/v1/current.json?key= 22370fad94b44b3c94300446211806&q=${location}&aqi=no`;

        fetch(api)
        .then(response =>{
            return response.json();
        })
        .then(data =>{
            console.log(data)
            var location = data.location.name
            var state = data.location.country
            var newLocation = location + ', ' + state;
            console.log(newLocation)
            var lat = data.location.lat;
            var long = data.location.lon;
            var localtime = data.location.localtime;
            var localtimeCut = localtime.split(' ');
            var localtimeFull = localtimeCut[1];
            var localtimesFullSepareted = localtimeFull.split(':');
            var minuteLocaltime = String(localtimesFullSepareted[1]).padStart(2, '0');
            var justHourLocaltime = String(localtimesFullSepareted[0]).padStart(2, '0');
            var today = new Date()
            var minuteTime = String(today.getMinutes()).padStart(2, '0')
            var array = [justHourLocaltime, minuteLocaltime, minuteTime]
            console.log(array)
            if (minuteLocaltime <= minuteTime){
                timeLabel.textContent = justHourLocaltime + ':' + minuteTime
            }
            else if (minuteLocaltime > minuteTime){
                if(justHourLocaltime = 23){
                    timeLabel.textContent = '00:' + minuteTime
                } else{
                timeLabel.textContent = (parseInt(justHourLocaltime, 10) + 1) + ':' + minuteTime
                }
            }
            var nbhood = document.getElementById('locationlabel');
            var isDay = data.current.is_day;

            if(isDay == '1'){
                body.style.cssText = 'background: #2980b9; background: -webkit-linear-gradient(to bottom, #2c3e50, #2980b9); background: linear-gradient(to bottom, #2c3e50, #2980b9);'
                
            }
            else if (isDay =='0'){
                body.style.cssText = 'background: #948E99; background: -webkit-linear-gradient(to bottom, #2E1437, #948E99);  background: linear-gradient(to bottom, #2E1437, #948E99);'
            }


            var proxy = 'https://cors-anywhere.herokuapp.com/';
            var api = `${proxy}https://api.darksky.net/forecast/fd9d9c6418c23d94745b836767721ad1/${lat},${long}`
            
            fetch(api)
            .then(response =>{
                return response.json();
            })
            .then(data =>{
            console.log(data)
            var {temperature, summary, icon } = data.currently;
            temp.textContent = ((temperature - 32) * 5/9).toFixed(1);
            description.textContent = summary; 
            nbhood.textContent = newLocation
            setIcons(icon, document.querySelector('.icon'));
            
        })

        })
    }

} 