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
const welcomeNav = document.querySelector("#welcome-nav");
const description = document.querySelector("#main-description");

// loading animation finished, then loading section fade out.
blackMoon.addEventListener("animationend", function () {
  setTimeout(function () {
    loading.style.animation = "loading-fade-out 3s linear forwards";
  }, 2000);
});

// then welcome section fade in.
setTimeout(function () {
  loading.style.display = "none";
  welcome.classList.toggle("hidden");
  welcome.style.animation = "welcome-fade-in 2s linear forwards";
}, 11000);

// const events = ["click"];
// events.forEach((e) => {
//   btnLogin.addEventListener(e, function (e) {
//     e.preventDefault();
//     loginSection.classList.add("hidden");
//   });
// });

// nav sticky
const obs = new IntersectionObserver(
  function (entries) {
    const ent = entries[0];
    if (ent.isIntersecting === false) {
      welcomeNav.classList.add("sticky");
      description.classList.add("sticky-margin-top");
    }
    if (ent.isIntersecting === true) {
      welcomeNav.classList.remove("sticky");
      description.classList.remove("sticky-margin-top");
    }
  },
  {
    // In the viewport
    root: null,
    threshold: 0,
    rootMargin: "-18px",
  }
);
obs.observe(description);
