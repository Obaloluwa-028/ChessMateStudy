/* =========================================================
   CHESSMATE STUDY
   Authentication & Application Controller
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

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
  let supabaseClient = null;


  /* =========================================================
     SUPABASE INITIALIZATION
     ========================================================= */

  function initializeSupabase() {

    console.log("ChessMate: Starting Supabase initialization...");

    /* Check Supabase CDN */
    if (!window.supabase) {

      console.error(
        "ChessMate: Supabase CDN did not load."
      );

      showMessage(
        "Supabase library failed to load. Please refresh the page.",
        "error"
      );

      return false;
    }


    /* Check configuration */
    const supabaseUrl =
      window.CHESSMATE_SUPABASE_URL;

    const supabaseKey =
      window.CHESSMATE_SUPABASE_KEY;


    if (!supabaseUrl || !supabaseKey) {

      console.error(
        "ChessMate: Supabase configuration is missing."
      );

      showMessage(
        "ChessMate is not connected to Supabase yet. Please check the Supabase configuration in index.html.",
        "error"
      );

      return false;
    }


    /* Create client */
    try {

      supabaseClient =
        window.supabase.createClient(
          supabaseUrl,
          supabaseKey
        );

    } catch (error) {

      console.error(
        "ChessMate: Could not create Supabase client.",
        error
      );

      showMessage(
        "ChessMate could not connect to Supabase. Please check your API key.",
        "error"
      );

      return false;
    }


    console.log(
      "ChessMate: Supabase connected successfully."
    );

    return true;
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
     INITIALIZE SUPABASE FIRST
     ========================================================= */

  const supabaseReady =
    initializeSupabase();


  /* =========================================================
     DECORATIVE CHESSBOARD
     ========================================================= */

  function createChessboard() {

    if (!boardSquares) return;

    boardSquares.innerHTML = "";

    for (let row = 0; row < 8; row++) {

      for (let col = 0; col < 8; col++) {

        const square =
          document.createElement("div");

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
     AUTH MODAL
     ========================================================= */

  function openAuth(mode = "signup") {

    if (!authModal) return;

    if (!supabaseReady) {

      showMessage(
        "ChessMate is not connected to Supabase. Please check your configuration.",
        "error"
      );

      return;
    }


    authMode = mode;

    clearMessage();

    if (authForm) {
      authForm.reset();
    }

    updateAuthMode();

    /*
     * IMPORTANT:
     * Your CSS uses .open, so we use .open.
     * We also add .active for compatibility.
     */

    authModal.classList.add("open");
    authModal.classList.add("active");

    authModal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add(
      "modal-open"
    );


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

    authModal.classList.remove("open");
    authModal.classList.remove("active");

    authModal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove(
      "modal-open"
    );

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

        passwordInput.autocomplete =
          "new-password";

      }


      authSubmit.innerHTML =
        'Create Account <span>→</span>';


      authSwitch.innerHTML =
        'Already have an account? ' +
        '<button type="button" data-switch-auth="login">' +
        'Log in' +
        '</button>';

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

        passwordInput.autocomplete =
          "current-password";

      }


      authSubmit.innerHTML =
        'Log In <span>→</span>';


      authSwitch.innerHTML =
        'New to ChessMate? ' +
        '<button type="button" data-switch-auth="signup">' +
        'Create an account' +
        '</button>';
    }
  }


  /* =========================================================
     OPEN AUTH BUTTONS
     ========================================================= */

  document
    .querySelectorAll("[data-open-auth]")
    .forEach(button => {

      button.addEventListener(
        "click",
        event => {

          event.preventDefault();

          openAuth(
            button.dataset.openAuth
          );

        }
      );

    });


  /* =========================================================
     AUTH SWITCH
     ========================================================= */

  authSwitch?.addEventListener(
    "click",
    event => {

      const button =
        event.target.closest(
          "[data-switch-auth]"
        );

      if (!button) return;

      openAuth(
        button.dataset.switchAuth
      );

    }
  );


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
        (
          authModal?.classList.contains("open") ||
          authModal?.classList.contains("active")
        )
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

      button.addEventListener(
        "click",
        () => {

          const target =
            document.querySelector(
              button.dataset.scroll
            );

          target?.scrollIntoView({
            behavior: "smooth"
          });

        }
      );

    });


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

    if (!supabaseClient) {

      showMessage(
        "ChessMate is not connected to Supabase.",
        "error"
      );

      return;
    }


    const username =
      normalizeUsername(
        usernameInput.value
      );

    const displayName =
      displayNameInput.value.trim();

    const email =
      emailInput.value.trim().toLowerCase();

    const password =
      passwordInput.value;


    /* Username */

    if (!username) {

      showMessage(
        "Please choose a username.",
        "error"
      );

      usernameInput.focus();

      return;
    }


    if (!isValidUsername(username)) {

      showMessage(
        "Username must be 3–20 characters and use only letters, numbers, and underscores.",
        "error"
      );

      usernameInput.focus();

      return;
    }


    /* Display name */

    if (!displayName) {

      showMessage(
        "Please enter your display name.",
        "error"
      );

      displayNameInput.focus();

      return;
    }


    /* Email */

    if (!isValidEmail(email)) {

      showMessage(
        "Please enter a valid email address.",
        "error"
      );

      emailInput.focus();

      return;
    }


    /* Password */

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

      console.log(
        "ChessMate: Creating account..."
      );


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
        "ChessMate: Signup successful.",
        data
      );


      /*
       * Email confirmation enabled
       */

      if (data.user && !data.session) {

        showMessage(
          "Account created! Please check your email to confirm your account.",
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

    if (!supabaseClient) {

      showMessage(
        "ChessMate is not connected to Supabase.",
        "error"
      );

      return;
    }


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

      const {
        data,
        error
      } =
        await supabaseClient.auth.signInWithPassword({

          email: email,

          password: password

        });


      if (error) {
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

      if (!supabaseReady) {

        showMessage(
          "ChessMate is not connected to Supabase.",
          "error"
        );

        return;
      }


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
      lower.includes("invalid api key") ||
      lower.includes("api key")
    ) {

      return "The Supabase API key is invalid. Please copy the Publishable key from your Supabase project.";
    }


    if (
      lower.includes("invalid login credentials")
    ) {

      return "Incorrect email or password. Please try again.";
    }


    if (
      lower.includes("email not confirmed")
    ) {

      return "Please confirm your email address before logging in.";
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
      lower.includes("duplicate key") ||
      lower.includes("profiles_username_key")
    ) {

      return "That username is already taken. Please choose another.";
    }


    return message;
  }


  /* =========================================================
     CURRENT SESSION
     ========================================================= */

  async function checkCurrentSession() {

    if (!supabaseClient) return;


    try {

      const {
        data,
        error
      } =
        await supabaseClient.auth.getSession();


      if (error) {
        throw error;
      }


      if (data.session) {

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

  if (supabaseClient) {

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

  }


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

    if (!supabaseClient) return;


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


  if (supabaseReady) {

    await checkCurrentSession();

  } else {

    console.error(
      "ChessMate: Supabase initialization failed."
    );

  }


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
      logOut()

  };


  console.log(
    "♞ ChessMate Study initialized."
  );

});
