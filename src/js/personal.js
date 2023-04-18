"use strict";

// select personal loading section
const personalLoadingSection = document.querySelector("#personal-loading");

// select personal page section
const personalPage = document.querySelector("#personal-page");

// select personal page header elements
const headerTime = document.querySelector("#header-time");

// select personal page main section elements
// banner
const bannerUl = document.querySelector("#banner-ul");
const bannerOl = document.querySelector("#banner-ol");
const bannerLeftBtn = document.querySelector("#banner-left-btn");
const bannerRightBtn = document.querySelector("#banner-right-btn");

// personal page loading animation finished after 10s, then personal page loading fade out and hidden,personal page fade in
personalLoadingSection.addEventListener("animationend", function () {
  let loadingTimer = setTimeout(function () {
    personalLoadingSection.classList.toggle("hidden");
    personalPage.classList.toggle("hidden");
    personalPage.style.animation = "personal-page-fade-in 5s linear forwards";
    clearTimeout(loadingTimer);
    loadingTimer = null;
  }, 5000);
});

// init personal page after personal page animation finished
personalPage.addEventListener("animationend", function () {
  initPersonalPage();
});
// personalPage.classList.toggle("hidden");
// personalPage.style.animation = "personal-page-fade-in 0s linear forwards";

const initPersonalPage = function () {
  // render header time
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
    return `hi~ today is ${year}-${month}-${date} ${day} ${
      hour > 12 ? "PM" : "AM"
    }${hour}:${minute}:${second}`;
  };
  const sayHiTimer = setInterval(function () {
    headerTime.textContent = sayHi();
  }, 1000);

  // banner
  // dynamic generate ol li depend on the number of ul li
  const bannerImgWidth = bannerUl.children[0].offsetWidth;
  const bannerImgNumber = bannerUl.children.length;
  for (let i = 0; i < bannerImgNumber; i++) {
    const li = document.createElement("li");
    bannerOl.appendChild(li);
    li.setAttribute("index", i);
    li.addEventListener("click", function () {
      let index = this.getAttribute("index");
      renderCurrentOlLi(index);
      animation(bannerUl, -index * bannerImgWidth);
    });
    if (i === 0) {
      li.classList.add("banner-ol-current-li");
    }
  }
  // copy the first img to the end for perfect switch
  const lastLi = bannerUl.children[0].cloneNode(true);
  bannerUl.appendChild(lastLi);
  // define animation function to switch img
  const animation = function (obj, target, callback) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
      if (obj.offsetLeft === target) {
        clearInterval(obj.timer);
        obj.timer = null;
        callback && callback();
      }
      let step =
        (target - obj.offsetLeft) / 10 > 0
          ? Math.ceil((target - obj.offsetLeft) / 10)
          : Math.floor((target - obj.offsetLeft) / 10);
      obj.style.left = obj.offsetLeft + step + "px";
    }, 15);
  };
  // click switch
  let num = 0;
  const renderCurrentOlLi = function (num) {
    for (let i = 0; i < bannerOl.children.length; i++) {
      bannerOl.children[i].classList.remove("banner-ol-current-li");
    }
    bannerOl.children[num].classList.add("banner-ol-current-li");
  };
  bannerRightBtn.addEventListener("click", function () {
    num++;
    if (num === bannerImgNumber + 1) {
      bannerUl.style.left = "0" + "px";
      renderCurrentOlLi(0);
      num = 1;
      animation(bannerUl, -bannerImgWidth * num);
      renderCurrentOlLi(num);
    } else if (num === bannerImgNumber) {
      animation(bannerUl, -bannerImgWidth * num);
      renderCurrentOlLi(0);
    } else {
      animation(bannerUl, -bannerImgWidth * num);
      renderCurrentOlLi(num);
    }
  });
  bannerLeftBtn.addEventListener("click", function () {
    num--;
    if (num === -1) {
      bannerUl.style.left = -bannerImgWidth * bannerImgNumber + "px";
      renderCurrentOlLi(0);
      num = bannerImgNumber - 1;
      animation(bannerUl, -bannerImgWidth * num);
      renderCurrentOlLi(num);
    } else {
      animation(bannerUl, -bannerImgWidth * num);
      renderCurrentOlLi(num);
    }
  });
  // auto switch
  let timer = setInterval(function () {
    bannerRightBtn.click();
  }, 3000);
  // stop auto switch when mouse enter
  bannerUl.addEventListener("mouseenter", function () {
    clearInterval(timer);
    timer = null;
  });
  // start auto switch when mouse leave
  bannerUl.addEventListener("mouseleave", function () {
    timer = setInterval(function () {
      bannerRightBtn.click();
    }, 3000);
  });
};
