const tagsContainer = document.getElementById("words-list");
const commentLog = document.getElementById("comments-log");

getAndRenderTags();
getAndRenderLogs();

chrome.storage.local.onChanged.addListener((changes) => {
  if (changes.commentsLog) {
    getAndRenderLogs();
  }
});

function getAndRenderTags() {
  chrome.storage.local.get(["bannedContext"], (result) => {
    tagsContainer.innerHTML = "";
    if (!result) return;

    bannedContext.forEach((context) => {
      renderTag(context);
    });
  });

  function renderTag(tagText) {
    const tagHtml = `
    <span class="tag-text" dir="auto"></span>
    <span class="delete" id="delete">X</span>
    `;

    let element = document.createElement("div");

    element.innerHTML = tagHtml;
    element.classList.add("tag");

    element.setAttribute("title", tagText);
    element.querySelector(".tag-text").textContent = tagText;

    tagsContainer.appendChild(element);
  }
}

function getAndRenderLogs() {
  chrome.storage.local.get(["commentsLog"], (result) => {
    commentLog.innerHTML = "";
    if (!result) return;
    bannedContext.forEach((comment) => {
      renderComment(comment);
    });
  });

  function renderComment(commentData) {
    // { commentText: text, commentUser: user, id: Date.now() };
    const commentElement = document.createElement("div");
    commentElement.classList.add("comment");
    commentElement.dataset.id = commentData.id;
    commentElement.innerHTML = `
      <p class="user" dir="auto"></p>
      <p class="comment-text" dir="auto"></p>
    `;

    commentElement.querySelector(".user").textContent = commentData.commentUser;
    commentElement.querySelector(".comment-text").textContent =
      commentData.commentText;

    commentLog.appendChild(commentElement);
  }
}
