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

const fetchInput = async (searchQuery) => {
  const response = await fetch(
    `http://api.weatherapi.com/v1/search.json?key=49a5bf4d558245d9898124939211312&q=${searchQuery}`
  );
  const data = await response.json();
  // console.log(data);
  return data;
};


function createCard(city) {
  // console.log(city);
  let dataContainer = document.createElement('div');
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
  root.append(dataContainer);
}

function autocomplete(input, array) {
  let currentFocus;
  console.log(array);
  
  input.addEventListener('input', function (e) {
    let container = this.value;
    let matchContainer = this.value;
    let i = this.value;
    let value = this.value;
    // console.log(container);
    closeAllLists();
    
    if (!value) {
      return false;
    }
    currentFocus = -1;
    container = document.createElement('div');
    container.setAttribute('id', this.id + ' autocomplete-list');
    container.setAttribute('class', 'autocomplete-items');
    input.parentNode.append(container);
    for (i = 2; i < array.length; i++) {
      if (
        array[i].substr(0, value.length).toUpperCase() == value.toUpperCase()
        ) {
        matchContainer = document.createElement('div');
        matchContainer.innerHTML =
          '<strong>' + array[i].substr(0, value.length) + '</strong>';
        matchContainer.innerHTML += array[i].substr(value.length);
        matchContainer.innerHTML +=
        "<input type='hidden' value='" + array[i] + "'>";
        matchContainer.addEventListener('click', function (event) {
          input.value = this.getElementsByTagName('input')[0].value;
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

function closeAllLists(element) {
  let autocomplete = document.getElementsByClassName('autocomplete-items');
  for (let i = 0; i < autocomplete.length; i++) {
    if (element != autocomplete[i] && element != input) {
      autocomplete[i].parentNode.removeChild(autocomplete[i]);
    }
  }
}

function createArray(cities) {
  let listOfCities = [];
  for(let i = 0; i < cities.length; i++) {
    listOfCities.push(cities[i].name);
    // console.log(cities[i])
  }
  console.log(listOfCities)
  return listOfCities;

}
function main() {
  let input = document.createElement('input');
  input.classList.add('input');
  input.id = 'myInput';
  let root = document.getElementById('root');
  root.append(input);
  
  input.addEventListener('input', async (event) => {
    let searchQuery = event.target.value;
    let cities = await fetchInput(searchQuery);
    let listOfCities = createArray(cities);
    let fakeArray = ['string', 'string1', 'string2'];
    autocomplete(input, listOfCities);
  });
}

window.addEventListener('load', main);
