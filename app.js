/* =========================================================
   CHESSMATE STUDY
   Authentication Controller
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     SUPABASE CHECK
     ========================================================= */

  const supabaseClient = window.ChessMateSupabase;

  if (!supabaseClient) {
    console.error("ChessMate: Supabase client was not found.");
    showGlobalError(
      "ChessMate could not connect to Supabase. Please refresh the page."
    );
    return;
  }

  console.log("♞ ChessMate: Supabase client found.");


  /* =========================================================
     ELEMENTS
     ========================================================= */

  const authModal = document.getElementById("authModal");
  const closeAuth = document.getElementById("closeAuth");
  const authForm = document.getElementById("authForm");

  const usernameWrap = document.getElementById("usernameWrap");
  const displayNameWrap = document.getElementById("displayNameWrap");

  const usernameInput = document.getElementById("username");
  const displayNameInput = document.getElementById("displayName");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const authEyebrow = document.getElementById("authEyebrow");
  const authTitle = document.getElementById("authTitle");
  const authSubtitle = document.getElementById("authSubtitle");
  const authSubmit = document.getElementById("authSubmit");
  const authSwitch = document.getElementById("authSwitch");
  const authMessage = document.getElementById("authMessage");

  const boardSquares = document.getElementById("boardSquares");

  let authMode = "signup";
  let currentUser = null;


  /* =========================================================
     GLOBAL ERROR
     ========================================================= */

  function showGlobalError(message) {
    console.error(message);

    const box = document.createElement("div");

    box.style.cssText = `
      position:fixed;
      top:20px;
      left:50%;
      transform:translateX(-50%);
      z-index:99999;
      background:#181818;
      color:#fff;
      padding:16px 22px;
      border:1px solid #c9a227;
      border-radius:12px;
      font-family:Arial,sans-serif;
      max-width:90%;
      text-align:center;
      box-shadow:0 10px 40px rgba(0,0,0,.35);
    `;

    box.textContent = message;

    document.body.appendChild(box);

    setTimeout(() => box.remove(), 6000);
  }


  /* =========================================================
     CHESSBOARD
     ========================================================= */

  function createChessboard() {

    if (!boardSquares) return;

    boardSquares.innerHTML = "";

    for (let row = 0; row < 8; row++) {

      for (let col = 0; col < 8; col++) {

        const square = document.createElement("div");

        square.className =
          (row + col) % 2 === 0
            ? "square light"
            : "square dark";

        boardSquares.appendChild(square);
      }
    }
  }

  createChessboard();


  /* =========================================================
     OPEN AUTH
     ========================================================= */

  function openAuth(mode = "signup") {

    if (!authModal) {
      console.error("ChessMate: authModal not found.");
      return;
    }

    authMode = mode;

    clearMessage();

    if (authForm) {
      authForm.reset();
    }

    updateAuthMode();

    authModal.classList.add("active");
    authModal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");

    setTimeout(() => {

      if (authMode === "signup") {
        usernameInput?.focus();
      } else {
        emailInput?.focus();
      }

    }, 100);
  }


  /* =========================================================
     CLOSE AUTH
     ========================================================= */

  function closeAuthModal() {

    if (!authModal) return;

    authModal.classList.remove("active");
    authModal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("modal-open");

    clearMessage();
  }


  /* =========================================================
     AUTH MODE
     ========================================================= */

  function updateAuthMode() {

    if (!authEyebrow || !authTitle || !authSubtitle) return;

    if (authMode === "signup") {

      authEyebrow.textContent =
        "WELCOME TO THE BOARD";

      authTitle.textContent =
        "Create your account";

      authSubtitle.textContent =
        "Your semester. Your strategy. Your board.";

      if (usernameWrap) {
        usernameWrap.style.display = "flex";
      }

      if (displayNameWrap) {
        displayNameWrap.style.display = "flex";
      }

      if (usernameInput) {
        usernameInput.disabled = false;
        usernameInput.required = true;
      }

      if (displayNameInput) {
        displayNameInput.disabled = false;
        displayNameInput.required = true;
      }

      if (passwordInput) {
        passwordInput.autocomplete = "new-password";
      }

      if (authSubmit) {
        authSubmit.innerHTML =
          'Create Account <span>→</span>';
      }

      if (authSwitch) {
        authSwitch.innerHTML =
          'Already have an account? ' +
          '<button type="button" data-switch-auth="login">Log in</button>';
      }

    } else {

      authEyebrow.textContent =
        "WELCOME BACK";

      authTitle.textContent =
        "Log in to ChessMate";

      authSubtitle.textContent =
        "Continue your study journey.";

      if (usernameWrap) {
        usernameWrap.style.display = "none";
      }

      if (displayNameWrap) {
        displayNameWrap.style.display = "none";
      }

      if (usernameInput) {
        usernameInput.disabled = true;
        usernameInput.required = false;
      }

      if (displayNameInput) {
        displayNameInput.disabled = true;
        displayNameInput.required = false;
      }

      if (passwordInput) {
        passwordInput.autocomplete = "current-password";
      }

      if (authSubmit) {
        authSubmit.innerHTML =
          'Log In <span>→</span>';
      }

      if (authSwitch) {
        authSwitch.innerHTML =
          'New to ChessMate? ' +
          '<button type="button" data-switch-auth="signup">Create an account</button>';
      }
    }

    const switchButton =
      authSwitch?.querySelector("[data-switch-auth]");

    if (switchButton) {

      switchButton.onclick = () => {

        openAuth(
          switchButton.dataset.switchAuth
        );

      };
    }
  }


  /* =========================================================
     AUTH BUTTONS
     ========================================================= */

  document
    .querySelectorAll("[data-open-auth]")
    .forEach(button => {

      button.addEventListener("click", event => {

        event.preventDefault();

        const mode =
          button.dataset.openAuth || "signup";

        openAuth(mode);

      });

    });


  /* =========================================================
     CLOSE BUTTON
     ========================================================= */

  closeAuth?.addEventListener(
    "click",
    closeAuthModal
  );


  authModal?.addEventListener(
    "click",
    event => {

      if (event.target === authModal) {
        closeAuthModal();
      }

    }
  );


  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape" &&
        authModal?.classList.contains("active")
      ) {
        closeAuthModal();
      }

    }
  );


  /* =========================================================
     SMOOTH SCROLL
     ========================================================= */

  document
    .querySelectorAll("[data-scroll]")
    .forEach(button => {

      button.addEventListener("click", event => {

        event.preventDefault();

        const target =
          document.querySelector(
            button.dataset.scroll
          );

        target?.scrollIntoView({
          behavior: "smooth"
        });

      });

    });


  /* =========================================================
     VALIDATION
     ========================================================= */

  function normalizeUsername(username) {

    return username
      .trim()
      .toLowerCase()
      .replace(/^@/, "")
      .replace(/\s+/g, "");
  }


  function isValidUsername(username) {

    return /^[a-z0-9_]{3,20}$/.test(username);
  }


  function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }


  function isValidPassword(password) {

    return password.length >= 6;
  }


  /* =========================================================
     MESSAGES
     ========================================================= */

  function showMessage(message, type = "info") {

    if (!authMessage) return;

    authMessage.textContent = message;

    authMessage.className =
      "auth-message " + type;
  }


  function clearMessage() {

    if (!authMessage) return;

    authMessage.textContent = "";

    authMessage.className =
      "auth-message";
  }


  /* =========================================================
     LOADING
     ========================================================= */

  function setLoading(loading) {

    if (!authSubmit) return;

    authSubmit.disabled = loading;

    if (loading) {

      authSubmit.innerHTML =
        "Please wait...";

    } else {

      if (authMode === "signup") {

        authSubmit.innerHTML =
          'Create Account <span>→</span>';

      } else {

        authSubmit.innerHTML =
          'Log In <span>→</span>';

      }
    }
  }


  /* =========================================================
     SIGN UP
     ========================================================= */

  async function signUp() {

    const username =
      normalizeUsername(
        usernameInput?.value || ""
      );

    const displayName =
      (displayNameInput?.value || "").trim();

    const email =
      (emailInput?.value || "")
        .trim()
        .toLowerCase();

    const password =
      passwordInput?.value || "";


    if (!isValidUsername(username)) {

      showMessage(
        "Username must be 3–20 characters and use only letters, numbers and underscores.",
        "error"
      );

      usernameInput?.focus();

      return;
    }


    if (!displayName) {

      showMessage(
        "Please enter your display name.",
        "error"
      );

      displayNameInput?.focus();

      return;
    }


    if (!isValidEmail(email)) {

      showMessage(
        "Please enter a valid email address.",
        "error"
      );

      emailInput?.focus();

      return;
    }


    if (!isValidPassword(password)) {

      showMessage(
        "Password must be at least 6 characters.",
        "error"
      );

      passwordInput?.focus();

      return;
    }


    setLoading(true);
    clearMessage();


    try {

      const {
        data,
        error
      } =
        await supabaseClient.auth.signUp({

          email,

          password,

          options: {

            data: {
              username,
              display_name: displayName
            }

          }

        });


      if (error) {
        throw error;
      }


      console.log(
        "ChessMate signup result:",
        data
      );


      /*
       * EMAIL CONFIRMATION ENABLED
       */

      if (data.user && !data.session) {

        showMessage(
          "Account created! Check your email and click the confirmation link.",
          "success"
        );

        if (authForm) {
          authForm.reset();
        }

        if (usernameInput) {
          usernameInput.disabled = false;
          usernameInput.required = true;
        }

        if (displayNameInput) {
          displayNameInput.disabled = false;
          displayNameInput.required = true;
        }

        return;
      }


      /*
       * EMAIL CONFIRMATION DISABLED
       */

      if (data.session && data.user) {

        currentUser = data.user;

        showMessage(
          "Account created! Opening your ChessMate dashboard...",
          "success"
        );

        setTimeout(() => {

          window.location.href =
            "dashboard.html";

        }, 700);

        return;
      }


      showMessage(
        "Account created successfully.",
        "success"
      );


    } catch (error) {

      console.error(
        "ChessMate signup error:",
        error
      );

      showMessage(
        getFriendlyAuthError(error),
        "error"
      );

    } finally {

      setLoading(false);
    }
  }


  /* =========================================================
     LOGIN
     ========================================================= */

  async function logIn() {

    const email =
      (emailInput?.value || "")
        .trim()
        .toLowerCase();

    const password =
      passwordInput?.value || "";


    if (!isValidEmail(email)) {

      showMessage(
        "Please enter a valid email address.",
        "error"
      );

      emailInput?.focus();

      return;
    }


    if (!password) {

      showMessage(
        "Please enter your password.",
        "error"
      );

      passwordInput?.focus();

      return;
    }


    setLoading(true);
    clearMessage();


    try {

      const {
        data,
        error
      } =
        await supabaseClient.auth.signInWithPassword({

          email,
          password

        });


      if (error) {
        throw error;
      }


      if (!data.session) {

        throw new Error(
          "Login succeeded but no session was returned."
        );

      }


      currentUser =
        data.user;


      showMessage(
        "Welcome back! Opening your dashboard...",
        "success"
      );


      setTimeout(() => {

        window.location.href =
          "dashboard.html";

      }, 500);


    } catch (error) {

      console.error(
        "ChessMate login error:",
        error
      );

      showMessage(
        getFriendlyAuthError(error),
        "error"
      );

    } finally {

      setLoading(false);
    }
  }


  /* =========================================================
     FORM
     ========================================================= */

  authForm?.addEventListener(
    "submit",
    async event => {

      event.preventDefault();

      if (authMode === "signup") {

        await signUp();

      } else {

        await logIn();

      }

    }
  );


  /* =========================================================
     FRIENDLY ERRORS
     ========================================================= */

  function getFriendlyAuthError(error) {

    const message =
      error?.message ||
      "Something went wrong. Please try again.";

    const lower =
      message.toLowerCase();


    if (
      lower.includes("invalid login credentials")
    ) {

      return "Incorrect email or password.";
    }


    if (
      lower.includes("email not confirmed")
    ) {

      return "Please confirm your email before logging in.";
    }


    if (
      lower.includes("user already registered")
    ) {

      return "An account with this email already exists. Try logging in.";
    }


    if (
      lower.includes("password should be at least")
    ) {

      return "Your password must be at least 6 characters.";
    }


    if (
      lower.includes("rate limit")
    ) {

      return "Too many attempts. Please wait a moment and try again.";
    }


    if (
      lower.includes("username") &&
      (
        lower.includes("duplicate") ||
        lower.includes("unique")
      )
    ) {

      return "That username is already taken.";
    }


    if (
      lower.includes("api key") ||
      lower.includes("invalid api")
    ) {

      return "Supabase rejected the API key. Check the Supabase key in index.html.";
    }


    return message;
  }


  /* =========================================================
     SESSION CHECK
     ========================================================= */

  async function checkCurrentSession() {

    try {

      const {
        data,
        error
      } =
        await supabaseClient.auth.getSession();


      if (error) {
        throw error;
      }


      if (data?.session?.user) {

        currentUser =
          data.session.user;

        console.log(
          "ChessMate: active session found."
        );

      }

    } catch (error) {

      console.error(
        "ChessMate session check error:",
        error
      );

    }
  }


  /* =========================================================
     AUTH STATE
     ========================================================= */

  supabaseClient.auth.onAuthStateChange(
    (event, session) => {

      console.log(
        "ChessMate auth event:",
        event
      );

      currentUser =
        session?.user || null;

    }
  );


  /* =========================================================
     INITIALIZE
     ========================================================= */

  updateAuthMode();

  checkCurrentSession();


  /* =========================================================
     DEBUG API
     ========================================================= */

  window.ChessMate = {

    getUser: () =>
      currentUser,

    openLogin: () =>
      openAuth("login"),

    openSignup: () =>
      openAuth("signup"),

    logout: async () => {

      await supabaseClient.auth.signOut();

      window.location.href =
        "index.html";

    }

  };


  console.log(
    "♞ ChessMate Study initialized successfully."
  );

});
