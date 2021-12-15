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
    let dataContainer = document.createElement('div');
    dataContainer.id = "data-container"
    dataContainer.innerHTML = "";
    let address = document.createElement('h2');
    address.innerText = city.location.name;
    let tmp = document.createElement('h3');
    tmp.innerText = city.current.temp_c + '°C';
    let sky = document.createElement('h3');
    sky.innerText = city.current.condition.text;
    let icon = document.createElement('img');
    icon.src = city.current.condition.icon;
    let humidity = document.createElement('h3');
    humidity.innerText = city.current.humidity + '%';
  
    dataContainer.append(address, tmp, sky, icon, humidity);
    document.getElementById('card-wrapper').append(dataContainer);
  }

const createArray = async (searchTerm) => {
  if (!searchTerm) return;
  const cities = await fetchInput('search', searchTerm);
  const listOfCities = [];
  for (let i = 0; i < cities.length; i++) {
    listOfCities.push(cities[i].name);
  }
  return listOfCities;
};

function autocomplete(input) {
  let currentFocus;

  input.addEventListener('input', async function (e) {
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
    container = document.createElement('div');
    container.setAttribute('id', this.id + ' autocomplete-list');
    container.setAttribute('class', 'autocomplete-items');
    input.parentNode.append(container);
    for (let i = 0; i < listOfCities.length; i++) {
      if (
        listOfCities[i].substr(0, value.length).toUpperCase() ==
        value.toUpperCase()
      ) {
        matchContainer = document.createElement('div');
        matchContainer.innerHTML =
          '<strong>' + listOfCities[i].substr(0, value.length) + '</strong>';
        matchContainer.innerHTML += listOfCities[i].substr(value.length);
        matchContainer.innerHTML +=
          "<input type='hidden' value='" + listOfCities[i] + "'>";
        matchContainer.addEventListener('click', async function (event) {
          input.value =
            this.getElementsByTagName('input')[0].value.split(',')[0];
          const selected = input.value;
          const cityWeather = await fetchInput('current', selected);
          createCard(cityWeather);
          closeAllLists();
        });
        container.appendChild(matchContainer);
      }
    }
  });

  function closeAllLists(element) {
    let autocomplete = document.getElementsByClassName('autocomplete-items');
    for (let i = 0; i < autocomplete.length; i++) {
      if (element != autocomplete[i] && element != input) {
        autocomplete[i].parentNode.removeChild(autocomplete[i]);
      }
    }
  }
}

function main() {
  let input = document.createElement('input');
  input.classList.add('input');
  input.id = 'myInput';

  let root = document.getElementById('root');

  const wrapper = document.createElement("div");
  wrapper.id = "card-wrapper";

  const inputWrapper = document.createElement("div");
  inputWrapper.id = "input-wrapper";
  inputWrapper.append(input);
  
  root.append(inputWrapper, wrapper,);
  autocomplete(input);
}

window.addEventListener('load', main);
