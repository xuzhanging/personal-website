"use strict";

// select header elements(copy from personal.js)
const personalPageHeader = document.querySelector("#personal-page-header");
const headerTime = document.querySelector("#header-time");

// add time to header(copy from personal.js)
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
