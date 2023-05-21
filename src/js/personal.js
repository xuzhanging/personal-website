"use strict";

// import config
import { LOCATION_API_URL, WEATHER_API_URL, API_KEY } from "./config.js";

// select personal loading section
const personalLoadingSection = document.querySelector("#personal-loading");

// select personal page section
const personalPage = document.querySelector("#personal-page");

// select personal page header elements
const personalPageHeader = document.querySelector("#personal-page-header");
const headerTime = document.querySelector("#header-time");
const headerInput = document.querySelector("#header-input");
const headerSearch = document.querySelector("#header-search");

// select personal page main section elements
const personalPageMain = document.querySelector("#personal-page-main");
// banner
const bannerUl = document.querySelector("#banner-ul");

const bannerOl = document.querySelector("#banner-ol");
const bannerLeftBtn = document.querySelector("#banner-left-btn");
const bannerRightBtn = document.querySelector("#banner-right-btn");
// location
const locationDetail = document.querySelector("#location-detail");
const locationMap = document.querySelector("#map");
// weather
const weatherDetail = document.querySelector("#weather-detail");
// to do list
const toDoInput = document.querySelector("#to-do-input");
const toDoList = document.querySelector("#to-do-list");
const doneList = document.querySelector("#done-list");
const toDoCount = document.querySelector("#to-do-count");
const doneCount = document.querySelector("#done-count");

// select aside section elements
const articlesContainer = document.querySelector("#articles");
const orderArticles = document.querySelector("#order-article");

// personal page loading animation finished after 15s, then personal page loading fade out and hidden,personal page fade in
personalLoadingSection.addEventListener("animationend", function () {
  let loadingTimer = setTimeout(function () {
    personalLoadingSection.classList.toggle("hidden");
    personalPage.classList.toggle("hidden");
    personalPage.style.animation = "personal-page-fade-in 5s linear forwards";
    clearTimeout(loadingTimer);
    loadingTimer = null;
  }, 10000);
});

// personalPage.classList.toggle("hidden");
// personalPage.style.opacity = 1;
// personalPage.style.animation = "personal-page-fade-in 0s linear forwards";

// init personal page after personal page animation finished
personalPage.addEventListener("animationend", function () {
  initPersonalPage();
});

// define getCurrentUser function
const getCurrentUser = async function () {
  const token = JSON.parse(localStorage.getItem("currentToken"));
  const res = await fetch("http://127.0.0.1:3007/user/getInfo", {
    headers: {
      Authorization: token,
    },
  });
  const data = await res.json();
  return data;
};

// define format time function
const formatTime = function (timeNumber) {
  return timeNumber < 10 ? "0" + timeNumber : timeNumber;
};

// define render time function
const renderTime = function (userInfo) {
  const dayArr = ["", "周一", "周二", "周三", "周四", "周五", "周六", "周日"];
  const sayHi = function () {
    const now = new Date();
    const year = now.getFullYear();
    const month = formatTime(now.getMonth() + 1);
    const date = formatTime(now.getDate());
    const day = dayArr[Number(formatTime(now.getDay()))];
    const hour = formatTime(now.getHours());
    const minute = formatTime(now.getMinutes());
    const second = formatTime(now.getSeconds());
    return `你好 <span>${
      userInfo.email
    }</span>, 今天是 ${year}-${month}-${date} ${day} ${
      hour > 12 ? "下午" : "上午"
    }${hour}:${minute}:${second}`;
  };
  setInterval(function () {
    headerTime.innerHTML = sayHi();
  }, 1000);
};

// define switch img animation function
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

// define initialize banner funtion
const initBanner = function () {
  // define render current ol li function
  const renderCurrentOlLi = function (num) {
    for (let i = 0; i < bannerOl.children.length; i++) {
      bannerOl.children[i].classList.remove("banner-ol-current-li");
    }
    bannerOl.children[num].classList.add("banner-ol-current-li");
  };
  // dynamic generate ol li depend on the number of ul li
  const bannerImgWidth = bannerUl.children[0].offsetWidth;
  const bannerImgNumber = bannerUl.children.length;
  let num = 0;
  for (let i = 0; i < bannerImgNumber; i++) {
    const li = document.createElement("li");
    bannerOl.appendChild(li);
    li.setAttribute("index", i);
    li.addEventListener("click", function () {
      let index = this.getAttribute("index");
      num = Number(index);
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
  // click switch
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

// define get weather data function
const getWeatherData = async function (longitude, latitude) {
  try {
    const resWeather = await fetch(
      `${WEATHER_API_URL}location=${longitude},${latitude}&key=${API_KEY}`
    );
    const dataWeather = await resWeather.json();
    if (dataWeather.code !== "200") {
      throw new Error(`出现了一些错误，无法获取天气数据，请再次尝试！`);
    }
    const resLocation = await fetch(
      `${LOCATION_API_URL}location=${longitude},${latitude}&key=${API_KEY}`
    );
    const dataLocation = await resLocation.json();
    if (dataLocation.code !== "200") {
      throw new Error(`出现了一些错误，无法获取天气数据，请再次尝试！`);
    }
    const locationHTML = `当前位置：${dataLocation.location[0].country} ${dataLocation.location[0].adm1} ${dataLocation.location[0].adm2} ${dataLocation.location[0].name}`;
    const weatherHTML = `
    <ul>
      <li class="weather-icon">
        <div class="value"><i class="qi-${dataWeather.now.icon}"></i></div>
      </li>
      <li class="weather-text">
        <div class="value">${dataWeather.now.text}</div>
      </li>
      <li class="weather-temp">
        <div class="property">温度</div>
        <div class="value">${dataWeather.now.temp}℃</div>
      </li>
      <li class="weather-windDir">
        <div class="property">风向</div>
        <div class="value">${dataWeather.now.windDir}</div>
      </li>
      <li class="weather-windScale">
        <div class="property">风力等级</div>
        <div class="value">${dataWeather.now.windScale}</div>
      </li>
      <li class="weather-windSpeed">
        <div class="property">风速</div>
        <div class="value">${dataWeather.now.windSpeed}公里/小时</div>
      </li>
      <li class="weather-humidity">
        <div class="property">相对湿度</div>
        <div class="value">${dataWeather.now.humidity}%</div>
      </li>
      <li class="weather-cloud">
        <div class="property">云量</div>
        <div class="value">${dataWeather.now.cloud}</div>
      </li>
      <li class="weather-pressure">
        <div class="property">气压</div>
        <div class="value">${dataWeather.now.pressure}百帕</div>
      </li>
    </ul>
    `;
    locationDetail.textContent = locationHTML;
    weatherDetail.textContent = "";
    weatherDetail.insertAdjacentHTML("afterbegin", weatherHTML);
  } catch (err) {
    weatherDetail.textContent = err.message;
  }
};

// define render map and weather function
const renderMapAndWeather = function () {
  let latitude = null;
  let longitude = null;
  if (!navigator.geolocation) return alert(`Can't use navigator.geolocation`);
  navigator.geolocation.getCurrentPosition(
    // get position success
    function (position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      console.log(latitude, longitude);
      const map = L.map("map").setView([30.4670707, 114.4289312], 15);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      const marker = L.marker([30.4670707, 114.4289312]).addTo(map);
      // render weather
      latitude = Number(latitude.toFixed(2));
      longitude = Number(longitude.toFixed(2));
      latitude = 30.47;
      longitude = 114.43;
      getWeatherData(longitude, latitude);
    },
    // get position failed
    function () {
      alert(`无法获取当前位置，请再次尝试！`);
    }
  );
};

// define init todolist function
const initToDoList = function () {
  const getFromLocalStorage = function (key) {
    const localStorageData = localStorage.getItem(key);
    if (localStorageData !== null) {
      return JSON.parse(localStorageData);
    } else {
      return [];
    }
  };
  const saveToLocalStorage = function (data) {
    localStorage.setItem("toDoList", JSON.stringify(data));
  };
  const renderToDoList = function (key) {
    const dataArr = getFromLocalStorage(key);
    toDoList.textContent = "";
    doneList.textContent = "";
    let toDoCounts = 0;
    let doneCounts = 0;
    dataArr.forEach((data, index) => {
      if (data.isDone) {
        doneCounts++;
        const ulHTML = `<li index='${
          doneCounts - 1
        }'><input type='checkbox' checked='checked' index='${index}'><span>${
          data.title
        }</span><a href='javascript:;' index='${index}'>×</a></li>`;
        doneList.insertAdjacentHTML("beforeend", ulHTML);
      } else {
        toDoCounts++;
        const olHTML = `<li index='${
          toDoCounts - 1
        }'><input type='checkbox' index='${index}'><span>${
          data.title
        }</span><a href='javascript:;' index='${index}'>×</a></li>`;
        toDoList.insertAdjacentHTML("beforeend", olHTML);
      }
    });
    toDoCount.textContent = toDoCounts;
    doneCount.textContent = doneCounts;
  };
  renderToDoList("toDoList");
  toDoInput.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
      if (toDoInput.value.trim() === "") {
        alert("请输入有效的内容！");
      } else {
        let dataArr = getFromLocalStorage("toDoList");
        dataArr.push({
          title: toDoInput.value.trim(),
          isDone: false,
        });
        saveToLocalStorage(dataArr);
        renderToDoList("toDoList");
        toDoInput.value = "";
      }
    }
  });
  [toDoList, doneList].forEach((ele) => {
    ele.addEventListener("click", function (e) {
      if (
        e.target ===
        this.querySelectorAll("li")[
          e.target.closest("li").getAttribute("index")
        ].querySelector("input")
      ) {
        let dataArr = getFromLocalStorage("toDoList");
        dataArr[e.target.getAttribute("index")].isDone = e.target.checked;
        saveToLocalStorage(dataArr);
        renderToDoList("toDoList");
      } else if (
        e.target ===
        this.querySelectorAll("li")[
          e.target.closest("li").getAttribute("index")
        ].querySelector("a")
      ) {
        let dataArr = getFromLocalStorage("toDoList");
        dataArr.splice(e.target.getAttribute("index"), 1);
        saveToLocalStorage(dataArr);
        renderToDoList("toDoList");
      }
    });
  });
};

// define personal page header sticky fucntion
const stickyHeader = function () {
  const obs = new IntersectionObserver(
    function (entries) {
      const ent = entries[0];
      if (ent.isIntersecting === false) {
        personalPageHeader.classList.add("sticky");
        personalPageMain.classList.add("sticky-margin-top");
      }
      if (ent.isIntersecting === true) {
        personalPageHeader.classList.remove("sticky");
        personalPageMain.classList.remove("sticky-margin-top");
      }
    },
    {
      // In the viewport
      root: null,
      threshold: 0,
      rootMargin: "-18px",
    }
  );
  obs.observe(personalPageMain);
};

// define render banner articles function(get top 4 hot articles)
const renderBannerArticle = async function () {
  const res = await fetch("http://127.0.0.1:3007/article/getAll", {
    headers: {
      Authorization: JSON.parse(localStorage.getItem("currentToken")),
    },
  });
  const data = await res.json();
  const articleData = data.data;
  console.log(articleData);
  articleData.forEach((article, index) => {
    // bannerUl.querySelectorAll("li")[index].querySelector("p").textContent =
    //   article.title;
    bannerUl
      .querySelectorAll("li")
      [index].querySelector(".banner-article-title").textContent =
      article.title;
    bannerUl
      .querySelectorAll("li")
      [index].querySelector(
        ".banner-article-hot"
      ).textContent = `当前文章热度：${article.hot}`;
    bannerUl
      .querySelectorAll("li")
      [index].setAttribute("article-id", article.articleid);
    bannerUl
      .querySelectorAll("li")
      [index].addEventListener("click", function (e) {
        clickBannerArticle(e);
      });
  });
  const length1 = bannerUl.querySelectorAll("li").length;
  // bannerUl.querySelectorAll("li")[length1 - 1].querySelector("p").textContent =
  //   articleData[0].title;
  bannerUl
    .querySelectorAll("li")
    [length1 - 1].querySelector(".banner-article-title").textContent =
    articleData[0].title;
  bannerUl
    .querySelectorAll("li")
    [length1 - 1].querySelector(
      ".banner-article-hot"
    ).textContent = `当前文章热度：${articleData[0].hot}`;
  bannerUl
    .querySelectorAll("li")
    [length1 - 1].setAttribute("article-id", articleData[0].articleid);
  bannerUl
    .querySelectorAll("li")
    [length1 - 1].addEventListener("click", function (e) {
      clickBannerArticle(e);
    });
};

// define get current user's all articles
const getCurrentUserAllArticles = async function (order) {
  const res = await fetch(
    `http://127.0.0.1:3007/article/getCurrentAll?order=${order}`,
    {
      headers: {
        Authorization: JSON.parse(localStorage.getItem("currentToken")),
      },
    }
  );
  const data = await res.json();
  if (data.status !== 0) return alert(data.message);
  const articleData = data.data;
  // get article data success, then render article data
  let htmlArr = [];
  articleData.forEach((article) => {
    const html = `
    <li class="article-item" article-id=${article.articleid}>
      <a href="javascript:;" class="article-pic">
        <div class="img-container">
          <div class="item-article-title">${article.title}</div>
        </div>
        <div class="article-hot">
          <div class="renqi">
            <span class="iconfont icon-renqiredu"></span>
            <span>${article.hot}</span>
          </div>
          
        </div>
        <p>${article.title}</p>
      </a>
      <ol>
        <li class="article-author">
          <a href="javascript:;">
            <span class="iconfont icon-zuozhe"></span>
            <span>${article.author}</span>
          </a>
        </li>
        <li class="article-time">
          <span class="iconfont icon-shijian"></span>
          <span>${article.publishTime}</span>
        </li>
      </ol>
    </li>`;
    htmlArr.push(html);
  });
  articlesContainer.innerHTML = htmlArr.join("");
  articlesContainer.addEventListener("click", function (e) {
    if (!e.target.closest(".article-item")) return;
    const articleID = e.target
      .closest(".article-item")
      .getAttribute("article-id");
    localStorage.setItem("clickedArticle", JSON.stringify(articleID));
    window.open("../html/article.html");
  });
};

// define order articles function
const initOrderArticles = function (orderFlag) {
  orderArticles.addEventListener("click", function (e) {
    e.preventDefault();
    getCurrentUserAllArticles(orderFlag);
    orderFlag = orderFlag === "publishTime" ? "hot" : "publishTime";
    this.textContent = `按照文章${
      orderFlag === "hot" ? "热度" : "发布时间"
    }排序`;
  });
};

// define listen header search function
const initHeaderSearch = function () {
  headerSearch.addEventListener("click", function (e) {
    e.preventDefault();
    if (headerInput.value.trim() === "") return alert("搜索输入不能为空！");
    localStorage.setItem("search", JSON.stringify(headerInput.value.trim()));
    window.open("../html/searchResult.html");
  });
};

// define click banner article function
const clickBannerArticle = function (e) {
  if (!e.target.closest(".banner-article")) return;
  const articleID = e.target
    .closest(".banner-article")
    .getAttribute("article-id");
  localStorage.setItem("clickedArticle", JSON.stringify(articleID));
  window.open("../html/article.html");
};

// define init whole personal page function
const initPersonalPage = async function () {
  // get current user information
  const userInfo = await getCurrentUser();

  // render website page title using current user information
  document.title = `${userInfo.email}的个人网站`;

  // render header time
  renderTime(userInfo);

  // render banner
  initBanner();

  // render map and weather
  renderMapAndWeather();

  // render todolist
  initToDoList();

  // render personal page header sticky
  stickyHeader();

  // render banner article
  renderBannerArticle();

  // render current user's all articles
  getCurrentUserAllArticles("publishTime");

  // init order articles
  let orderFlag = "hot";
  initOrderArticles(orderFlag);

  // init header search
  initHeaderSearch();
};

// initPersonalPage();
