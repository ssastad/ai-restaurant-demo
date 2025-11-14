async function send() {
  const input = document.getElementById("input");
  const chat = document.getElementById("chat");
  const msg = input.value;
  if(!msg) return;

  chat.innerHTML += `<div class='msg you'>Du: ${msg}</div>`;

  const response = await fetch("https://ai-restaurant-demo-production.up.railway.app/chat", {
    method:"POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ message: msg, restaurant_id:"demo" })
  });

  const data = await response.json();
  chat.innerHTML += `<div class='msg ai'>AI: ${data.reply}</div>`;
  input.value = "";
  chat.scrollTop = chat.scrollHeight;
}




