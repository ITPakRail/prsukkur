/* ================================
   CHATBOT CONFIG
================================ */
const GAS_URL = "https://script.google.com/macros/s/AKfycbxcwFHb-UU_TNZ44XV2g7Prn_N_ste9PXdfDUA9_UuW08TNZzM_pYmKpEo5bJJcLB8LXw/exec";

/* ================================
   INJECT HTML
================================ */
document.body.insertAdjacentHTML("beforeend", `
<div id="chatbot-btn" title="Chat Assistant">💬</div>
<div id="chatbot-box">
  <div id="chatbot-header">Railway Assistant</div>
  <div id="chatbot-messages"></div>
  <div id="chatbot-input">
    <input id="chat-input" placeholder="Type your question..." />
    <button id="chat-send-btn">Send</button>
  </div>
</div>
`);

/* ================================
   TOGGLE CHAT
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
  div.scrollIntoView({ behavior: "smooth" });
}

/* ================================
   SEND QUERY
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
      data.forEach(item => addMessage(item.answer));
    })
    .catch(() => addMessage("Error connecting to server."));
}

/* ================================
   ENTER KEY SUPPORT
================================ */
document.getElementById("chat-send-btn").onclick = sendQuery;
document.getElementById("chat-input").addEventListener("keypress", e => {
  if (e.key === "Enter") sendQuery();
});

/* ================================
   INITIAL WELCOME
================================ */
addMessage("Welcome! Type your question, e.g., 'ROHRI to LAHORE train'.");
