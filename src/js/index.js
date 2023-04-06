"use strict";
console.log("hello");
const loading = document.querySelector("#loading");
const blackMoon = document.querySelector("#black-moon");
const whiteMoon = document.querySelector("#white-moon");
blackMoon.addEventListener("animationend", function () {
  setTimeout(function () {
    loading.style.animation = "fade 3s linear forwards";
  }, 2000);
});

// const loginSection = document.querySelector("#login-section");
// const btnLogin = document.querySelector(".btn-login");

// const events = ["click"];
// events.forEach((e) => {
//   btnLogin.addEventListener(e, function (e) {
//     // e.preventDefault();
//     loginSection.classList.add("hidden");
//   });
// });
// btnLogin.addEventListener("click", function (e) {
//   e.preventDefault();
//   loginSection.classList.add("hidden");
// });
