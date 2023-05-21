"use strict";

// select header elements(copy from personal.js)
const personalPageHeader = document.querySelector("#personal-page-header");
const headerTime = document.querySelector("#header-time");

// define getCurrentUser function
const getCurrentUser = async function () {
  const token = JSON.parse(localStorage.getItem("currentToken"));
  const res = await fetch("http://127.0.0.1:3007/user/getInfo", {
    headers: {
      Authorization: token,
    },
  });
  const data = await res.json();
  return data;
};

// define format time function
const formatTime = function (timeNumber) {
  return timeNumber < 10 ? "0" + timeNumber : timeNumber;
};

// define render time function
const renderTime = function (userInfo) {
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
  const sayHi = function () {
    const now = new Date();
    const year = now.getFullYear();
    const month = formatTime(now.getMonth() + 1);
    const date = formatTime(now.getDate());
    const day = dayArr[Number(formatTime(now.getDay()))];
    const hour = formatTime(now.getHours());
    const minute = formatTime(now.getMinutes());
    const second = formatTime(now.getSeconds());
    return `hi <span>${
      userInfo.email
    }</span>, today is ${year}-${month}-${date} ${day} ${
      hour > 12 ? "PM" : "AM"
    }${hour}:${minute}:${second}`;
  };
  setInterval(function () {
    headerTime.innerHTML = sayHi();
  }, 1000);
};

// define init whole message page function
const initMomentsPage = async function () {
  // get current user information
  const userInfo = await getCurrentUser();

  // render website page title using current user information
  document.title = `${userInfo.email}'s moments page`;

  // render header time
  renderTime(userInfo);
};

initMomentsPage();
