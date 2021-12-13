function fetchInput(searchQuery) {
  return fetch(
    `http://api.weatherapi.com/v1/current.json?key=49a5bf4d558245d9898124939211312&q=${searchQuery}`
  )
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      createCard(data);
    });
}

function createCard(city) {
  console.log(city);
  let dataContainer = document.createElement("div");
  let address = document.createElement("h2");
  address.innerText = city.location.name;
  let tmp = document.createElement("h3");
  tmp.innerText = city.current.temp_c + "°C";
  let sky = document.createElement("h3");
  sky.innerText = city.current.condition.text;
  let icon = document.createElement("img");
  icon.src = city.current.condition.icon;
  let humidity = document.createElement("h3");
  humidity.innerText = city.current.humidity + "%";

  dataContainer.append(address, tmp, sky, icon, humidity);
  root.append(dataContainer);
}

function main() {
  let input = document.createElement("input");
  input.classList.add("input");
  let root = document.getElementById("root");
  root.append(input);

  input.addEventListener("change", function (event) {
    let searchQuery = event.target.value;
    console.log(event);
    fetchInput(searchQuery);
  });
}

window.addEventListener("load", main);
