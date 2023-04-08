"use strict";

// select loading section elements
const loading = document.querySelector("#loading-section");
const blackMoon = document.querySelector("#black-moon");
const whiteMoon = document.querySelector("#white-moon");

// select login section elements
// const loginSection = document.querySelector("#login-section");
// const btnLogin = document.querySelector("#btn-login");

// select welcome section elements
const welcome = document.querySelector("#welcome-section");

// loading animation finished, then loading section fade out.
blackMoon.addEventListener("animationend", function () {
  setTimeout(function () {
    loading.style.animation = "loading-fade-out 3s linear forwards";
  }, 1000);
});

// then welcome section fade in.
setTimeout(function () {
  loading.style.display = "none";
  welcome.classList.toggle("hidden");
  welcome.style.animation = "welcome-fade-in 2s linear forwards";
}, 10000);

// const events = ["click"];
// events.forEach((e) => {
//   btnLogin.addEventListener(e, function (e) {
//     e.preventDefault();
//     loginSection.classList.add("hidden");
//   });
// });
