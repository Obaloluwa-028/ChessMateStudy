/* =========================================================
   CHESSMATE STUDY
   Authentication + Dashboard Redirect
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     SUPABASE
     ========================================================= */

  const supabase = window.ChessMateSupabase;

  if (!supabase) {
    console.error("ChessMate: Supabase client is missing.");
    showGlobalError(
      "ChessMate could not connect to Supabase. Please refresh the page."
    );
    return;
  }


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
     DASHBOARD URL
     ========================================================= */

  /*
   * This automatically works on GitHub Pages.
   *
   * Example:
   * https://username.github.io/ChessMate-Study/dashboard.html
   *
   * No need to type the URL manually.
   */

  function getDashboardURL() {

    const currentPath =
      window.location.pathname;

    /*
     * If the website is inside a GitHub Pages repository,
     * preserve the repository folder.
     */

    const parts =
      currentPath.split("/").filter(Boolean);

    if (
      window.location.hostname.endsWith("github.io") &&
      parts.length > 0
    ) {

      return (
        "/" +
        parts[0] +
        "/dashboard.html"
      );

    }

    /*
     * Local hosting / root hosting
     */

    return "dashboard.html";
  }


  function goToDashboard() {

    console.log(
      "ChessMate: Redirecting to dashboard..."
    );

    window.location.href =
      getDashboardURL();

  }


  /* =========================================================
     GLOBAL ERROR
     ========================================================= */

  function showGlobalError(message) {

    console.error(message);

    if (authMessage) {

      authMessage.textContent =
        message;

      authMessage.className =
        "auth-message error";

    } else {

      alert(message);

    }
  }


  /* =========================================================
     CHESSBOARD
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

    authModal.classList.remove(
      "active"
    );

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

    if (
      !authEyebrow ||
      !authTitle ||
      !authSubtitle ||
      !authSubmit ||
      !authSwitch
    ) return;


    if (authMode === "signup") {

      authEyebrow.textContent =
        "WELCOME TO THE BOARD";

      authTitle.textContent =
        "Create your account";

      authSubtitle.textContent =
        "Your semester. Your strategy. Your board.";


      if (usernameWrap) {
        usernameWrap.style.display =
          "flex";
      }

      if (displayNameWrap) {
        displayNameWrap.style.display =
          "flex";
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

        usernameWrap.style.display =
          "none";

      }

      if (displayNameWrap) {

        displayNameWrap.style.display =
          "none";

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


    const switchButton =
      authSwitch.querySelector(
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

          const mode =
            button.dataset.openAuth;

          openAuth(
            mode === "login"
              ? "login"
              : "signup"
          );

        }
      );

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

      button.addEventListener(
        "click",
        event => {

          event.preventDefault();

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

    return /^[a-z0-9_]{3,20}$/.test(
      username
    );

  }


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

      console.log(message);

      return;

    }

    authMessage.textContent =
      message;

    authMessage.className =
      "auth-message " + type;

  }


  function clearMessage() {

    if (!authMessage) return;

    authMessage.textContent =
      "";

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
      normalizeUsername(
        usernameInput?.value || ""
      );

    const displayName =
      (
        displayNameInput?.value || ""
      ).trim();

    const email =
      (
        emailInput?.value || ""
      ).trim().toLowerCase();

    const password =
      passwordInput?.value || "";


    if (!isValidUsername(username)) {

      showMessage(
        "Username must be 3–20 characters and use only letters, numbers, and underscores.",
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
        await supabase.auth.signUp({

          email,
          password,

          options: {

            data: {

              username,
              display_name: displayName

            }

          }

        });


      console.log(
        "ChessMate signup result:",
        result
      );


      if (result.error) {

        throw result.error;

      }


      const user =
        result.data?.user;

      const session =
        result.data?.session;


      /*
       * Email confirmation enabled
       */

      if (user && !session) {

        showMessage(
          "Account created! Please check your email and confirm your account.",
          "success"
        );

        return;

      }


      /*
       * Email confirmation disabled
       */

      if (user && session) {

        currentUser =
          user;

        showMessage(
          "Account created! Opening your dashboard...",
          "success"
        );

        setTimeout(
          goToDashboard,
          700
        );

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
      (
        emailInput?.value || ""
      ).trim().toLowerCase();

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
        await supabase.auth.signInWithPassword({

          email,
          password

        });


      console.log(
        "ChessMate login result:",
        result
      );


      if (result.error) {

        throw result.error;

      }


      currentUser =
        result.data.user;


      showMessage(
        "Login successful! Opening your dashboard...",
        "success"
      );


      /*
       * THIS IS THE IMPORTANT PART.
       *
       * The user is automatically sent to
       * dashboard.html.
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
     FORM
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

      return "Incorrect email or password.";

    }


    if (
      lower.includes(
        "email not confirmed"
      )
    ) {

      return "Please confirm your email before logging in.";

    }


    if (
      lower.includes(
        "user already registered"
      )
    ) {

      return "This email is already registered. Please log in.";

    }


    if (
      lower.includes(
        "password should be at least"
      )
    ) {

      return "Password must be at least 6 characters.";

    }


    if (
      lower.includes("rate limit")
    ) {

      return "Too many attempts. Please wait a moment.";

    }


    if (
      lower.includes("duplicate") &&
      lower.includes("username")
    ) {

      return "That username is already taken.";

    }


    if (
      lower.includes("invalid api key") ||
      lower.includes("api key")
    ) {

      return "Supabase API configuration is incorrect. Check the key in index.html.";

    }


    return message;

  }


  /* =========================================================
     SESSION
     ========================================================= */

  async function checkCurrentSession() {

    try {

      const result =
        await supabase.auth.getSession();


      if (result.error) {

        console.error(
          "Session error:",
          result.error
        );

        return;

      }


      const session =
        result.data?.session;


      if (session?.user) {

        currentUser =
          session.user;

        console.log(
          "ChessMate: Existing session found."
        );

      }

    } catch (error) {

      console.error(
        "ChessMate session check failed:",
        error
      );

    }

  }


  /* =========================================================
     AUTH STATE
     ========================================================= */

  supabase.auth.onAuthStateChange(
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

      await supabase.auth.signOut();

      window.location.reload();

    },

    dashboard: () =>
      goToDashboard()

  };


  console.log(
    "♞ ChessMate Study initialized successfully."
  );

});
