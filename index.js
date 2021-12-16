const fetchInput = async (type, searchQuery) => {
    const response = await fetch(
        `http://api.weatherapi.com/v1/${type}.json?key=49a5bf4d558245d9898124939211312&q=${searchQuery}`
    );
    const data = await response.json();
    return data;
};

function createCard(city) {
    const wrapper = document.createElement("div");
    wrapper.id = "card-wrapper";
    root.append(wrapper);

    let dataContainer = document.createElement("div");
    dataContainer.id = "data-container";
    let address = document.createElement("h2");
    address.id = "address";
    let tmp = document.createElement("h3");
    tmp.id = "tmp";
    let sky = document.createElement("h3");
    sky.id = "sky";
    let icon = document.createElement("img");
    icon.id = "icon";
    let humidity = document.createElement("h3");
    humidity.id = "humidity";

    dataContainer.append(address, tmp, sky, icon, humidity);
    document.getElementById("card-wrapper").append(dataContainer);
}

const weatherObject = {
    "cloudy": "/pics/overcast.gif",
    "sunny": "/pics/sunny.gif",
    "rainy": "/pics/rain.gif",
    "partly cloudy": "/pics/overcast.gif",
    "overcast": "/pics/overcast.gif",
    "rain": "/pics/rain.gif",
    "partly sunny": "/pics/sunny.gif",
    "mist": "/pics/mist.gif",
    "windy": "pics/windy.gif",
    "snow": "/pics/snow.gif",
    "Light rain shower": "/pics/rain.gif",
    "fog": "/pics/mist.gif"
};

function checkWeatherCondition(city) {
    document.getElementById("background-img").src = weatherObject[city.current.condition.text.toLowerCase()] ?? "/pics/default.png";
}


function fillCard(city) {
    address.innerText = city.location.name;
    tmp.innerText = city.current.temp_c + "°C";
    sky.innerText = city.current.condition.text;
    icon.src = city.current.condition.icon;
    humidity.innerText = "Humidity: " + city.current.humidity + "%";
}

const createArray = async (searchTerm) => {
    if (!searchTerm) return;
    const cities = await fetchInput("search", searchTerm);
    const listOfCities = [];
    for (let i = 0; i < cities.length; i++) {
        listOfCities.push(cities[i].name);
    }
    return listOfCities;
};

function autocomplete(input) {
    let currentFocus;

    input.addEventListener("focus", function () {
        
            displayFavorites(input, listOfFavourites);
    });

    input.addEventListener("input", async function (e) {
        const searchQuery = e.target.value;
        const listOfCities = await createArray(searchQuery);
        let container = this.value;
        let matchContainer = this.value;
        let value = this.value;
        closeAllLists();
        
        if (!value) {
            return false;
        }
        
        currentFocus = -1;
        container = document.createElement("div");
        container.setAttribute("id", this.id + " autocomplete-list");
        container.setAttribute("class", "autocomplete-items");
        input.parentNode.append(container);
        for (let i = 0; i < listOfCities.length; i++) {
            if (
                listOfCities[i].substr(0, value.length).toUpperCase() ==
                value.toUpperCase()
                ) {
                    matchContainer = document.createElement("div");
                matchContainer.innerHTML =
                    "<strong>" +
                    listOfCities[i].substr(0, value.length) +
                    "</strong>";
                    matchContainer.innerHTML += listOfCities[i].substr(
                    value.length
                );
                matchContainer.innerHTML +=
                    "<input type='hidden' value='" + listOfCities[i] + "'>";
                    matchContainer.addEventListener(
                        "click",
                    async function (event) {
                        input.value =
                            this.getElementsByTagName("input")[0].value.split(
                                ","
                            )[0];
                        const selected = input.value;
                        const cityWeather = await fetchInput(
                            "current",
                            selected
                        );
                        if (!document.getElementById("data-container")) {
                            createCard(cityWeather);
                        }
                        fillCard(cityWeather);
                        checkWeatherCondition(cityWeather);

                        closeAllLists();
                    }
                );
                container.appendChild(matchContainer);
            }
        }
    });

    function closeAllLists(element) {
        let autocomplete =
            document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < autocomplete.length; i++) {
            if (element != autocomplete[i] && element != input) {
                autocomplete[i].parentNode.removeChild(autocomplete[i]);
            }
        }
    }
}

let listOfFavourites = [];

function saveToFavourites(value, array) {
    array.push(value);
    console.log(array);
    return array;
}

function displayFavorites(input, favorites) {
    console.log(input.value === "");
    if(!document.getElementById("favoriteDiv")) {
        let favoritedDiv = document.createElement("div");
        favoritedDiv.id = "favoriteDiv";
        input.parentNode.append(favoritedDiv);

    }
    if (document.getElementById("favoriteDiv")) {
        const favoritedDiv = document.getElementById("favoriteDiv");
        console.log("van div")
        const p = document.createElement("p");
        p.innerHTML = "";
        for(let i = 0; i < favorites.length;i++){
            p.innerText = favorites[i];
            if(document.getElementById("favoriteDiv").childElementCount < listOfFavourites.length) {
                favoritedDiv.append(p);
            }
        }
    }
        input.parentNode.append(document.getElementById("favoriteDiv"));
    }

function main() {
    let input = document.createElement("input");
    input.classList.add("input");
    input.id = "myInput";
    
    let root = document.getElementById("root");
    
    const inputWrapper = document.createElement("div");
    inputWrapper.id = "input-wrapper";
    
    const btn = document.createElement("button");
    btn.innerText = "Save to favourites";
    btn.id = "btn";
    btn.addEventListener("click", () => {
        saveToFavourites(input.value, listOfFavourites);
        
    });
    
    const imgWrapper = document.createElement("div");
    imgWrapper.id = "imgWrapper";
    
    const img = document.createElement("img");
    img.id = "background-img";
    imgWrapper.append(img);

    inputWrapper.append(input, btn);
    root.append(imgWrapper, inputWrapper);
    
    autocomplete(input);
    console.log(input.value);
}

window.addEventListener("load", main);
