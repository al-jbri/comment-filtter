// --- Observer Configuration ---
const obconfig = { attributes: false, childList: true, subtree: true };
const observer = new MutationObserver(check);
observer.observe(document.body, obconfig);

// --- Regex Setup ---
const bannedContext = ["i use Linux Mint btw", "word2", "word3"];
const scanner = regex(bannedContext);

// Core function to scan and filter comments

function check() {
  const commentsSection = document.querySelector("#comments #contents");
  if (!commentsSection) return;

  const comments = commentsSection.querySelectorAll(
    "ytd-comment-thread-renderer",
  );

  comments.forEach((comment) => {
    // Skip if already scanned
    if (comment.dataset.scanned) return;

    const isPinned = comment.querySelector(
      "#pinned-comment-badge ytd-pinned-comment-badge-renderer",
    );
    const commentText = comment.querySelector("#content-text span");

    // Skip pinned comments
    if (isPinned) {
      comment.dataset.scanned = "true";
      return;
    }

    // Apply regex test and remove if matched
    if (commentText && scanner.test(commentText.textContent)) {
      comment.remove();
    } else {
      comment.dataset.scanned = "true";
    }
  });
}

// Regex Generator - Created by AI
function regex(bannedItems) {
  return new RegExp(
    bannedItems
      .map((item) => {
        return item
          .split(" ")
          .map((word) => {
            return word
              .split("")
              .map((char) => {
                if (/[أإآا]/.test(char)) return "[أإآا]";
                return char;
              })
              .join("[\\u064B-\\u065F]*");
          })
          .join("\\s+");
      })
      .join("|"),
    "gi",
  );
}
