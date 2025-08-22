const GAS_URL = "https://script.google.com/macros/s/AKfycbxar7Joa2EUpnZDTjvZ7-oKQK8d5xlXVk0iEgiwZotrU_pkzg-s-MoZxCIxrcY896ZP/exec";

async function sha256(text){
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
}

async function handleSignup(){
  const email = document.getElementById("signup-email").value.trim();
  const pass = document.getElementById("signup-pass").value;
  const pass2 = document.getElementById("signup-pass2").value;
  const msg = document.getElementById("signup-msg");

  if(pass !== pass2){ msg.textContent="Password confirm match illa!"; msg.className="msg error"; return; }
  const hash = await sha256(pass);

  const res = await fetch(GAS_URL,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({ action:"signup", email, passwordHash:hash })
  });
  const text = await res.text();
  if(text==="success"){ msg.textContent="Account create ayi!"; msg.className="msg success"; setTimeout(()=>{window.location.href="login.html"},1500);}
  else if(text==="exists"){ msg.textContent="Email already undu!"; msg.className="msg error"; }
  else{ msg.textContent="Signup error"; msg.className="msg error"; }
}

async function handleLogin(){
  const email = document.getElementById("login-email").value.trim();
  const pass = document.getElementById("login-pass").value;
  const msg = document.getElementById("login-msg");

  const hash = await sha256(pass);
  const res = await fetch(GAS_URL,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({ action:"login", email, passwordHash:hash })
  });
  const text = await res.text();
  if(text==="success"){ localStorage.setItem("desinix_current_user",email); window.location.href="dashboard.html"; }
  else{ msg.textContent="Invalid login"; msg.className="msg error"; }
}
