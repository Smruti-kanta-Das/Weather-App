const userTab = document.querySelector('[data-userWeather]');

const searchTab = document.querySelector('[data-searchWeather]');

const userContainer = document.querySelector('.weather-container');

const grantAccessContainer = document.querySelector('.grant-location-container');

const searchForm = document.querySelector('[data-searchForm]');

const loadingScreen = document.querySelector('.loading-container');

const userInfoContainer = document.querySelector('.user-info-container');

const notFoundContainer = document.querySelector('.notFound');

const image = document.querySelector('.image');

// Initially variable needed

let currentTab = userTab;
const API_KEY = 'da21f662fa9fba3154301dad8d93c46b';
currentTab.classList.add('current-tab');
getFromSessionStorage();



function switchTab(clickedTab)
{
    if(clickedTab != currentTab)
    {
        currentTab.classList.remove('current-tab');
        currentTab = clickedTab;
        currentTab.classList.add('current-tab');


        if(!searchForm.classList.contains('active'))
        {
            // want to make searchForm visible and other invisible
            userInfoContainer.classList.remove('active');
            grantAccessContainer.classList.remove('active');
            searchForm.classList.add('active');
        }
        else{
            
            searchForm.classList.remove('active');
            userInfoContainer.classList.remove('active');
            getFromSessionStorage();
        }





    }
}



userTab.addEventListener('click',()=>
{
    // pass input tab as parameter
    switchTab(userTab);
});

searchTab.addEventListener('click',()=>
{
    // pass input tab as parameter
    switchTab(searchTab);
});


// check if coordinates are present in session storage
function getFromSessionStorage()
{
    const localCoordinates = sessionStorage.getItem('user-coordinates');

    if(!localCoordinates)
    {
        grantAccessContainer.classList.add('active');
    }

    else{
        const coordinates = JSON.parse(localCoordinates);

        fetchUserWeatherInfo(coordinates);
        
    }

}


async function fetchUserWeatherInfo(coordinates)
{
    const {lat,lon} = coordinates;

    // make grantContainer invisible
    grantAccessContainer.classList.remove('active');

    // make loader visible
    loadingScreen.classList.add('active');

    



    // API call
    try{

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        
        const data = await response.json();

        loadingScreen.classList.remove('active');
        notFoundContainer.classList.remove('active');
        image.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);

    }


    catch(err)
    {
       console.log('Error Occurred',err);
       loadingScreen.classList.add('active');
       userInfoContainer.classList.remove('active');
       
        
    }
}


function renderWeatherInfo(weatherInfo)
{
    // first we have to fetch the elements

    const cityName = document.querySelector('[data-cityName]');
    const countryIcon = document.querySelector('[data-countryIcon]');
    const desc = document.querySelector('[data-weatherDesc]');

    const weatherIcon = document.querySelector('[data-weatherIcon]');
    const temp = document.querySelector('[data-temp]');

    const windspeed = document.querySelector('[data-windspeed]');
    const humidity = document.querySelector('[data-humidity]');
    const cloudiness = document.querySelector('[data-cloudiness]');


    // fetch the values from weatherInfo object and put in UI elements

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText =`${weatherInfo?.main?.temp} °C`;
    windspeed.innerText =`${weatherInfo?.wind?.speed}m/s `;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText =`${weatherInfo?.clouds?.all}%`;

    console.log('WeatheInfo -',weatherInfo);

    if(weatherInfo.cod === '404')
    {
        notFoundContainer.classList.add('active');
        image.classList.add('active');
       
    }


   

    
}

const grantAccessButton = document.querySelector('[data-grantAccess]');

function getLocation()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{

       alert('No Geolocation Support Available');
       
    }
}

function showPosition(position)
{
    const userCoordinates={
        lat: position.coords.latitude,
        lon: position.coords.longitude
    };

    sessionStorage.setItem('user-coordinates',JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}
grantAccessButton.addEventListener('click', getLocation);



const searchInput = document.querySelector('[data-searchInput]');

searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    let cityName = searchInput.value;

    if(cityName === '')
    {
        return;
    }

  else{
    fetchSearchWeatherInfo(cityName);
  }

});

async function fetchSearchWeatherInfo(city)
{
    loadingScreen.classList.add('active');
    userInfoContainer.classList.remove('active');
    grantAccessContainer.classList.remove('active');

    


    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const data = await response.json();
        
        if(data.cod !== '404')
        {
            loadingScreen.classList.remove('active');
            notFoundContainer.classList.remove('active');
            image.classList.remove('active');
            renderWeatherInfo(data);
            userInfoContainer.classList.add('active');
        }

        else{
            loadingScreen.classList.remove('active');
            userInfoContainer.classList.remove('active');
            notFoundContainer.classList.add('active');
            image.classList.add('active');
        }

       

        
    }

    catch(err)
    {
        console.log("Error Occurred, try another city");

        userInfoContainer.classList.remove('active');
        notFoundContainer.classList.add('active');
        image.classList.add('active');

       
        
    }


}


