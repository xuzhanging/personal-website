"use strict";

// select personal page header elements(copy from personal.js)
const personalPageHeader = document.querySelector("#personal-page-header");
const headerTime = document.querySelector("#header-time");
const headerInput = document.querySelector("#header-input");
const headerSearch = document.querySelector("#header-search");

// select search result main section elements
const searchResultMain = document.querySelector(".search-result-main");
const searchResultTip = document.querySelector(".search-result-tip");
const articlesContainer = document.querySelector("#articles");
const orderArticles = document.querySelector("#order-article");

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

// define personal page header sticky fucntion
const stickyHeader = function () {
  const obs = new IntersectionObserver(
    function (entries) {
      const ent = entries[0];
      if (ent.isIntersecting === false) {
        personalPageHeader.classList.add("sticky");
        searchResultMain.classList.add("sticky-margin-top");
      }
      if (ent.isIntersecting === true) {
        personalPageHeader.classList.remove("sticky");
        searchResultMain.classList.remove("sticky-margin-top");
      }
    },
    {
      // In the viewport
      root: null,
      threshold: 0,
      rootMargin: "-18px",
    }
  );
  obs.observe(searchResultMain);
};

// define order articles function
const initOrderArticles = function (orderFlag) {
  orderArticles.addEventListener("click", function (e) {
    e.preventDefault();
    getHeaderSearchResults(
      JSON.parse(localStorage.getItem("search")),
      orderFlag
    );
    orderFlag = orderFlag === "publishTime" ? "hot" : "publishTime";
    this.textContent = `按照文章${
      orderFlag === "hot" ? "热度" : "发布时间"
    }排序`;
  });
};

// define get header search results function
const getHeaderSearchResults = async function (query, order) {
  searchResultTip.innerHTML = `"${query}"的搜索结果`;
  const res = await fetch(
    `http://127.0.0.1:3007/article/getSpecifiedAll?title=${query}&order=${order}`,
    {
      headers: {
        Authorization: JSON.parse(localStorage.getItem("currentToken")),
      },
    }
  );
  const data = await res.json();
  const articleData = data.data;
  if (articleData.length === 0) {
    return (articlesContainer.innerHTML = `抱歉，没有找到任何关于"${query}"的文章`);
  }
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
          <div class="pinglun">
            <span class="iconfont icon-pinglun"></span>
            <span>${article.commentCount}</span>
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

// define listen header search function
const initHeaderSearch = function () {
  headerSearch.addEventListener("click", function (e) {
    e.preventDefault();
    if (headerInput.value.trim() === "") return alert("搜索输入不能为空！");
    localStorage.setItem("search", JSON.stringify(headerInput.value.trim()));
    window.open("../html/searchResult.html");
  });
  getHeaderSearchResults(
    JSON.parse(localStorage.getItem("search")),
    "publishTime"
  );
};

// define init whole search results page function
const initSearchResultPage = async function () {
  // get current user information
  const userInfo = await getCurrentUser();

  // render website page title using current user information
  document.title = `${userInfo.email}的个人网站`;

  // render header time
  renderTime(userInfo);

  // render personal page header sticky
  stickyHeader();

  // init order articles
  let orderFlag = "hot";
  initOrderArticles(orderFlag);

  // init header search
  initHeaderSearch();
};

initSearchResultPage();
