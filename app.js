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
     SUPABASE CHECK
     ========================================================= */

  const supabaseClient =
    window.ChessMateSupabase;

  if (!supabaseClient) {

    console.error(
      "ChessMate: Supabase client was not found."
    );

    showMessage(
      "ChessMate could not connect to Supabase. Please refresh the page.",
      "error"
    );

    return;
  }


  /* =========================================================
     DASHBOARD REDIRECT
     ========================================================= */

  function goToDashboard() {

    console.log(
      "ChessMate: Redirecting to dashboard..."
    );

    window.location.href = "dashboard.html";
  }


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
     AUTH MODAL
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

    if (authMode === "signup") {

      if (authEyebrow)
        authEyebrow.textContent =
          "WELCOME TO THE BOARD";

      if (authTitle)
        authTitle.textContent =
          "Create your account";

      if (authSubtitle)
        authSubtitle.textContent =
          "Your semester. Your strategy. Your board.";

      if (usernameWrap)
        usernameWrap.style.display = "flex";

      if (displayNameWrap)
        displayNameWrap.style.display = "flex";

      if (usernameInput) {

        usernameInput.disabled = false;
        usernameInput.required = true;

      }

      if (displayNameInput) {

        displayNameInput.disabled = false;
        displayNameInput.required = true;

      }

      if (passwordInput)
        passwordInput.autocomplete =
          "new-password";

      if (authSubmit)
        authSubmit.innerHTML =
          'Create Account <span>→</span>';

      if (authSwitch)
        authSwitch.innerHTML =
          'Already have an account? ' +
          '<button type="button" data-switch-auth="login">' +
          'Log in' +
          '</button>';

    } else {

      if (authEyebrow)
        authEyebrow.textContent =
          "WELCOME BACK";

      if (authTitle)
        authTitle.textContent =
          "Log in to ChessMate";

      if (authSubtitle)
        authSubtitle.textContent =
          "Continue your study journey.";

      if (usernameWrap)
        usernameWrap.style.display = "none";

      if (displayNameWrap)
        displayNameWrap.style.display = "none";

      if (usernameInput) {

        usernameInput.disabled = true;
        usernameInput.required = false;

      }

      if (displayNameInput) {

        displayNameInput.disabled = true;
        displayNameInput.required = false;

      }

      if (passwordInput)
        passwordInput.autocomplete =
          "current-password";

      if (authSubmit)
        authSubmit.innerHTML =
          'Log In <span>→</span>';

      if (authSwitch)
        authSwitch.innerHTML =
          'New to ChessMate? ' +
          '<button type="button" data-switch-auth="signup">' +
          'Create an account' +
          '</button>';
    }


    const switchButton =
      authSwitch?.querySelector(
        "[data-switch-auth]"
      );

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

    return /^[a-z0-9_]{3,20}$/.test(
      username
    );
  }


  /* =========================================================
     VALIDATION
     ========================================================= */

  function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
    );
  }


  function isValidPassword(password) {

    return password.length >= 6;
  }


  /* =========================================================
     MESSAGES
     ========================================================= */

  function showMessage(
    message,
    type = "info"
  ) {

    if (!authMessage) {

      console.log(
        `ChessMate ${type}:`,
        message
      );

      return;
    }

    authMessage.textContent =
      message;

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

    authSubmit.disabled =
      loading;

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
        usernameInput.value
      );

    const displayName =
      displayNameInput.value.trim();

    const email =
      emailInput.value
        .trim()
        .toLowerCase();

    const password =
      passwordInput.value;


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

        throw error;

      }


      console.log(
        "ChessMate signup result:",
        data
      );


      /*
       * EMAIL CONFIRMATION ENABLED
       */

      if (
        data.user &&
        !data.session
      ) {

        showMessage(
          "Account created! Please check your email and confirm your account.",
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
       * SIGNUP CREATED A SESSION
       */

      if (data.session) {

        currentUser =
          data.user;

        showMessage(
          "Account created! Opening your dashboard...",
          "success"
        );

        setTimeout(
          goToDashboard,
          500
        );

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
      emailInput.value
        .trim()
        .toLowerCase();

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

      console.log(
        "ChessMate: Logging in..."
      );


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


      if (!data?.session) {

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


      /*
       * DIRECT DASHBOARD REDIRECT
       */

      setTimeout(
        goToDashboard,
        500
      );


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
     FRIENDLY ERRORS
     ========================================================= */

  function getFriendlyAuthError(error) {

    const message =
      error?.message ||
      "Something went wrong. Please try again.";

    const lower =
      message.toLowerCase();


    if (
      lower.includes(
        "invalid login credentials"
      )
    ) {

      return "Incorrect email or password. Please try again.";
    }


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


    if (
      lower.includes(
        "password should be at least"
      )
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

      return "That username is already taken. Please choose another.";
    }


    if (
      lower.includes("api key") ||
      lower.includes("unauthorized")
    ) {

      return "Supabase rejected the request. Please check your Supabase project configuration.";
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

        /*
         * If the user is already logged in on the
         * landing page, send them directly to dashboard.
         */

        console.log(
          "ChessMate: Existing session found."
        );

        goToDashboard();

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

      window.location.href =
        "index.html";

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
      logOut(),

    goToDashboard: () =>
      goToDashboard()

  };


  console.log(
    "♞ ChessMate Study initialized successfully."
  );

});
