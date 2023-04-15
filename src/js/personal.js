"use strict";

// select personal loading section
const personalLoadingSection = document.querySelector("#personal-loading");

// select personal page section
const personalPage = document.querySelector("#personal-page");

// select personal page header elements
const headerTime = document.querySelector("#header-time");

// personal page loading animation finished after 6s, then personal page fade in
setTimeout(function () {
  personalLoadingSection.classList.toggle("hidden");
  personalPage.classList.toggle("hidden");
  personalPage.style.animation = "personal-page-fade-in 5s linear forwards";
}, 11000);

// render header time
const dayArr = [
  "",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
  "星期日",
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
  return `hi~ 今天是${year}年${month}月${date}日 ${day} ${
    hour > 12 ? "下午" : "上午"
  }${hour}:${minute}:${second}`;
};
const sayHiTimer = setInterval(function () {
  headerTime.textContent = sayHi();
}, 1000);
