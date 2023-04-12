"use strict";

// select loading section elements
const loading = document.querySelector("#loading-section");
const blackMoon = document.querySelector("#black-moon");
const whiteMoon = document.querySelector("#white-moon");

// select login section elements
const loginSection = document.querySelector("#login-section");
const inputFullName = document.querySelector("#full-name");
const loginInputPassword = document.querySelector("#login-password");
const eyes = document.querySelectorAll("#eye");
const forgotPassword = document.querySelector("#forgot-password");
const btnLogin = document.querySelector("#btn-login");
const loginSignup = document.querySelector("#login-sign-up");

// select sign up section elements
const signupSection = document.querySelector("#sign-up-section");
const inputMail = document.querySelector("#email");
const signupInputPassword = document.querySelector("#signup-password");
const signupLogin = document.querySelector("#sign-up-login");

// select welcome section elements
const welcome = document.querySelector("#welcome-section");
const welcomeNav = document.querySelector("#welcome-nav");
const navLogin = document.querySelector("#navigation-login");
const description = document.querySelector("#main-description");
const scrollToTop = document.querySelector("#scroll-to-top");

// select all links
const links = document.querySelectorAll("a:link");

// select open login links
const buildNow = document.querySelector("#build-your-website");
const tryNow = document.querySelector("#try-it-now");

// select footer links
const footerCreateAccount = document.querySelector("#footer-create-account");
const footerLogin = document.querySelector("#footer-sign-in");

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
const loginBtn = [navLogin, buildNow, tryNow, footerCreateAccount, footerLogin];
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

// display or hidden password
eyes.forEach((eye) => {
  eye.addEventListener("click", function (e) {
    e.stopPropagation();
    eye.classList.toggle("icon-yanjing_bi");
    eye.classList.toggle("icon-yanjing_kai");
    if (eye.classList.contains("icon-yanjing_bi")) {
      this.parentElement.previousElementSibling.type = "password";
    } else {
      this.parentElement.previousElementSibling.type = "text";
    }
  });
});

// forgot password
forgotPassword.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();
  // TODO
});

// sign up in login section
loginSignup.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();
  inputFullName.value = "";
  loginInputPassword.value = "";
  loginSection.classList.toggle("hidden");
  signupSection.classList.toggle("hidden");
  inputMail.focus();
});

// log in in sign section
signupLogin.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();
  inputMail.value = "";
  signupInputPassword.value = "";
  signupSection.classList.toggle("hidden");
  loginSection.classList.toggle("hidden");
  inputFullName.focus();
});

// nav sticky and scroll-to-top sticky
let scroll_to_top = false;
const obs = new IntersectionObserver(
  function (entries) {
    const ent = entries[0];
    if (ent.isIntersecting === false) {
      welcomeNav.classList.add("sticky");
      description.classList.add("sticky-margin-top");
      scrollToTop.classList.remove("hidden");
      scrollToTop.classList.add("scroll-to-top");
      scroll_to_top = true;
    }
    if (ent.isIntersecting === true) {
      welcomeNav.classList.remove("sticky");
      description.classList.remove("sticky-margin-top");
      if (scroll_to_top) {
        scrollToTop.classList.toggle("hidden");
        scrollToTop.classList.remove("scroll-to-top");
      }
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

// scroll to top
scrollToTop.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
