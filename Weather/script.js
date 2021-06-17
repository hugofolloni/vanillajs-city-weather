/// NEXT THINGS TO DO: Create a Input to choose location if you don't want to know on your current 
/// AND: Change the background color if surpass the 18 PM


window.addEventListener('load', ()=>{
    let long;
    let lat;
    let temperatureDescription = document.querySelector('.temperature-description');
    let temperatureDegree = document.querySelector('.temperature-degree')
    let locationTimezone = document.querySelector('.location-timezone')

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;
            console.log(position)
            
            const proxy = 'https://cors-anywhere.herokuapp.com/';
            const api = `${proxy}https://api.darksky.net/forecast/fd9d9c6418c23d94745b836767721ad1/${lat},${long}`
            const location = `${proxy}https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=pt`

            
            Promise.all([
                fetch(api),
                fetch(location)
            ]).then(function (responses) {
                return Promise.all(responses.map(function (response) {
                    return response.json();
                }));
            }).then(function (data) {
                console.log(data)
                const {temperature, summary, icon } = data[0].currently;
                const locality = data[1].locality
                temperatureDegree.textContent = ((temperature - 32) * 5/9).toFixed(1);
                temperatureDescription.textContent = summary; 
                locationTimezone.textContent = locality
                setIcons(icon, document.querySelector('.icon'));
            })
        })
    
    } else{
        h1.textContent = 'Hey, please enable your geolocation to us!'
    }


    function setIcons(icon, iconID){
        const skycons = new Skycons({color: 'white'})
        const currentIcon = icon.replace(/-/g, "_").toUpperCase();
        skycons.play();
        return skycons.set(iconID, Skycons[currentIcon]);
    }
});
