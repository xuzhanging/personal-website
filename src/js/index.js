"use strict";

// select loading section elements
const loading = document.querySelector("#loading-section");
const blackMoon = document.querySelector("#black-moon");
const whiteMoon = document.querySelector("#white-moon");

// select login section elements
const loginSection = document.querySelector("#login-section");
const inputFullName = document.querySelector("#full-name");
const btnLogin = document.querySelector("#btn-login");

// select welcome section elements
const welcome = document.querySelector("#welcome-section");
const welcomeNav = document.querySelector("#welcome-nav");
const navLogin = document.querySelector("#navigation-login");
const description = document.querySelector("#main-description");

// select all links
const links = document.querySelectorAll("a:link");

// select open login links
const buildNow = document.querySelector("#build-your-website");
const tryNow = document.querySelector("#try-it-now");

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

// login button
const loginBtn = [navLogin, buildNow, tryNow];
loginBtn.forEach((login) =>
  login.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    loginSection.classList.toggle("hidden");
    inputFullName.focus();
    welcome.classList.toggle("blur");
    document.body.addEventListener("click", function (e) {
      if (
        !e.target.closest("#login-section") &&
        !loginSection.classList.contains("hidden")
      ) {
        loginSection.classList.toggle("hidden");
        welcome.classList.toggle("blur");
      }
    });
  })
);

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

// section scroll into view
links.forEach((link) =>
  link.addEventListener("click", function (e) {
    const hash = link.getAttribute("href");
    if (hash.startsWith("#")) e.preventDefault();
    if (hash.startsWith("#") && hash !== "#") {
      document.querySelector(hash).scrollIntoView({
        behavior: "smooth",
      });
    }
  })
);
