/* ================================
   CONFIG
================================ */
const GAS_URL = "https://script.google.com/macros/s/AKfycbxcwFHb-UU_TNZ44XV2g7Prn_N_ste9PXdfDUA9_UuW08TNZzM_pYmKpEo5bJJcLB8LXw/exec";

/* ================================
   INJECT CHATBOT HTML
================================ */
document.body.insertAdjacentHTML("beforeend", `
<div id="chatbot-btn" title="Chat Assistant">💬</div>

<div id="chatbot-box">
  <div id="chatbot-header">Railway Assistant</div>

  <!-- FAQ MENU -->
  <div id="chatbot-faq"></div>

  <!-- CHAT MESSAGES -->
  <div id="chatbot-messages"></div>

  <!-- INPUT -->
  <div id="chatbot-input">
    <input id="chat-input" placeholder="Type your question..." />
    <button id="chat-send-btn">Send</button>
  </div>
</div>
`);

/* ================================
   TOGGLE CHAT WINDOW
================================ */
document.getElementById("chatbot-btn").onclick = () => {
  const box = document.getElementById("chatbot-box");
  box.style.display = box.style.display === "flex" ? "none" : "flex";
};

/* ================================
   MESSAGE HANDLER
================================ */
function addMessage(text, from = "Bot") {
  const div = document.createElement("div");
  div.style.marginBottom = "8px";
  div.innerHTML = `<b>${from}:</b> ${text}`;
  document.getElementById("chatbot-messages").appendChild(div);

  // auto scroll
  div.scrollIntoView({ behavior: "smooth" });
}

/* ================================
   SEND USER QUERY
================================ */
function sendQuery() {
  const input = document.getElementById("chat-input");
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "You");
  input.value = "";

  fetch(`${GAS_URL}?q=${encodeURIComponent(text)}`)
    .then(res => res.json())
    .then(data => {
      data.forEach(item => {
        addMessage(item.answer);
      });
    })
    .catch(() => {
      addMessage("Error connecting to server. Please try again.");
    });
}

/* ================================
   ENTER KEY SUPPORT
================================ */
document.getElementById("chat-send-btn").onclick = sendQuery;
document.getElementById("chat-input").addEventListener("keypress", e => {
  if (e.key === "Enter") sendQuery();
});

/* ================================
   LOAD FAQ CATEGORIES (ON LOAD)
================================ */
function loadFaqCategories() {
  fetch(`${GAS_URL}?action=getCategories`)
    .then(res => res.json())
    .then(categories => {
      const faqDiv = document.getElementById("chatbot-faq");
      faqDiv.innerHTML = "";

      categories.forEach(cat => {
        const btn = document.createElement("button");
        btn.className = "faq-btn";
        btn.innerText = cat;
        btn.onclick = () => loadCategory(cat);
        faqDiv.appendChild(btn);
      });
    })
    .catch(() => {
      console.error("Failed to load FAQ categories");
    });
}

/* ================================
   LOAD CATEGORY QUESTIONS
================================ */
function loadCategory(category) {
  addMessage(`Showing information for <b>${category}</b>`);

  fetch(`${GAS_URL}?action=getByCategory&category=${encodeURIComponent(category)}`)
    .then(res => res.json())
    .then(items => {
      items.forEach(item => {
        addMessage(`<b>${item.question}</b><br>${item.answer}`);
      });
    })
    .catch(() => {
      addMessage("Unable to load this category right now.");
    });
}

/* ================================
   INITIAL LOAD
================================ */
loadFaqCategories();
addMessage("Welcome! Please choose an option above or type your question.");
