const GAS_URL = "YOUR_GAS_WEB_APP_URL_HERE";

document.body.insertAdjacentHTML("beforeend", `
<div id="chatbot-btn">💬</div>
<div id="chatbot-box">
  <div id="chatbot-header">Railway Assistant</div>
  <div id="chatbot-messages"></div>
  <div id="chatbot-input">
    <input id="chat-input" placeholder="Type your question..." />
    <button onclick="sendQuery()">Send</button>
  </div>
</div>
`);

document.getElementById("chatbot-btn").onclick = () => {
  const box = document.getElementById("chatbot-box");
  box.style.display = box.style.display === "flex" ? "none" : "flex";
};

function addMessage(text, from = "bot") {
  const div = document.createElement("div");
  div.innerHTML = `<b>${from}:</b> ${text}`;
  document.getElementById("chatbot-messages").appendChild(div);
}

function sendQuery() {
  const input = document.getElementById("chat-input");
  const text = input.value;
  if (!text) return;

  addMessage(text, "You");
  input.value = "";

  fetch(`${GAS_URL}?q=${encodeURIComponent(text)}`)
    .then(r => r.json())
    .then(res => {
      res.forEach(item => addMessage(item.answer));
    });
}

// Load default welcome
addMessage("Welcome! Ask about trains, fares, or timings.");
