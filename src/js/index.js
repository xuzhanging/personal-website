"use strict";

/*
 **************************
 *****loading aniamtion****
 **************************
 */
const loading = document.querySelector("#loading");
const blackMoon = document.querySelector("#black-moon");
const whiteMoon = document.querySelector("#white-moon");
const loginSection = document.querySelector("#login-section");
const btnLogin = document.querySelector("#btn-login");

blackMoon.addEventListener("animationend", function () {
  setTimeout(function () {
    loading.style.animation = "fade 3s linear forwards";
  }, 1000);
});
setTimeout(function () {
  loading.style.display = "none";
  loginSection.classList.toggle("hidden");
}, 10000);

// const events = ["click"];
// events.forEach((e) => {
//   btnLogin.addEventListener(e, function (e) {
//     e.preventDefault();
//     loginSection.classList.add("hidden");
//   });
// });
