/* =========================================================
   CHESSMATE STUDY
   Authentication & Application Controller
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

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
     CHECK SUPABASE
     ========================================================= */

  if (
    typeof window.supabase === "undefined" ||
    typeof supabaseClient === "undefined" ||
    !supabaseClient
  ) {
    console.error("ChessMate: Supabase client was not created.");
    showStartupError(
      "ChessMate could not connect to Supabase. Please check your Supabase URL and Publishable key."
    );
    return;
  }


  /* =========================================================
     STARTUP ERROR
     ========================================================= */

  function showStartupError(message) {

    console.error(message);

    if (authMessage) {
      authMessage.textContent = message;
      authMessage.className = "auth-message error";
    }
  }


  /* =========================================================
     DECORATIVE CHESSBOARD
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
     AUTH MODAL
     ========================================================= */

  function openAuth(mode = "signup") {

    if (!authModal) {
      console.error("ChessMate: authModal was not found.");
      return;
    }

    authMode = mode === "login" ? "login" : "signup";

    clearMessage();

    if (authForm) {
      authForm.reset();
    }

    updateAuthMode();

    /*
     * IMPORTANT:
     * Your CSS uses .open, not .active.
     */
    authModal.classList.add("open");

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

    /*
     * IMPORTANT:
     * Remove .open because the CSS uses .open.
     */
    authModal.classList.remove("open");

    authModal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("modal-open");

    clearMessage();
  }


  /* =========================================================
     AUTH MODE
     ========================================================= */

  function updateAuthMode() {

    if (!authEyebrow ||
        !authTitle ||
        !authSubtitle ||
        !authSubmit ||
        !authSwitch) {
      return;
    }

    if (authMode === "signup") {

      authEyebrow.textContent =
        "WELCOME TO THE BOARD";

      authTitle.textContent =
        "Create your account";

      authSubtitle.textContent =
        "Your semester. Your strategy. Your board.";

      if (usernameWrap) {
        usernameWrap.style.display = "block";
      }

      if (displayNameWrap) {
        displayNameWrap.style.display = "block";
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

      authSubmit.innerHTML =
        'Log In <span>→</span>';

      authSwitch.innerHTML =
        'New to ChessMate? ' +
        '<button type="button" data-switch-auth="signup">Create an account</button>';
    }
  }


  /* =========================================================
     AUTH SWITCH
     ========================================================= */

  authSwitch?.addEventListener("click", event => {

    const button =
      event.target.closest("[data-switch-auth]");

    if (!button) return;

    event.preventDefault();

    openAuth(button.dataset.switchAuth);

  });


  /* =========================================================
     OPEN AUTH BUTTONS
     ========================================================= */

  document
    .querySelectorAll("[data-open-auth]")
    .forEach(button => {

      button.addEventListener("click", event => {

        event.preventDefault();

        const mode =
          button.dataset.openAuth;

        console.log(
          "ChessMate: opening auth modal:",
          mode
        );

        openAuth(mode);

      });

    });


  /* =========================================================
     CLOSE AUTH
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
        authModal?.classList.contains("open")
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

        if (target) {

          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }

      });

    });


  /* =========================================================
     USERNAME
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


  /* =========================================================
     VALIDATION
     ========================================================= */

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

      return;
    }

    if (authMode === "signup") {

      authSubmit.innerHTML =
        'Create Account <span>→</span>';

    } else {

      authSubmit.innerHTML =
        'Log In <span>→</span>';

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
      (emailInput?.value || "").trim().toLowerCase();

    const password =
      passwordInput?.value || "";


    /* USERNAME */

    if (!username) {

      showMessage(
        "Please choose a username.",
        "error"
      );

      usernameInput?.focus();

      return;
    }


    if (!isValidUsername(username)) {

      showMessage(
        "Username must be 3–20 characters and use only letters, numbers, and underscores.",
        "error"
      );

      usernameInput?.focus();

      return;
    }


    /* DISPLAY NAME */

    if (!displayName) {

      showMessage(
        "Please enter your display name.",
        "error"
      );

      displayNameInput?.focus();

      return;
    }


    /* EMAIL */

    if (!isValidEmail(email)) {

      showMessage(
        "Please enter a valid email address.",
        "error"
      );

      emailInput?.focus();

      return;
    }


    /* PASSWORD */

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

      console.log("ChessMate: attempting signup...");

      const {
        data,
        error
      } =
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

        console.error(
          "Supabase signup error:",
          error
        );

        throw error;
      }


      console.log(
        "ChessMate signup successful:",
        data
      );


      /*
       * EMAIL CONFIRMATION ENABLED
       */

      if (data.user && !data.session) {

        showMessage(
          "Account created! Please check your email and click the confirmation link.",
          "success"
        );

        authForm?.reset();

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

        currentUser =
          data.user;

        showMessage(
          "Account created successfully! Welcome to ChessMate Study.",
          "success"
        );

        setTimeout(() => {

          closeAuthModal();

          handleLoggedInUser(
            data.user
          );

        }, 1000);

        return;
      }


      showMessage(
        "Account created successfully!",
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

      console.log("ChessMate: attempting login...");

      const {
        data,
        error
      } =
        await supabaseClient.auth.signInWithPassword({

          email: email,

          password: password

        });


      if (error) {

        console.error(
          "Supabase login error:",
          error
        );

        throw error;
      }


      currentUser =
        data.user;


      showMessage(
        "Welcome back! Your board is ready.",
        "success"
      );


      setTimeout(() => {

        closeAuthModal();

        handleLoggedInUser(
          data.user
        );

      }, 800);


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
     FRIENDLY SUPABASE ERRORS
     ========================================================= */

  function getFriendlyAuthError(error) {

    const message =
      error?.message ||
      error?.error_description ||
      "Something went wrong. Please try again.";

    const lower =
      message.toLowerCase();


    /* API KEY */

    if (
      lower.includes("invalid api key") ||
      lower.includes("invalid api-key") ||
      lower.includes("api key")
    ) {

      return "ChessMate cannot connect to Supabase because the Publishable API key is invalid. Please replace the key in index.html with the exact Publishable key from Supabase → Settings → API Keys.";
    }


    /* INVALID LOGIN */

    if (
      lower.includes(
        "invalid login credentials"
      )
    ) {

      return "Incorrect email or password. Please try again.";
    }


    /* EMAIL */

    if (
      lower.includes(
        "email not confirmed"
      )
    ) {

      return "Please confirm your email address before logging in.";
    }


    if (
      lower.includes(
        "user already registered"
      )
    ) {

      return "An account with this email already exists. Try logging in.";
    }


    /* PASSWORD */

    if (
      lower.includes(
        "password should be at least"
      )
    ) {

      return "Your password must be at least 6 characters.";
    }


    /* RATE LIMIT */

    if (
      lower.includes("rate limit") ||
      lower.includes("too many requests")
    ) {

      return "Too many attempts. Please wait a moment and try again.";
    }


    /* USERNAME */

    if (
      lower.includes("duplicate key") ||
      lower.includes("profiles_username_key")
    ) {

      return "That username is already taken. Please choose another.";
    }


    if (
      lower.includes("username")
    ) {

      return "There was a problem with that username. Please choose another one.";
    }


    return message;
  }


  /* =========================================================
     CURRENT SESSION
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

        handleLoggedInUser(
          data.session.user
        );

      }

    } catch (error) {

      console.error(
        "ChessMate session error:",
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
     LOGGED-IN USER
     ========================================================= */

  function handleLoggedInUser(user) {

    if (!user) return;


    const displayName =
      user.user_metadata?.display_name ||
      user.user_metadata?.username ||
      user.email?.split("@")[0] ||
      "Student";


    /*
     * LOGIN BUTTON
     */

    const loginButtons =
      document.querySelectorAll(
        '[data-open-auth="login"]'
      );


    loginButtons.forEach(button => {

      button.textContent =
        `Hi, ${displayName}`;

      button.removeAttribute(
        "data-open-auth"
      );

    });


    /*
     * GET STARTED BUTTON BECOMES LOG OUT
     */

    const navbarSignup =
      document.querySelector(
        ".navbar [data-open-auth='signup']"
      );


    if (navbarSignup) {

      navbarSignup.textContent =
        "Log out";

      navbarSignup.removeAttribute(
        "data-open-auth"
      );

      navbarSignup.addEventListener(
        "click",
        logOut
      );

    }


    console.log(
      `Welcome to ChessMate Study, ${displayName}!`
    );
  }


  /* =========================================================
     LOGOUT
     ========================================================= */

  async function logOut() {

    try {

      const {
        error
      } =
        await supabaseClient.auth.signOut();


      if (error) {
        throw error;
      }


      currentUser = null;

      window.location.reload();


    } catch (error) {

      console.error(
        "ChessMate logout error:",
        error
      );

      alert(
        "Unable to log out right now. Please try again."
      );

    }
  }


  /* =========================================================
     INITIALIZE
     ========================================================= */

  updateAuthMode();

  checkCurrentSession();


  /* =========================================================
     CHESSMATE DEBUG API
     ========================================================= */

  window.ChessMate = {

    getUser: () =>
      currentUser,

    openLogin: () =>
      openAuth("login"),

    openSignup: () =>
      openAuth("signup"),

    logout: () =>
      logOut()

  };


  console.log(
    "♞ ChessMate Study initialized successfully."
  );

});
