// function fetchInput(searchQuery) {
//   return fetch(
//     `http://api.weatherapi.com/v1/search.json?key=49a5bf4d558245d9898124939211312&q=${searchQuery}`
//   )
//     .then(function (response) {
//       console.log(response);
//       let result = response.json();
//       console.log(result)
//       return result;
//     })
//     .then(function (data) {
//       // createCard(data);
//       console.log(data)
//     });
// }

const fetchInput = async (type, searchQuery) => {
    const response = await fetch(
        `http://api.weatherapi.com/v1/${type}.json?key=49a5bf4d558245d9898124939211312&q=${searchQuery}`
    );
    const data = await response.json();
    // console.log(data);
    return data;
};

function createCard(city) {
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

function fillCard(city) {
    address.innerText = city.location.name;
    tmp.innerText = city.current.temp_c + "°C";
    sky.innerText = city.current.condition.text;
    icon.src = city.current.condition.icon;
    humidity.innerText = "Humidity: " + city.current.humidity + "%";

    let k = sky.innerText.toLowerCase();
    console.log(root.className);

    if (k.includes("cloudy") || k.includes("overcast")) {
        root.className = "";
        root.classList.add("overcast");
        console.log(root.className);
    } else if (k.includes("rain")) {
        root.className = "";
        root.classList.add("rainy");
        console.log(root.className);
    } else if (k.includes("mist")) {
        root.className = "";
        root.classList.add("misty");
        console.log(root.className);
    } else if (k.includes("sun")) {
        root.className = "";
        root.classList.add("sunny");
        console.log(root.className);
    } else if (k.includes("overcast")) {
        root.className = "";
        root.classList.add("overcast");
        console.log(root.className);
    } else if (k.includes("wind")) {
        root.className = "";
        root.classList.add("windy");
        console.log(root.className);
    } else if (k.includes("snow")) {
        root.className = "";
        root.classList.add("snowy");
        console.log(root.className);
    } else {
        root.className = "";
        root.classList.add("root");
        console.log(root.className);
    }
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

    // input.addEventListener("click", () => {
    //     if (input.value === "") {
    //         let listOfFavourites = saveToFavourites();
    //     }
    // });

    input.addEventListener("input", async function (e) {
        const searchQuery = e.target.value;
        const listOfCities = await createArray(searchQuery);
        console.log(listOfCities);
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
                        // input.value = "";

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
    let favDiv = document.createElement("div");
    root.append(favDiv);

    array.push(value);
    console.log(array);
    return array;
}

function main() {
    let input = document.createElement("input");
    input.classList.add("input");
    input.id = "myInput";

    let root = document.getElementById("root");

    const wrapper = document.createElement("div");
    wrapper.id = "card-wrapper";

    const inputWrapper = document.createElement("div");
    inputWrapper.id = "input-wrapper";

    const btn = document.createElement("button");
    btn.innerText = "Save to favourites";
    btn.id = "btn";
    btn.addEventListener("click", () => {
        saveToFavourites(input.value, listOfFavourites);
    });

    inputWrapper.append(input, btn);
    root.append(inputWrapper, wrapper);
    autocomplete(input);
}

window.addEventListener("load", main);
