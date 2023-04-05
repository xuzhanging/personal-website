"use strict";

const loginSection = document.querySelector("#login-section");
const btnLogin = document.querySelector(".btn-login");

const events = ["click", "touch"];
events.forEach((e) => {
  btnLogin.addEventListener(e, function (e) {
    e.preventDefault();
    loginSection.classList.add("hidden");
  });
});
// btnLogin.addEventListener("click", function (e) {
//   e.preventDefault();
//   loginSection.classList.add("hidden");
// });
