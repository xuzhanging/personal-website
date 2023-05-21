"use strict";

// select header elements(copy from personal.js)
const personalPageHeader = document.querySelector("#personal-page-header");
const headerTime = document.querySelector("#header-time");

// select input elements
const inputTitle = document.querySelector("#publish-title");
const inputContent = document.querySelector("#publish-main");

// select publish button
const publishBtn = document.querySelector("#publish-btn");

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

// define get article publish time function
const articlePublishTime = function () {
  const now = new Date();
  const year = now.getFullYear();
  const month = formatTime(now.getMonth() + 1);
  const date = formatTime(now.getDate());
  const hour = formatTime(now.getHours());
  const minute = formatTime(now.getMinutes());
  const second = formatTime(now.getSeconds());
  return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
};

// define publish handler function
const publishHandler = async function (e, userInfo) {
  e.preventDefault();
  if (inputTitle.value.trim() === "" || inputContent.value.trim() === "")
    return alert("article title or content should not null!");
  const uploadData = {
    title: inputTitle.value.trim(),
    content: inputContent.value.trim(),
    author: userInfo.email,
    publishTime: articlePublishTime(),
  };
  const res = await fetch("http://127.0.0.1:3007/article/publish", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(localStorage.getItem("currentToken")),
    },
    body: JSON.stringify(uploadData),
  });
  const data = await res.json();
  alert(data.message);
  inputTitle.value = "";
  inputContent.value = "";
  window.open("../html/personal.html");
};

// define init whole message page function
const initPublishPage = async function () {
  // get current user information
  const userInfo = await getCurrentUser();

  // render website page title using current user information
  document.title = `${userInfo.email}'s publish page`;

  // render header time
  renderTime(userInfo);

  //listen publish article
  publishBtn.addEventListener("click", function (e) {
    publishHandler(e, userInfo);
  });
};

initPublishPage();
