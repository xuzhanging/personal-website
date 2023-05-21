"use strict";

// select header elements(copy from personal.js)
const personalPageHeader = document.querySelector("#personal-page-header");
const headerTime = document.querySelector("#header-time");

// select favorites elements
const favoritesItems = document.querySelector(".my-favorites-items");

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

// define get each favorite article function
const getEachFavoriteArticle = async function (data, time) {
  const res = await fetch(
    `http://127.0.0.1:3007/article/getSpecifiedOne?articleID=${data}`,
    {
      headers: {
        Authorization: JSON.parse(localStorage.getItem("currentToken")),
      },
    }
  );
  const resData = await res.json();
  console.log(resData);
  let html = `
    <li class="my-favorites-item" article-id=${resData.data[0].articleid}>
        <div class="item-title">${resData.data[0].title}</div>
        <div class="item-time">收藏于 ${time}</div>
    </li>
  `;
  favoritesItems.innerHTML = html + favoritesItems.innerHTML;
};

// define render favorite items function
const renderFavorite = async function (userInfo) {
  const res = await fetch(
    `http://127.0.0.1:3007/favorite/getAllFavorite?user=${userInfo.email}`,
    {
      headers: {
        Authorization: JSON.parse(localStorage.getItem("currentToken")),
      },
    }
  );
  const data = await res.json();
  const datas = data.data;
  if (datas.length === 0) {
    favoritesItems.innerHTML = "暂无收藏";
  } else {
    datas.forEach((data) => {
      getEachFavoriteArticle(data.articleid, data.favoritetime);
    });
  }
};

// define listen each favorite item function
const listenItem = function () {
  favoritesItems.addEventListener("click", function (e) {
    if (!e.target.closest(".my-favorites-item")) return;
    const articleID = e.target
      .closest(".my-favorites-item")
      .getAttribute("article-id");
    localStorage.setItem("clickedArticle", JSON.stringify(articleID));
    window.open("../html/article.html");
  });
};

// define init whole favorite page function
const initFavoritesPage = async function () {
  // get current user information
  const userInfo = await getCurrentUser();

  // render website page title using current user information
  document.title = `${userInfo.email}的收藏`;

  // render header time
  renderTime(userInfo);

  // render favorite items
  renderFavorite(userInfo);

  // add listen to each item
  listenItem();
};

initFavoritesPage();
