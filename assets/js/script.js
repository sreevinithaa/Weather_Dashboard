var userFormEl = document.querySelector("#user-form");

var txtcity = document.querySelector("#txtcity");
const APIKey = "3de2f08a8967b631ca3c2fe4e3450eac";
var WelcomeDiv = document.querySelector("#WelcomeDiv");
function fToC(fahrenheit) {
  var fTemp = fahrenheit;
  var fToCel = ((fTemp - 32) * 5) / 9;
  var message = fToCel.toFixed(2) + "\xB0C.";
  return message;
}
function getWeatherCodeURL(code) {
  return `http://openweathermap.org/img/wn/${code}.png`;
}
function isEmpty(value) {
  return value == undefined || value == null || value.length === 0;
}
var formSubmitHandler = function (event) {
  event.preventDefault();
  console.log("Submit");
  var keyword = txtcity.value.trim();

  if (keyword) {
    var url = `http://api.openweathermap.org/geo/1.0/direct?q=${keyword}&limit=5&appid=${APIKey}`;
    var obj = getCityFromAPI(url);
  }
};
var getWeatherFromAPI = function (lat, lon) {
  var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${APIKey}`;
  main_div.classList.remove("d-none");
  WelcomeDiv.classList.add("d-none");
  console.log(apiUrl);
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
        console.log(data.daily);
        if (data.daily.length > 0) {
          LoadWeatherDetails(data.daily, data.current);
        } else {
          alert("No records found!");
          txtcity.value = "";
          return;
        }
      });
    } else {
      document.location.replace("./index.html");
    }
  });
};

var LoadWeatherDetails = function (data, current) {
  console.log(data);

  if (data.length > 0) {
    var spnCity = document.querySelector("#spnCity");
    var spntemp = document.querySelector("#spntemp");
    var spnWind = document.querySelector("#spnWind");
    var LoadData = document.querySelector("#LoadData");
    LoadData.textContent = "";
    var spnHumidity = document.querySelector("#spnHumidity");
    var spnUV = document.querySelector("#spnUV");

    spnCity.textContent =
      txtcity.value + ` (${moment.unix(current.dt).format("D-M-YYYY")})`;
    const img = document.createElement("img");
    img.setAttribute("src", getWeatherCodeURL(current.weather[0].icon));
    spnCity.appendChild(img);
    spntemp.textContent = fToC(current.temp);
    spnWind.textContent = current.wind_speed + " MPH";
    spnHumidity.textContent = current.humidity + " %";
    spnUV.textContent = current.uvi;
    // console.log(moment.unix(current.dt).format("MMM Do, YYYY, hh:mm:ss"));
    var max_length = data.length > 6 ? 6 : data.length;
    const row = document.createElement("div");
    row.className = "row";
    for (var i = 1; i < max_length; i++) {
      const newDiv = document.createElement("div");
      newDiv.className =
        "bg-primary text-white font-weight-bold border border-dark m-1 rounded col-md-2 col-12";
      const newDiv1 = document.createElement("div");
      const img2 = document.createElement("img");
      img2.setAttribute("src", getWeatherCodeURL(data[i].weather[0].icon));
      const newDiv2 = document.createElement("div");
      const newDiv3 = document.createElement("div");
      const newDiv4 = document.createElement("div");
      const h1 = document.createElement("h5");
      h1.textContent = moment.unix(data[i].dt).format("D-M-YYYY");
      newDiv1.appendChild(h1);
      newDiv.appendChild(newDiv1);
      newDiv2.textContent = `Temp : ${fToC(data[i].temp.max)} `;
      newDiv.appendChild(newDiv2);
      newDiv.appendChild(img2);
      newDiv3.textContent = `Wind : ${data[i].wind_speed} MPH`;
      newDiv.appendChild(newDiv3);
      newDiv4.textContent = `Humid : ${data[i].humidity} %`;
      newDiv.appendChild(newDiv4);
      row.appendChild(newDiv);
    }
    LoadData.appendChild(row);
  }
  return;
};

var getCityFromAPI = function (url) {
  var apiUrl = url;

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        if (data.length > 0) {
          var obj = data[0];
          SaveData(obj.lat, obj.lon);
          getWeatherFromAPI(obj.lat, obj.lon);
          return;
        } else {
          alert("Please enter a valid city to search");
          txtcity.value = "";
          return;
        }
      });
    } else {
      document.location.replace("./index.html");
    }
  });
};
function GetDataFromStorage() {
  var data = localStorage.getItem("Weather_data");

  if (isEmpty(data)) {
    return null;
  } else {
    return JSON.parse(data);
  }
}
function SaveData(lat, lon) {
  var data = localStorage.getItem("Weather_data");
  var main_div = document.querySelector("#main_div");

  if (isEmpty(data)) {
    data = [
      {
        City: txtcity.value,
        Lat: lat,
        Lon: lon,
      },
    ];
    localStorage.setItem("Weather_data", JSON.stringify(data));
  } else {
    var pdata = JSON.parse(data);
    const obj = pdata.find((element) => element.City == txtcity.value);
    if (obj) {
      console.log("Already Exist");
    } else {
      pdata.push({
        City: txtcity.value,
        Lat: lat,
        Lon: lon,
      });
    }
    localStorage.setItem("Weather_data", JSON.stringify(pdata));
  }
  Init();
  return;
}
function LoadDataByCityButtonClick(event) {
  var button = event.target;

  getWeatherFromAPI(
    button.getAttribute("data-lat"),
    button.getAttribute("data-lon")
  );
}
function Init() {
  var storage = GetDataFromStorage();
  if (storage != null) {
    var buttonDiv = document.querySelector("#buttonDiv");
    buttonDiv.textContent = "";
    for (var i = 0; i < storage.length; i++) {
      var button = document.createElement("button");
      button.className = "btn btn-secondary btn-block mt-1";
      button.setAttribute("data-lat", storage[i].Lat);
      button.setAttribute("data-lon", storage[i].Lon);
      button.textContent = storage[i].City;
      button.addEventListener("click", LoadDataByCityButtonClick);
      buttonDiv.appendChild(button);
    }
  }
}
userFormEl.addEventListener("submit", formSubmitHandler);

Init();
