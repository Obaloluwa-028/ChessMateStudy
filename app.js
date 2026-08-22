/* =========================================================
   CHESSMATE STUDY
   Authentication + Dashboard Redirect
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     SUPABASE CONFIG
     ========================================================= */

  const SUPABASE_URL =
    "https://ximjhyzkofvcmgmlqcpq.supabase.co";

  const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_-p2KVgY-tSZSou03lrL_og_v5amaKp8";


  /* =========================================================
     CREATE SUPABASE CLIENT
     ========================================================= */

  if (!window.supabase) {
    console.error("ChessMate: Supabase library did not load.");
    return;
  }

  const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );

  window.ChessMateSupabase = supabaseClient;


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
     MESSAGES
     ========================================================= */

  function showMessage(message, type = "info") {

    if (!authMessage) return;

    authMessage.textContent = message;
    authMessage.className = "auth-message " + type;
  }


  function clearMessage() {

    if (!authMessage) return;

    authMessage.textContent = "";
    authMessage.className = "auth-message";
  }


  /* =========================================================
     AUTH MODAL
     ========================================================= */

  function openAuth(mode = "signup") {

    if (!authModal) return;

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

    if (!authModal) return;

    if (authMode === "signup") {

      authEyebrow.textContent =
        "WELCOME TO THE BOARD";

      authTitle.textContent =
        "Create your account";

      authSubtitle.textContent =
        "Your semester. Your strategy. Your board.";

      usernameWrap.style.display = "flex";
      displayNameWrap.style.display = "flex";

      usernameInput.disabled = false;
      displayNameInput.disabled = false;

      usernameInput.required = true;
      displayNameInput.required = true;

      passwordInput.autocomplete = "new-password";

      authSubmit.innerHTML =
        'Create Account <span>→</span>';

      authSwitch.innerHTML =
        'Already have an account? ' +
        '<button type="button" data-switch-auth="login">Log in</button>';

    } else {

      authEyebrow.textContent =
        "WELCOME BACK";

      authTitle.textContent =
        "Log in to ChessMate";

      authSubtitle.textContent =
        "Continue your study journey.";

      usernameWrap.style.display = "none";
      displayNameWrap.style.display = "none";

      usernameInput.disabled = true;
      displayNameInput.disabled = true;

      usernameInput.required = false;
      displayNameInput.required = false;

      passwordInput.autocomplete = "current-password";

      authSubmit.innerHTML =
        'Log In <span>→</span>';

      authSwitch.innerHTML =
        'New to ChessMate? ' +
        '<button type="button" data-switch-auth="signup">Create an account</button>';
    }

    const switchButton =
      authSwitch.querySelector("[data-switch-auth]");

    if (switchButton) {

      switchButton.onclick = () => {

        openAuth(
          switchButton.dataset.switchAuth
        );

      };
    }
  }


  /* =========================================================
     OPEN AUTH BUTTONS
     ========================================================= */

  document
    .querySelectorAll("[data-open-auth]")
    .forEach(button => {

      button.addEventListener("click", event => {

        event.preventDefault();

        openAuth(
          button.dataset.openAuth
        );

      });

    });


  /* =========================================================
     CLOSE MODAL
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

      button.addEventListener("click", () => {

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
     LOADING
     ========================================================= */

  function setLoading(loading) {

    if (!authSubmit) return;

    authSubmit.disabled = loading;

    if (loading) {

      authSubmit.innerHTML =
        "Please wait...";

    } else {

      authSubmit.innerHTML =
        authMode === "signup"
          ? 'Create Account <span>→</span>'
          : 'Log In <span>→</span>';
    }
  }


  /* =========================================================
     SIGN UP
     ========================================================= */

  async function signUp() {

    const username =
      normalizeUsername(usernameInput.value);

    const displayName =
      displayNameInput.value.trim();

    const email =
      emailInput.value.trim().toLowerCase();

    const password =
      passwordInput.value;


    if (!isValidUsername(username)) {

      showMessage(
        "Username must be 3–20 characters and use only letters, numbers and underscores.",
        "error"
      );

      usernameInput.focus();
      return;
    }


    if (!displayName) {

      showMessage(
        "Please enter your display name.",
        "error"
      );

      displayNameInput.focus();
      return;
    }


    if (!isValidEmail(email)) {

      showMessage(
        "Please enter a valid email address.",
        "error"
      );

      emailInput.focus();
      return;
    }


    if (!isValidPassword(password)) {

      showMessage(
        "Password must be at least 6 characters.",
        "error"
      );

      passwordInput.focus();
      return;
    }


    setLoading(true);
    clearMessage();


    try {

      const { data, error } =
        await supabaseClient.auth.signUp({

          email: email,

          password: password,

          options: {

            data: {
              username: username,
              display_name: displayName
            }

          }

        });


      if (error) {
        throw error;
      }


      /*
       * Email confirmation enabled
       */

      if (data.user && !data.session) {

        showMessage(
          "Account created! Check your email and confirm your account before logging in.",
          "success"
        );

        authForm.reset();

        usernameInput.disabled = false;
        displayNameInput.disabled = false;

        usernameInput.required = true;
        displayNameInput.required = true;

        return;
      }


      /*
       * Email confirmation disabled
       */

      if (data.session) {

        currentUser = data.user;

        showMessage(
          "Account created! Opening your dashboard...",
          "success"
        );

        setTimeout(() => {

          redirectToDashboard();

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
      emailInput.value.trim().toLowerCase();

    const password =
      passwordInput.value;


    if (!isValidEmail(email)) {

      showMessage(
        "Please enter a valid email address.",
        "error"
      );

      emailInput.focus();
      return;
    }


    if (!password) {

      showMessage(
        "Please enter your password.",
        "error"
      );

      passwordInput.focus();
      return;
    }


    setLoading(true);
    clearMessage();


    try {

      const { data, error } =
        await supabaseClient.auth.signInWithPassword({

          email: email,
          password: password

        });


      if (error) {
        throw error;
      }


      currentUser = data.user;


      showMessage(
        "Login successful! Opening your dashboard...",
        "success"
      );


      /*
       * IMPORTANT:
       * Automatically send the user to dashboard.html.
       */

      setTimeout(() => {

        redirectToDashboard();

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
     DASHBOARD REDIRECT
     ========================================================= */

  function redirectToDashboard() {

    /*
     * Because index.html and dashboard.html are in
     * the same GitHub Pages repository, this is the
     * safest redirect.
     */

    window.location.href = "./dashboard.html";
  }


  /* =========================================================
     FORM SUBMISSION
     ========================================================= */

  authForm?.addEventListener(
    "submit",
    async event => {

      event.preventDefault();

      clearMessage();

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

      return "Please confirm your email address before logging in.";
    }


    if (
      lower.includes("user already registered")
    ) {

      return "An account with this email already exists. Please log in.";
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
      lower.includes("duplicate") &&
      lower.includes("username")
    ) {

      return "That username is already taken.";
    }


    if (
      lower.includes("invalid api key") ||
      lower.includes("apikey")
    ) {

      return "Supabase rejected the API key. Make sure the project URL and publishable key belong to the same Supabase project.";
    }


    return message;
  }


  /* =========================================================
     CURRENT SESSION
     ========================================================= */

  async function checkCurrentSession() {

    try {

      const { data, error } =
        await supabaseClient.auth.getSession();


      if (error) {
        throw error;
      }


      if (data.session) {

        currentUser =
          data.session.user;

        /*
         * If the user is already logged in on the
         * landing page, take them directly to dashboard.
         */

        console.log(
          "ChessMate: Active session found."
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

      if (session?.user) {

        currentUser =
          session.user;

      } else {

        currentUser = null;

      }

    }
  );


  /* =========================================================
     LOGOUT
     ========================================================= */

  async function logOut() {

    try {

      const { error } =
        await supabaseClient.auth.signOut();


      if (error) {
        throw error;
      }


      currentUser = null;

      window.location.href = "./index.html";

    } catch (error) {

      console.error(
        "ChessMate logout error:",
        error
      );

      alert(
        "Unable to log out right now."
      );

    }
  }


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

    logout: () =>
      logOut(),

    goToDashboard: () =>
      redirectToDashboard()

  };


  console.log(
    "♞ ChessMate Study initialized successfully."
  );

});
