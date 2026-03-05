document.addEventListener("DOMContentLoaded", () => {

  const input = document.querySelector(".chat-demo__input input");
  const sendBtn = document.querySelector(".chat-demo__send");
  const messages = document.querySelector(".chat-demo__messages");

  if (!input || !sendBtn || !messages) return;

  function appendBubble(text, className) {
    const bubble = document.createElement("div");
    bubble.className = `bubble ${className}`;
    bubble.textContent = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
  }

  const API_URL = "https://ai-chatbot-for-dte.onrender.com/api/chat";

  async function fetchReply(prompt) {

    try {

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
      });

      console.log("Response status:", res.status);

      const data = await res.json();
      console.log("Server response:", data);

      if (!res.ok) {
        throw new Error(data.error || "Server error");
      }

      return data.reply || "No reply from AI";

    } catch (error) {

      console.error("Fetch error:", error);
      throw error;

    }

  }

  async function sendMessage() {

    const text = input.value.trim();
    if (!text) return;

    appendBubble(text, "bubble--user");
    input.value = "";

    const typingBubble = document.createElement("div");
    typingBubble.className = "bubble bubble--bot";
    typingBubble.textContent = "Typing...";
    messages.appendChild(typingBubble);

    messages.scrollTop = messages.scrollHeight;

    try {

      const reply = await fetchReply(text);

      typingBubble.textContent = reply;

    } catch (error) {

      typingBubble.textContent =
        "Server is waking up or there was an error. Please try again.";

    }

  }

  sendBtn.addEventListener("click", sendMessage);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });

});