"use strict";

// select header elements(copy from personal.js)
const personalPageHeader = document.querySelector("#personal-page-header");
const headerTime = document.querySelector("#header-time");

// select article elements
const articleTitle = document.querySelector(".article-title");
const articleAuthor = document.querySelector(".article-author");
const articleTime = document.querySelector(".article-time");
const articleRead = document.querySelector(".article-read");
const articleComment = document.querySelector(".article-comment");
const articleFavorite = document.querySelector(".article-favorite");
const articleCenter = document.querySelector(".article-center");

// select comment elements
const publishContent = document.querySelector(".my-comments");
const publishCommentBtn = document.querySelector(".publish-comment");
const otherComment = document.querySelector(".others-comment");
const orderCommentBtn = document.querySelector(".order-comments");

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

// define render article function
const renderArticle = async function (articleID, userInfo) {
  const res = await fetch(
    `http://127.0.0.1:3007/article/getSpecifiedOne?articleID=${articleID}`,
    {
      headers: {
        Authorization: JSON.parse(localStorage.getItem("currentToken")),
      },
    }
  );
  const data = await res.json();
  const articleData = data.data[0];
  articleTitle.textContent = articleData.title;
  articleAuthor.textContent = "作者 " + articleData.author;
  articleTime.textContent = "发布时间 " + articleData.publishTime;
  // articleRead.textContent = "阅读量 " + articleData.readCount;
  // articleComment.textContent = "评论数 " + articleData.commentCount;
  articleCenter.textContent = articleData.content;
  // 是否收藏过该文章
  const res1 = await fetch(
    `http://127.0.0.1:3007/favorite/getFavorite?user=${userInfo.email}&articleid=${articleID}`,
    {
      headers: {
        Authorization: JSON.parse(localStorage.getItem("currentToken")),
      },
    }
  );
  const data1 = await res1.json();
  if (data1.data.length === 1) {
    articleFavorite.textContent = "取消收藏";
    articleFavorite.style.backgroundColor = "#ffe066";
  } else {
    articleFavorite.textContent = "收藏";
    articleFavorite.style.backgroundColor = "";
  }
};

// define get comment publish time function
const commentPublishTime = function () {
  const now = new Date();
  const year = now.getFullYear();
  const month = formatTime(now.getMonth() + 1);
  const date = formatTime(now.getDate());
  const hour = formatTime(now.getHours());
  const minute = formatTime(now.getMinutes());
  const second = formatTime(now.getSeconds());
  return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
};

// define add comment function
const addComment = async function (commentContent, userInfo) {
  const res = await fetch(`http://127.0.0.1:3007/comment/addComment`, {
    method: "POST",
    headers: {
      Authorization: JSON.parse(localStorage.getItem("currentToken")),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      commentContent: commentContent,
      commentAuthor: userInfo.email,
      commentTime: commentPublishTime(),
      belongArticle: JSON.parse(localStorage.getItem("clickedArticle")),
    }),
  });
  const data = await res.json();
  if (data.status === 0) {
    console.log(orderCommentBtn.textContent);
    const order =
      orderCommentBtn.textContent === "查看最早评论" ? "latest" : "earliest";
    getAllComment(order, 0); //0表示渲染完评论后，排序按钮不变
    return alert("评论成功！");
  }
  return alert("评论失败！");
};

// define listen publish comment function
const listenPublishComment = function (userInfo) {
  publishCommentBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const commentContent = publishContent.value.trim();
    if (!commentContent) return alert("评论不能为空！");
    // add valid comment to database
    addComment(commentContent, userInfo);
  });
};

// define get all comments about current article function
const getAllComment = async function (order, flag) {
  const articleID = JSON.parse(localStorage.getItem("clickedArticle"));
  const res = await fetch(
    `http://127.0.0.1:3007/comment/getAllComment?articleid=${articleID}&order=${order}`,
    {
      headers: {
        Authorization: JSON.parse(localStorage.getItem("currentToken")),
      },
    }
  );
  const data = await res.json();
  const comments = data.data;
  let htmlArr = [];
  comments.forEach((comment) => {
    let html = `
    <li class="other-comment-item">
      <span class="other-people">${comment.commentAuthor}</span>
      <span class="other-comment-time">${comment.commentTime}</span>
      <div class="other-comments">${comment.commentContent}</div>
    </li>
    `;
    htmlArr.push(html);
  });
  otherComment.innerHTML = htmlArr.join("");
  if (flag === 1) {
    orderCommentBtn.textContent =
      orderCommentBtn.textContent === "查看最早评论"
        ? "查看最近评论"
        : "查看最早评论";
    orderCommentBtn.style.backgroundColor =
      orderCommentBtn.textContent === "查看最早评论" ? "#00a9f2" : "#ffe066";
  }
};

// define order btn function
const initOrderBtn = function () {
  orderCommentBtn.addEventListener("click", function () {
    const order =
      orderCommentBtn.textContent === "查看最早评论" ? "earliest" : "latest";
    getAllComment(order, 1);
  });
};

// define add favorite to database function
const addFavorite = async function (currentUser, currentArticle, currentTime) {
  const res = await fetch(`http://127.0.0.1:3007/favorite/addFavorite`, {
    method: "POST",
    headers: {
      Authorization: JSON.parse(localStorage.getItem("currentToken")),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: currentUser,
      articleID: currentArticle,
      favoriteTime: currentTime,
    }),
  });
  const data = await res.json();
  if (data.status === 0) {
    articleFavorite.textContent = "取消收藏";
    articleFavorite.style.backgroundColor = "#ffe066";
    return alert("收藏文章成功！");
  } else {
    return alert("收藏文章失败！");
  }
};

// define delete favorite from database function
const deleteFavorite = async function (currentUser, currentArticle) {
  const res = await fetch(
    `http://127.0.0.1:3007/favorite/deleteFavorite?user=${currentUser}&articleid=${currentArticle}`,
    {
      headers: {
        Authorization: JSON.parse(localStorage.getItem("currentToken")),
      },
    }
  );
  const data = await res.json();
  if (data.status === 0) {
    articleFavorite.textContent = "收藏";
    articleFavorite.style.backgroundColor = "";
    return alert("取消收藏成功！");
  } else {
    return alert("取消收藏失败！");
  }
};

// define init favorite btn function
const initFavoriteBtn = function (userInfo) {
  articleFavorite.addEventListener("click", function () {
    const currentUser = userInfo.email;
    const currentArticle = JSON.parse(localStorage.getItem("clickedArticle"));
    if (articleFavorite.textContent === "取消收藏") {
      // 删除收藏
      deleteFavorite(currentUser, currentArticle);
    } else {
      // 添加收藏
      const currentTime = commentPublishTime();
      addFavorite(currentUser, currentArticle, currentTime);
    }
  });
};

// define init whole message page function
const initArticlePage = async function () {
  // get current user information
  const userInfo = await getCurrentUser();

  // render website page title using current user information
  document.title = `article page`;

  // render header time
  renderTime(userInfo);

  // render article
  const articleID = JSON.parse(localStorage.getItem("clickedArticle"));
  renderArticle(articleID, userInfo);

  // render publish comment
  listenPublishComment(userInfo);

  // render all comment
  getAllComment("latest");

  // init order btn
  initOrderBtn();

  // init favorite btn
  initFavoriteBtn(userInfo);
};

initArticlePage();
