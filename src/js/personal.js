"use strict";

import { LOCATION_API_URL, WEATHER_API_URL, API_KEY } from "./config.js";

// select personal loading section
const personalLoadingSection = document.querySelector("#personal-loading");

// select personal page section
const personalPage = document.querySelector("#personal-page");

// select personal page header elements
const headerTime = document.querySelector("#header-time");

// select personal page main section elements
// banner
const bannerUl = document.querySelector("#banner-ul");
const bannerOl = document.querySelector("#banner-ol");
const bannerLeftBtn = document.querySelector("#banner-left-btn");
const bannerRightBtn = document.querySelector("#banner-right-btn");
// location
const locationMap = document.querySelector("#map");
// weather
const weather = document.querySelector("#weather");
const locationDetail = document.querySelector("#location-detail");
const weatherDetail = document.querySelector("#weather-detail");
// to do list
const toDoInput = document.querySelector("#to-do-input");
const toDoList = document.querySelector("#to-do-list");
const doneList = document.querySelector("#done-list");
const toDoCount = document.querySelector("#to-do-count");
const doneCount = document.querySelector("#done-count");

// personal page loading animation finished after 10s, then personal page loading fade out and hidden,personal page fade in
personalLoadingSection.addEventListener("animationend", function () {
  let loadingTimer = setTimeout(function () {
    personalLoadingSection.classList.toggle("hidden");
    personalPage.classList.toggle("hidden");
    personalPage.style.animation = "personal-page-fade-in 5s linear forwards";
    clearTimeout(loadingTimer);
    loadingTimer = null;
  }, 5000);
});

// personalPage.classList.toggle("hidden");
// personalPage.style.opacity = 1;
// personalPage.style.animation = "personal-page-fade-in 0s linear forwards";

// init personal page after personal page animation finished
personalPage.addEventListener("animationend", function () {
  initPersonalPage();
});

const initPersonalPage = function () {
  // render header time
  const dayArr = [
    "",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const formatTime = function (timeNumber) {
    return timeNumber < 10 ? "0" + timeNumber : timeNumber;
  };
  const sayHi = function () {
    const now = new Date();
    const year = now.getFullYear();
    const month = formatTime(now.getMonth() + 1);
    const date = formatTime(now.getDate());
    const day = dayArr[Number(formatTime(now.getDay()))];
    const hour = formatTime(now.getHours());
    const minute = formatTime(now.getMinutes());
    const second = formatTime(now.getSeconds());
    return `hi~ today is ${year}-${month}-${date} ${day} ${
      hour > 12 ? "PM" : "AM"
    }${hour}:${minute}:${second}`;
  };
  const sayHiTimer = setInterval(function () {
    headerTime.textContent = sayHi();
  }, 1000);

  // banner
  // dynamic generate ol li depend on the number of ul li
  const bannerImgWidth = bannerUl.children[0].offsetWidth;
  const bannerImgNumber = bannerUl.children.length;
  let num = 0;
  for (let i = 0; i < bannerImgNumber; i++) {
    const li = document.createElement("li");
    bannerOl.appendChild(li);
    li.setAttribute("index", i);
    li.addEventListener("click", function () {
      let index = this.getAttribute("index");
      num = Number(index);
      renderCurrentOlLi(index);
      animation(bannerUl, -index * bannerImgWidth);
    });
    if (i === 0) {
      li.classList.add("banner-ol-current-li");
    }
  }
  // copy the first img to the end for perfect switch
  const lastLi = bannerUl.children[0].cloneNode(true);
  bannerUl.appendChild(lastLi);
  // define animation function to switch img
  const animation = function (obj, target, callback) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
      if (obj.offsetLeft === target) {
        clearInterval(obj.timer);
        obj.timer = null;
        callback && callback();
      }
      let step =
        (target - obj.offsetLeft) / 10 > 0
          ? Math.ceil((target - obj.offsetLeft) / 10)
          : Math.floor((target - obj.offsetLeft) / 10);
      obj.style.left = obj.offsetLeft + step + "px";
    }, 15);
  };
  // click switch
  const renderCurrentOlLi = function (num) {
    for (let i = 0; i < bannerOl.children.length; i++) {
      bannerOl.children[i].classList.remove("banner-ol-current-li");
    }
    bannerOl.children[num].classList.add("banner-ol-current-li");
  };
  bannerRightBtn.addEventListener("click", function () {
    num++;
    if (num === bannerImgNumber + 1) {
      bannerUl.style.left = "0" + "px";
      renderCurrentOlLi(0);
      num = 1;
      animation(bannerUl, -bannerImgWidth * num);
      renderCurrentOlLi(num);
    } else if (num === bannerImgNumber) {
      animation(bannerUl, -bannerImgWidth * num);
      renderCurrentOlLi(0);
    } else {
      animation(bannerUl, -bannerImgWidth * num);
      renderCurrentOlLi(num);
    }
  });
  bannerLeftBtn.addEventListener("click", function () {
    num--;
    if (num === -1) {
      bannerUl.style.left = -bannerImgWidth * bannerImgNumber + "px";
      renderCurrentOlLi(0);
      num = bannerImgNumber - 1;
      animation(bannerUl, -bannerImgWidth * num);
      renderCurrentOlLi(num);
    } else {
      animation(bannerUl, -bannerImgWidth * num);
      renderCurrentOlLi(num);
    }
  });
  // auto switch
  let timer = setInterval(function () {
    bannerRightBtn.click();
  }, 3000);
  // stop auto switch when mouse enter
  bannerUl.addEventListener("mouseenter", function () {
    clearInterval(timer);
    timer = null;
  });
  // start auto switch when mouse leave
  bannerUl.addEventListener("mouseleave", function () {
    timer = setInterval(function () {
      bannerRightBtn.click();
    }, 3000);
  });
  // get current position
  let latitude = null;
  let longitude = null;
  if (!navigator.geolocation) return alert(`Can't use navigator.geolocation`);
  navigator.geolocation.getCurrentPosition(
    // get position success
    function (position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      const map = L.map("map").setView([latitude, longitude], 15);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      const marker = L.marker([latitude, longitude]).addTo(map);
      // render weather
      latitude = Number(latitude.toFixed(2));
      longitude = Number(longitude.toFixed(2));
      getWeatherData(longitude, latitude);
    },
    // get position failed
    function () {
      alert(`Can't get the position, please try again`);
    }
  );

  // to do list
  renderToDoList("toDoList");
  toDoInput.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
      if (toDoInput.value.trim() === "") {
        alert("Please input valid content!");
      } else {
        let dataArr = getFromLocalStorage("toDoList");
        dataArr.push({
          title: toDoInput.value.trim(),
          isDone: false,
        });
        saveToLocalStorage(dataArr);
        renderToDoList("toDoList");
        toDoInput.value = "";
      }
    }
  });
  [toDoList, doneList].forEach((ele) => {
    ele.addEventListener("click", function (e) {
      if (
        e.target ===
        this.querySelectorAll("li")[
          e.target.closest("li").getAttribute("index")
        ].querySelector("input")
      ) {
        let dataArr = getFromLocalStorage("toDoList");
        dataArr[e.target.getAttribute("index")].isDone = e.target.checked;
        saveToLocalStorage(dataArr);
        renderToDoList("toDoList");
      } else if (
        e.target ===
        this.querySelectorAll("li")[
          e.target.closest("li").getAttribute("index")
        ].querySelector("a")
      ) {
        let dataArr = getFromLocalStorage("toDoList");
        dataArr.splice(e.target.getAttribute("index"), 1);
        saveToLocalStorage(dataArr);
        renderToDoList("toDoList");
      }
    });
  });
};

const getWeatherData = async function (longitude, latitude) {
  try {
    const resWeather = await fetch(
      `${WEATHER_API_URL}location=${longitude},${latitude}&key=${API_KEY}`
    );
    const dataWeather = await resWeather.json();
    if (dataWeather.code !== "200") {
      throw new Error(
        `Something wrong, can't get weather data, please try again!`
      );
    }

    const resLocation = await fetch(
      `${LOCATION_API_URL}location=${longitude},${latitude}&key=${API_KEY}`
    );
    const dataLocation = await resLocation.json();
    if (dataLocation.code !== "200") {
      throw new Error(
        `Something wrong, can't get weather data, please try again!`
      );
    }
    // console.log(dataLocation.location[0]);
    // console.log(dataWeather);
    const locationHTML = `您所在的位置：${dataLocation.location[0].country} ${dataLocation.location[0].adm1} ${dataLocation.location[0].adm2} ${dataLocation.location[0].name}`;
    const weatherHTML = `
    <ul>
    <li class="weather-temp">
      <div class="property">温度</div>
      <div class="value">${dataWeather.now.temp}℃</div>
    </li>
    <li class="weather-icon">
      <div class="value"><i class="qi-${dataWeather.now.icon}"></i></div>
    </li>
    <li class="weather-text">
      <div class="value">${dataWeather.now.text}</div>
    </li>
    <li class="weather-windDir">
      <div class="property">风向</div>
      <div class="value">${dataWeather.now.windDir}</div>
    </li>
    <li class="weather-windScale">
      <div class="property">风力等级</div>
      <div class="value">${dataWeather.now.windScale}</div>
    </li>
    <li class="weather-windSpeed">
      <div class="property">风速</div>
      <div class="value">${dataWeather.now.windSpeed}公里/小时</div>
    </li>
    <li class="weather-humidity">
      <div class="property">相对湿度</div>
      <div class="value">${dataWeather.now.humidity}</div>
    </li>
    <li class="weather-pressure">
      <div class="property">气压</div>
      <div class="value">${dataWeather.now.pressure}百帕</div>
    </li>
    <li class="weather-cloud">
      <div class="property">云量</div>
      <div class="value">${dataWeather.now.cloud}</div>
    </li>
  </ul>
  `;
    locationDetail.textContent = locationHTML;
    weatherDetail.insertAdjacentHTML("afterbegin", weatherHTML);
  } catch (err) {
    weather.textContent = err.message;
  }
};

const saveToLocalStorage = function (data) {
  localStorage.setItem("toDoList", JSON.stringify(data));
};

const getFromLocalStorage = function (key) {
  const localStorageData = localStorage.getItem(key);
  if (localStorageData !== null) {
    return JSON.parse(localStorageData);
  } else {
    return [];
  }
};

const renderToDoList = function (key) {
  const dataArr = getFromLocalStorage(key);
  toDoList.textContent = "";
  doneList.textContent = "";
  let toDoCounts = 0;
  let doneCounts = 0;
  dataArr.forEach((data, index) => {
    if (data.isDone) {
      doneCounts++;
      const ulHTML = `<li index='${
        doneCounts - 1
      }'><input type='checkbox' checked='checked' index='${index}'><span>${
        data.title
      }</span><a href='javascript:;' index='${index}'>×</a></li>`;
      doneList.insertAdjacentHTML("beforeend", ulHTML);
    } else {
      toDoCounts++;
      const olHTML = `<li index='${
        toDoCounts - 1
      }'><input type='checkbox' index='${index}'><span>${
        data.title
      }</span><a href='javascript:;' index='${index}'>×</a></li>`;
      toDoList.insertAdjacentHTML("beforeend", olHTML);
    }
  });
  toDoCount.textContent = toDoCounts;
  doneCount.textContent = doneCounts;
};

// initPersonalPage();
