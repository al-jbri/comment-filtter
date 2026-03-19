// DOM elements for tags and comment log
const tagsContainer = document.getElementById("words-list");
const commentLog = document.getElementById("comments-log");

// Form elements
const addForm = document.getElementById("add-to-blocklist");
const addFormText = document.getElementById("word-input");

// Initial render
getAndRenderTags();
getAndRenderLogs();

// Listen for changes in storage and update logs
chrome.storage.local.onChanged.addListener((changes) => {
  if (changes.commentsLog) {
    getAndRenderLogs();
  }
});

// Handle new word submission
addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addToBlockList(addFormText.value);
  addFormText.value = "";
});

// Handle tag deletion
tagsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    removeFromBlockList(
      e.target.closest(".tag").querySelector(".tag-text").textContent,
    );
  }
});

// Fetch banned words from storage and display them
function getAndRenderTags() {
  chrome.storage.local.get(["bannedContext"], (result) => {
    tagsContainer.textContent = "";
    let list = result.bannedContext;
    if (!list) return;

    list.forEach((context) => {
      renderTag(context);
    });
  });

  // Render a single tag
  function renderTag(tagText) {
    let element = document.createElement("div");
    element.classList.add("tag");
    element.setAttribute("title", tagText);

    // Create the tag text span
    let spanText = document.createElement("span");
    spanText.classList.add("tag-text");
    spanText.setAttribute("dir", "auto");
    spanText.textContent = tagText;

    // Create the delete button span
    let spanDelete = document.createElement("span");
    spanDelete.classList.add("delete");
    spanDelete.textContent = "X";

    // Append spans to the main div
    element.appendChild(spanText);
    element.appendChild(spanDelete);

    tagsContainer.appendChild(element);
  }
}

// Fetch comment logs from storage and display them
function getAndRenderLogs() {
  chrome.storage.local.get(["commentsLog"], (result) => {
    commentLog.textContent = "";
    let list = result.commentsLog;
    if (!list) return;

    list.forEach((comment) => {
      renderComment(comment);
    });
  });

  // Render a single comment
  function renderComment(commentData) {
    const commentElement = document.createElement("div");
    commentElement.classList.add("comment");

    // Create the user paragraph
    const userPara = document.createElement("p");
    userPara.classList.add("user");
    userPara.setAttribute("dir", "auto");
    userPara.textContent = commentData.user;

    // Create the comment text paragraph
    const textPara = document.createElement("p");
    textPara.classList.add("comment-text");
    textPara.setAttribute("dir", "auto");
    textPara.textContent = commentData.text;

    // Append paragraphs to the main div
    commentElement.appendChild(userPara);
    commentElement.appendChild(textPara);

    commentLog.appendChild(commentElement);
  }
}

// Add a word to banned list if not already present
function addToBlockList(text) {
  chrome.storage.local.get(["bannedContext"], (result) => {
    let list = result.bannedContext || [];

    if (list.includes(text)) return;
    list.push(text);
    chrome.storage.local.set({ bannedContext: list }, () => getAndRenderTags());
  });
}

// Remove a word from banned list
function removeFromBlockList(tagText) {
  chrome.storage.local.get(["bannedContext"], (result) => {
    let list = result.bannedContext.filter((i) => {
      return i !== tagText;
    });

    chrome.storage.local.set({ bannedContext: list }, () => getAndRenderTags());
  });
}
