const modal = document.getElementById("authModal");
const authForm = document.getElementById("authForm");
const authTitle = document.getElementById("authTitle");
const authEyebrow = document.getElementById("authEyebrow");
const authSubtitle = document.getElementById("authSubtitle");
const authSubmit = document.getElementById("authSubmit");
const usernameWrap = document.getElementById("usernameWrap");
const displayNameWrap = document.getElementById("displayNameWrap");
const authSwitch = document.getElementById("authSwitch");
const authMessage = document.getElementById("authMessage");
let authMode = "signup";

function setAuthMode(mode){
  authMode = mode;
  const signup = mode === "signup";
  authEyebrow.textContent = signup ? "WELCOME TO THE BOARD" : "WELCOME BACK";
  authTitle.textContent = signup ? "Create your account" : "Log in to ChessMate";
  authSubtitle.textContent = signup ? "Your semester. Your strategy. Your board." : "Continue your study journey.";
  usernameWrap.style.display = signup ? "block" : "none";
  displayNameWrap.style.display = signup ? "block" : "none";
  authSubmit.innerHTML = signup ? "Create Account <span>→</span>" : "Log In <span>→</span>";
  authSwitch.innerHTML = signup
    ? 'Already have an account? <button type="button" data-switch-auth="login">Log in</button>'
    : 'New to ChessMate? <button type="button" data-switch-auth="signup">Create an account</button>';
  authMessage.textContent = "";
}
function openAuth(mode="signup"){
  setAuthMode(mode); modal.classList.add("open"); modal.setAttribute("aria-hidden","false");
  setTimeout(()=>document.getElementById("email").focus(),100);
}
function closeAuth(){modal.classList.remove("open"); modal.setAttribute("aria-hidden","true");}
document.querySelectorAll("[data-open-auth]").forEach(b=>b.addEventListener("click",()=>openAuth(b.dataset.openAuth)));
document.getElementById("closeAuth").addEventListener("click",closeAuth);
modal.addEventListener("click",e=>{if(e.target===modal)closeAuth()});
document.addEventListener("click",e=>{const b=e.target.closest("[data-switch-auth]"); if(b)setAuthMode(b.dataset.switchAuth)});
document.querySelectorAll("[data-scroll]").forEach(b=>b.addEventListener("click",()=>document.querySelector(b.dataset.scroll).scrollIntoView({behavior:"smooth"})));

const board = document.getElementById("boardSquares");
for(let i=0;i<64;i++){
  const s=document.createElement("div");
  s.className="square "+(((Math.floor(i/8)+i)%2===0)?"light":"dark");
  board.appendChild(s);
}
setInterval(()=>{
  document.querySelectorAll(".board-piece").forEach((p,i)=>{
    const x=[0,5,-3,4,-2,2,-4,3][i], y=[2,-3,3,-2,1,-2,2,-1][i];
    p.style.transform=`translate(${x}px, ${y}px)`;
  });
  setTimeout(()=>document.querySelectorAll(".board-piece").forEach(p=>p.style.transform=""),900);
},4500);

authForm.addEventListener("submit", e=>{
  e.preventDefault();
  authMessage.textContent = "Supabase connection will be added in the next build step.";
});
