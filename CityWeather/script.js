var input = document.getElementById('location');
var button = document.getElementById('button');
var description = document.getElementById('description');
var temp = document.getElementById('temperature');
var nbhood = document.getElementById('locationlabel');
var timeLabel = document.getElementById('hourtime') 
var body = document.getElementById('body');
var degree = document.getElementById('degreespan');
var temperatureLabel = document.getElementById("temperatureLabel")
var locality = document.getElementById('locality')

window.addEventListener('load', getWeather);

function getWeather(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;
            console.log(position);
            var nbhood = document.getElementById('locationlabel');


            var proxy = 'https://the-cors.herokuapp.com/';
            var api = `${proxy}https://api.darksky.net/forecast/fd9d9c6418c23d94745b836767721ad1/${lat},${long}`
            var location = `${proxy}https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=pt`
            var isdayapi = `${proxy}http://api.weatherapi.com/v1/current.json?key= 22370fad94b44b3c94300446211806&q=${lat},${long}&aqi=no`;
        
            
            Promise.all([
                fetch(api),
                fetch(location),
                fetch(isdayapi)
            ]).then(function (responses) {
                return Promise.all(responses.map(function (response) {
                    return response.json();
                }));
            }).then(function (data) {
                console.log(data)
                var {temperature, summary, icon } = data[0].currently;
                var locality = data[1].locality
                temp.textContent = ((temperature - 32) * 5/9).toFixed(1);
                temp.addEventListener('click', function(evt){
                    if(degree.textContent === 'ºC'){
                        temp.textContent = temperature.toFixed(1);
                        degree.textContent = '°F'
                    }
                    else if (degree.textContent === '°F'){
                        temp.textContent = ((temperature - 32) * 5/9).toFixed(1);
                        degree.textContent = 'ºC'
                    }
                })
                description.textContent = summary; 
                nbhood.textContent = locality

                var isDay = data[2].current.is_day
                setIcons(icon, document.querySelector('.icon'));

                var reloadTemp = setInterval(function(){
                    Promise.all([
                        fetch(api),
                        fetch(location),
                        fetch(isdayapi)
                    ]).then(function (responses) {
                        return Promise.all(responses.map(function (response) {
                            return response.json();
                        }));
                    }).then(function (data) {
                        console.log(data)
                        var {temperature, summary, icon } = data[0].currently;
                        var locality = data[1].locality
                        temp.textContent = ((temperature - 32) * 5/9).toFixed(1);
                        temp.addEventListener('click', function(evt){
                            if(degree.textContent === 'ºC'){
                                temp.textContent = temperature.toFixed(1);
                                degree.textContent = '°F'
                            }
                            else if (degree.textContent === '°F'){
                                temp.textContent = ((temperature - 32) * 5/9).toFixed(1);
                                degree.textContent = 'ºC'
                            }
                            
                        })
                        if(degree.textContent === '°F'){
                            temp.textContent = temperature.toFixed(1);
                        }
                        else if(degree.textContent === 'ºC'){
                            temp.textContent = ((temperature - 32) * 5/9).toFixed(1);
                        }
                        description.textContent = summary; 
                        nbhood.textContent = locality
        
                        var isDay = data[2].current.is_day
                        setIcons(icon, document.querySelector('.icon'));
                    })

                }, 90 * 1000)

                if(isDay == '1'){
                    body.style.cssText = 'background: #2980b9; background: -webkit-linear-gradient(to bottom, #2c3e50, #2980b9); background: linear-gradient(to bottom, #2c3e50, #2980b9);'          
                }
                else if (isDay =='0'){
                    body.style.cssText = 'background: #948E99; background: -webkit-linear-gradient(to bottom, #2E1437, #948E99);  background: linear-gradient(to bottom, #2E1437, #948E99);'
                }

                var today = new Date()
                var hourTime = String(today.getHours()).padStart(2, '0') 
                var minuteTime = String(today.getMinutes()).padStart(2, '0')
                var time = hourTime + ':' + minuteTime;
                timeLabel.textContent = time

                var localReload = setInterval(function(){

                        var isDay = data[2].current.is_day
                        setIcons(icon, document.querySelector('.icon'));

                        if(isDay == '1'){
                            body.style.cssText = 'background: #2980b9; background: -webkit-linear-gradient(to bottom, #2c3e50, #2980b9); background: linear-gradient(to bottom, #2c3e50, #2980b9);'          
                        }
                        else if (isDay =='0'){
                            body.style.cssText = 'background: #948E99; background: -webkit-linear-gradient(to bottom, #2E1437, #948E99);  background: linear-gradient(to bottom, #2E1437, #948E99);'
                        }

                        var today = new Date()
                        var hourTime = String(today.getHours()).padStart(2, '0') 
                        var minuteTime = String(today.getMinutes()).padStart(2, '0')
                        var time = hourTime + ':' + minuteTime;
                        timeLabel.textContent = time
                        
                }, 1000);
                
                button.addEventListener('click', function (evt){
                    clearInterval(localReload);
                    clearInterval(reloadTemp);
                })
                input.addEventListener('keyup', function(event){
                    if(event.key === 'Enter'){
                        clearInterval(localReload);
                        clearInterval(reloadTemp);
                    }
                })
            })


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

    timeLabel.style.cssText = 'cursor:auto;'
        

    button.addEventListener('click', searchWeather);

    function searchWeather(){
        var location = input.value;
        console.log(location);
        
        
        var proxy = 'https://the-cors.herokuapp.com/';
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
            if (parseInt(minuteLocaltime, 10) - parseInt(minuteTime, 10) > 30){
                if(hourTime === '23'){
                    time = '00:' + minuteTime;
                    timeLabel.textContent = time;
                }
                else{
                    time = (parseInt(justHourLocaltime, 10) + 1) + ':' + minuteTime
                    timeLabel.textContent = time
                }
            }
            else {
                time = justHourLocaltime + ':' + minuteTime
                timeLabel.textContent = time
            }
            var nbhood = document.getElementById('locationlabel');
            var isDay = data.current.is_day;

            if(isDay == '1'){
                body.style.cssText = 'background: #2980b9; background: -webkit-linear-gradient(to bottom, #2c3e50, #2980b9); background: linear-gradient(to bottom, #2c3e50, #2980b9);'
                
            }
            else if (isDay =='0'){
                body.style.cssText = 'background: #948E99; background: -webkit-linear-gradient(to bottom, #2E1437, #948E99);  background: linear-gradient(to bottom, #2E1437, #948E99);'
            }

            var localReload = setInterval(function(){
                var localtime = data.location.localtime;
                var localtimeCut = localtime.split(' ');
                var localtimeFull = localtimeCut[1];
                var localtimesFullSepareted = localtimeFull.split(':');
                var minuteLocaltime = String(localtimesFullSepareted[1]).padStart(2, '0');
                var justHourLocaltime = String(localtimesFullSepareted[0]).padStart(2, '0');
                var today = new Date()
                var minuteTime = String(today.getMinutes()).padStart(2, '0')
                if (parseInt(minuteLocaltime, 10) - parseInt(minuteTime, 10) > 30){
                    if(hourTime === '23'){
                        time = '00:' + minuteTime;
                        timeLabel.textContent = time;
                    }
                    else{
                        time = (parseInt(justHourLocaltime, 10) + 1) + ':' + minuteTime
                        timeLabel.textContent = time
                    }
                }
                else {
                    time = justHourLocaltime + ':' + minuteTime
                    timeLabel.textContent = time
                }
                var isDay = data.current.is_day;
    
                if(isDay === '1'){
                    body.style.cssText = 'background: #2980b9; background: -webkit-linear-gradient(to bottom, #2c3e50, #2980b9); background: linear-gradient(to bottom, #2c3e50, #2980b9);'
            
                }
                else if (isDay === '0'){
                    body.style.cssText = 'background: #948E99; background: -webkit-linear-gradient(to bottom, #2E1437, #948E99);  background: linear-gradient(to bottom, #2E1437, #948E99);'
                }
            }, 1000);

            var proxy = 'https://the-cors.herokuapp.com/';
            var api = `${proxy}https://api.darksky.net/forecast/fd9d9c6418c23d94745b836767721ad1/${lat},${long}`
            
            fetch(api)
            .then(response =>{
                return response.json();
            })
            .then(data =>{
            console.log(data)
            var {summary, icon } = data.currently;
            var crttemp = data.currently.temperature
            degree.textContent = "ºC"
            temp.textContent = ((crttemp - 32) * 5/9).toFixed(1);
            description.textContent = summary; 
            nbhood.textContent = newLocation
            setIcons(icon, document.querySelector('.icon'));
            var whichdegree = degree.textContent;
            
            var reloadTemp = setInterval(function(){
                fetch(api)
                .then(response =>{
                    return response.json();
                })
                .then(data =>{
                console.log(data)
                var {summary, icon } = data.currently;
                var crttempr = data.currently.temperature

                description.textContent = summary; 
                nbhood.textContent = newLocation
                setIcons(icon, document.querySelector('.icon'));

                var whichdegree = degree.textContent;

                if(whichdegree === 'ºF'){
                    temp.textContent = crttempr.toFixed(1)
                }
                else if(whichdegree === '°C'){
                    temp.textContent = ((crttempr - 32) * 5/9).toFixed(1);
                }


                temp.addEventListener('click',() => {
                    if(whichdegree === 'ºC'){
                        temp.textContent = crttempr.toFixed(1)
                        whichdegree = '°F'
                    }
                    else if(whichdegree === '°F'){
                        temp.textContent = ((crttempr - 32) * 5/9).toFixed(1);
                        whichdegree = 'ºC'
                    }
                })
                })

                
            }, 90 * 1000)

            
            button.addEventListener('click', function (evt){
                clearInterval(localReload);
                clearInterval(reloadTemp);

            })

            input.addEventListener('keyup', function(event){
                if(event.key === 'Enter'){
                    clearInterval(localReload);
                    clearInterval(reloadTemp);
                }
            })
            


            
            temp.addEventListener('click',() => {
                if(whichdegree === 'ºC'){
                    temp.textContent = crttemp.toFixed(1)
                    whichdegree = '°F'
                }
                else if(whichdegree === '°F'){
                    temp.textContent = ((crttemp - 32) * 5/9).toFixed(1);
                    whichdegree = 'ºC'
                }
            })


            
        })
        timeLabel.style.cssText = 'cursor:pointer;'

        timeLabel.addEventListener('click', function(evt) {
            return getWeather();
        })

        timeLabel.addEventListener('click', function(evt) {
            clearInterval(localReload);
            clearInterval(reloadTemp);
        });
        
        
        })
    
        

    }
} 
