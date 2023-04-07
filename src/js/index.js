"use strict";

const loading = document.querySelector("#loading");
const blackMoon = document.querySelector("#black-moon");
const whiteMoon = document.querySelector("#white-moon");
const loginSection = document.querySelector("#login-section");
const btnLogin = document.querySelector("#btn-login");
const welcome = document.querySelector("#welcome-section");

// 网页进入动画结束后淡出
blackMoon.addEventListener("animationend", function () {
  setTimeout(function () {
    loading.style.animation = "fade 3s linear forwards";
  }, 1000);
});

// 然后欢迎页面浮现
setTimeout(function () {
  loading.style.display = "none";
  welcome.classList.toggle("hidden");
  welcome.style.animation = "fadein 2s linear forwards";
}, 10000);

// const events = ["click"];
// events.forEach((e) => {
//   btnLogin.addEventListener(e, function (e) {
//     e.preventDefault();
//     loginSection.classList.add("hidden");
//   });
// });
