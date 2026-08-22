/* =========================================================
   CHESSMATE STUDY
   MAIN APPLICATION CONTROLLER
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const supabaseClient = window.ChessMateSupabase;

  /* =========================================================
     CHECK SUPABASE
     ========================================================= */

  if (!supabaseClient) {
    console.error("ChessMate: Supabase client is missing.");
    return;
  }

  console.log("♞ ChessMate Supabase connected.");

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
     MODAL
     ========================================================= */

  function openAuth(mode = "signup") {

    authMode = mode;

    clearMessage();

    if (authForm) {
      authForm.reset();
    }

    updateAuthMode();

    if (!authModal) return;

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

    if (!authEyebrow || !authTitle) return;

    if (authMode === "signup") {

      authEyebrow.textContent = "WELCOME TO THE BOARD";

      authTitle.textContent = "Create your account";

      authSubtitle.textContent =
        "Your semester. Your strategy. Your board.";

      if (usernameWrap) usernameWrap.style.display = "flex";
      if (displayNameWrap) displayNameWrap.style.display = "flex";

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

      authEyebrow.textContent = "WELCOME BACK";

      authTitle.textContent = "Log in to ChessMate";

      authSubtitle.textContent =
        "Continue your study journey.";

      if (usernameWrap) usernameWrap.style.display = "none";
      if (displayNameWrap) displayNameWrap.style.display = "none";

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
  }


  /* =========================================================
     OPEN AUTH BUTTONS
     ========================================================= */

  document.querySelectorAll("[data-open-auth]").forEach(button => {

    button.addEventListener("click", event => {

      event.preventDefault();

      const mode = button.dataset.openAuth || "signup";

      openAuth(mode);

    });

  });


  /* =========================================================
     AUTH SWITCH
     ========================================================= */

  authSwitch?.addEventListener("click", event => {

    const button = event.target.closest("[data-switch-auth]");

    if (!button) return;

    event.preventDefault();

    openAuth(button.dataset.switchAuth);

  });


  /* =========================================================
     CLOSE
     ========================================================= */

  closeAuth?.addEventListener("click", closeAuthModal);

  authModal?.addEventListener("click", event => {

    if (event.target === authModal) {
      closeAuthModal();
    }

  });


  document.addEventListener("keydown", event => {

    if (
      event.key === "Escape" &&
      authModal?.classList.contains("active")
    ) {
      closeAuthModal();
    }

  });


  /* =========================================================
     SMOOTH SCROLL
     ========================================================= */

  document.querySelectorAll("[data-scroll]").forEach(button => {

    button.addEventListener("click", () => {

      const target =
        document.querySelector(button.dataset.scroll);

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
    authMessage.className = "auth-message " + type;
  }


  function clearMessage() {

    if (!authMessage) return;

    authMessage.textContent = "";
    authMessage.className = "auth-message";
  }


  /* =========================================================
     LOADING
     ========================================================= */

  function setLoading(loading) {

    if (!authSubmit) return;

    authSubmit.disabled = loading;

    if (loading) {

      authSubmit.innerHTML = "Please wait...";

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
      normalizeUsername(usernameInput?.value || "");

    const displayName =
      (displayNameInput?.value || "").trim();

    const email =
      (emailInput?.value || "").trim().toLowerCase();

    const password =
      passwordInput?.value || "";


    if (!isValidUsername(username)) {

      showMessage(
        "Username must be 3–20 characters using letters, numbers or underscores.",
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

      const result =
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


      if (result.error) {
        throw result.error;
      }


      const user = result.data?.user;
      const session = result.data?.session;


      /*
       * Supabase email confirmation enabled
       */

      if (user && !session) {

        showMessage(
          "Account created! Check your email and confirm your account.",
          "success"
        );

        return;
      }


      /*
       * Email confirmation disabled
       */

      if (session && user) {

        currentUser = user;

        showMessage(
          "Account created! Opening your dashboard...",
          "success"
        );

        setTimeout(() => {
          goToDashboard();
        }, 700);

        return;
      }


      showMessage(
        "Account created successfully.",
        "success"
      );


    } catch (error) {

      console.error("SIGNUP ERROR:", error);

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
      (emailInput?.value || "").trim().toLowerCase();

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

      const result =
        await supabaseClient.auth.signInWithPassword({

          email,
          password

        });


      if (result.error) {
        throw result.error;
      }


      currentUser = result.data.user;


      showMessage(
        "Login successful! Opening your dashboard...",
        "success"
      );


      setTimeout(() => {

        goToDashboard();

      }, 500);


    } catch (error) {

      console.error("LOGIN ERROR:", error);

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

  authForm?.addEventListener("submit", async event => {

    event.preventDefault();

    if (authMode === "signup") {
      await signUp();
    } else {
      await logIn();
    }

  });


  /* =========================================================
     DASHBOARD REDIRECT
     ========================================================= */

  function goToDashboard() {

    /*
     * Because index.html and dashboard.html are
     * in the same GitHub Pages folder, this works
     * regardless of the repository name.
     */

    window.location.href = "./dashboard.html";
  }


  /* =========================================================
     FRIENDLY ERRORS
     ========================================================= */

  function getFriendlyAuthError(error) {

    const message =
      error?.message ||
      "Something went wrong. Please try again.";

    const lower =
      message.toLowerCase();


    if (lower.includes("invalid login credentials")) {
      return "Incorrect email or password.";
    }


    if (lower.includes("email not confirmed")) {
      return "Please confirm your email before logging in.";
    }


    if (
      lower.includes("user already registered") ||
      lower.includes("already been registered")
    ) {
      return "This email already has an account. Try logging in.";
    }


    if (lower.includes("password")) {
      return "Your password must be at least 6 characters.";
    }


    if (lower.includes("rate limit")) {
      return "Too many attempts. Please wait a moment.";
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


    return message;
  }


  /* =========================================================
     SESSION
     ========================================================= */

  async function checkCurrentSession() {

    try {

      const result =
        await supabaseClient.auth.getSession();


      if (result.error) {
        console.error(result.error);
        return;
      }


      const session = result.data?.session;


      if (session?.user) {

        currentUser = session.user;

        /*
         * If somebody is already logged in on the
         * landing page, send them to dashboard.
         */

        if (
          window.location.pathname.endsWith("index.html") ||
          window.location.pathname === "/" ||
          window.location.pathname.endsWith("/")
        ) {

          // Do not immediately redirect while user is
          // viewing the landing page unless desired.
          // The login flow itself handles the redirect.

          console.log(
            "ChessMate: Existing session detected."
          );
        }
      }

    } catch (error) {

      console.error(
        "SESSION ERROR:",
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
     LOGOUT
     ========================================================= */

  async function logOut() {

    try {

      const result =
        await supabaseClient.auth.signOut();

      if (result.error) {
        throw result.error;
      }

      currentUser = null;

      window.location.href = "./index.html";

    } catch (error) {

      console.error("LOGOUT ERROR:", error);

      alert(
        "Unable to log out right now."
      );
    }
  }


  /* =========================================================
     DEBUG API
     ========================================================= */

  window.ChessMate = {

    getUser: () => currentUser,

    openLogin: () => openAuth("login"),

    openSignup: () => openAuth("signup"),

    logout: () => logOut(),

    dashboard: () => goToDashboard()

  };


  /* =========================================================
     INITIALIZE
     ========================================================= */

  updateAuthMode();
  checkCurrentSession();

  console.log(
    "♞ ChessMate Study initialized successfully."
  );

});
