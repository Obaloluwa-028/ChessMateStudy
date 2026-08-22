/* =========================================================
   CHESSMATE STUDY
   Main Application Controller
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  console.log("♞ ChessMate Study: app.js loaded");

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

  const supabaseReady =
    typeof window.supabase !== "undefined" &&
    typeof window.supabaseClient !== "undefined" &&
    window.supabaseClient !== null;

  if (!supabaseReady) {
    console.warn(
      "ChessMate: Supabase client is not available."
    );
  } else {
    console.log(
      "ChessMate: Supabase client detected."
    );
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
     AUTH MODE
     ========================================================= */

  function updateAuthMode() {

    if (!authModal) return;

    if (authMode === "signup") {

      if (authEyebrow) {
        authEyebrow.textContent =
          "WELCOME TO THE BOARD";
      }

      if (authTitle) {
        authTitle.textContent =
          "Create your account";
      }

      if (authSubtitle) {
        authSubtitle.textContent =
          "Your semester. Your strategy. Your board.";
      }

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
        passwordInput.autocomplete =
          "new-password";
      }

      if (authSubmit) {
        authSubmit.innerHTML =
          'Create Account <span>→</span>';
      }

      if (authSwitch) {
        authSwitch.innerHTML =
          'Already have an account? ' +
          '<button type="button" data-switch-auth="login">' +
          'Log in' +
          '</button>';
      }

    } else {

      if (authEyebrow) {
        authEyebrow.textContent =
          "WELCOME BACK";
      }

      if (authTitle) {
        authTitle.textContent =
          "Log in to ChessMate";
      }

      if (authSubtitle) {
        authSubtitle.textContent =
          "Continue your study journey.";
      }

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

      if (authSubmit) {
        authSubmit.innerHTML =
          'Log In <span>→</span>';
      }

      if (authSwitch) {
        authSwitch.innerHTML =
          'New to ChessMate? ' +
          '<button type="button" data-switch-auth="signup">' +
          'Create an account' +
          '</button>';
      }
    }
  }


  /* =========================================================
     OPEN MODAL
     ========================================================= */

  function openAuth(mode) {

    console.log(
      "ChessMate: openAuth() called:",
      mode
    );

    if (!authModal) {

      console.error(
        "ChessMate ERROR: #authModal was not found in HTML."
      );

      return;
    }

    authMode =
      mode === "login"
        ? "login"
        : "signup";

    clearMessage();

    if (authForm) {
      authForm.reset();
    }

    updateAuthMode();

    /*
     * IMPORTANT:
     * Your CSS uses .open.
     */
    authModal.classList.add("open");

    /*
     * Also add active so this works even if
     * another stylesheet expects .active.
     */
    authModal.classList.add("active");

    authModal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add(
      "modal-open"
    );

    console.log(
      "ChessMate: modal opened."
    );

    setTimeout(function () {

      if (
        authMode === "signup" &&
        usernameInput
      ) {

        usernameInput.focus();

      } else if (emailInput) {

        emailInput.focus();

      }

    }, 150);
  }


  /* =========================================================
     CLOSE MODAL
     ========================================================= */

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
     OPEN BUTTONS
     ========================================================= */

  const authButtons =
    document.querySelectorAll(
      "[data-open-auth]"
    );

  console.log(
    "ChessMate: auth buttons found:",
    authButtons.length
  );


  authButtons.forEach(function (button) {

    button.addEventListener(
      "click",
      function (event) {

        event.preventDefault();
        event.stopPropagation();

        const mode =
          button.getAttribute(
            "data-open-auth"
          );

        console.log(
          "ChessMate: button clicked:",
          mode
        );

        openAuth(mode);

      }
    );

  });


  /* =========================================================
     CLOSE BUTTON
     ========================================================= */

  if (closeAuth) {

    closeAuth.addEventListener(
      "click",
      function (event) {

        event.preventDefault();

        closeAuthModal();

      }
    );
  }


  /* =========================================================
     CLICK OUTSIDE MODAL
     ========================================================= */

  if (authModal) {

    authModal.addEventListener(
      "click",
      function (event) {

        if (
          event.target === authModal
        ) {

          closeAuthModal();

        }

      }
    );
  }


  /* =========================================================
     ESCAPE KEY
     ========================================================= */

  document.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key === "Escape" &&
        authModal &&
        (
          authModal.classList.contains("open") ||
          authModal.classList.contains("active")
        )
      ) {

        closeAuthModal();

      }

    }
  );


  /* =========================================================
     SWITCH LOGIN / SIGNUP
     ========================================================= */

  if (authSwitch) {

    authSwitch.addEventListener(
      "click",
      function (event) {

        const button =
          event.target.closest(
            "[data-switch-auth]"
          );

        if (!button) return;

        event.preventDefault();

        openAuth(
          button.getAttribute(
            "data-switch-auth"
          )
        );

      }
    );
  }


  /* =========================================================
     SMOOTH SCROLL
     ========================================================= */

  document
    .querySelectorAll("[data-scroll]")
    .forEach(function (button) {

      button.addEventListener(
        "click",
        function (event) {

          event.preventDefault();

          const target =
            document.querySelector(
              button.getAttribute(
                "data-scroll"
              )
            );

          if (target) {

            target.scrollIntoView({
              behavior: "smooth"
            });

          }

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
     LOADING
     ========================================================= */

  function setLoading(loading) {

    if (!authSubmit) return;

    authSubmit.disabled =
      loading;

    if (loading) {

      authSubmit.textContent =
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

    /*
     * Check Supabase first.
     */

    if (!supabaseReady) {

      showMessage(
        "ChessMate is not connected to Supabase yet. Please check the Supabase configuration in index.html.",
        "error"
      );

      return;
    }


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

      console.log(
        "ChessMate: sending signup request..."
      );

      const result =
        await supabaseClient.auth.signUp({

          email: email,

          password: password,

          options: {

            data: {

              username:
                username,

              display_name:
                displayName

            }

          }

        });


      const data =
        result.data;

      const error =
        result.error;


      if (error) {

        console.error(
          "Supabase signup error:",
          error
        );

        throw error;
      }


      console.log(
        "ChessMate: signup successful:",
        data
      );


      if (
        data.user &&
        !data.session
      ) {

        showMessage(
          "Account created! Check your email to confirm your ChessMate account.",
          "success"
        );

        authForm?.reset();

        return;
      }


      if (
        data.user &&
        data.session
      ) {

        currentUser =
          data.user;

        showMessage(
          "Account created successfully! Welcome to ChessMate Study.",
          "success"
        );

        setTimeout(
          function () {

            closeAuthModal();

            handleLoggedInUser(
              data.user
            );

          },
          900
        );

        return;
      }


      showMessage(
        "Account created successfully!",
        "success"
      );


    } catch (error) {

      console.error(
        "ChessMate signup failed:",
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

    if (!supabaseReady) {

      showMessage(
        "ChessMate is not connected to Supabase yet. Please check index.html.",
        "error"
      );

      return;
    }


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

      const {
        data,
        error
      } =
        await supabaseClient.auth.signInWithPassword({

          email:
            email,

          password:
            password

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


      setTimeout(
        function () {

          closeAuthModal();

          handleLoggedInUser(
            data.user
          );

        },
        800
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

  if (authForm) {

    authForm.addEventListener(
      "submit",
      async function (event) {

        event.preventDefault();

        if (authMode === "signup") {

          await signUp();

        } else {

          await logIn();

        }

      }
    );
  }


  /* =========================================================
     FRIENDLY ERRORS
     ========================================================= */

  function getFriendlyAuthError(error) {

    const message =
      error?.message ||
      "Something went wrong.";

    const lower =
      message.toLowerCase();


    if (
      lower.includes(
        "invalid api key"
      )
    ) {

      return (
        "Invalid Supabase Publishable key. " +
        "Open Supabase → Settings → API Keys and copy the exact Publishable key."
      );
    }


    if (
      lower.includes(
        "invalid login credentials"
      )
    ) {

      return (
        "Incorrect email or password."
      );
    }


    if (
      lower.includes(
        "email not confirmed"
      )
    ) {

      return (
        "Please confirm your email address first."
      );
    }


    if (
      lower.includes(
        "user already registered"
      )
    ) {

      return (
        "This email is already registered. Try logging in."
      );
    }


    if (
      lower.includes(
        "password should be at least"
      )
    ) {

      return (
        "Password must be at least 6 characters."
      );
    }


    if (
      lower.includes(
        "duplicate"
      ) &&
      lower.includes(
        "username"
      )
    ) {

      return (
        "That username is already taken."
      );
    }


    if (
      lower.includes(
        "rate limit"
      ) ||
      lower.includes(
        "too many requests"
      )
    ) {

      return (
        "Too many attempts. Please wait a moment and try again."
      );
    }


    return message;
  }


  /* =========================================================
     CURRENT SESSION
     ========================================================= */

  async function checkCurrentSession() {

    if (!supabaseReady) {
      return;
    }

    try {

      const {
        data,
        error
      } =
        await supabaseClient.auth.getSession();


      if (error) {
        throw error;
      }


      if (
        data &&
        data.session &&
        data.session.user
      ) {

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

  if (supabaseReady) {

    supabaseClient.auth.onAuthStateChange(
      function (event, session) {

        console.log(
          "ChessMate auth event:",
          event
        );

        if (
          session &&
          session.user
        ) {

          currentUser =
            session.user;

        } else {

          currentUser =
            null;

        }

      }
    );
  }


  /* =========================================================
     LOGGED IN USER
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


    loginButtons.forEach(
      function (button) {

        button.textContent =
          `Hi, ${displayName}`;

        button.removeAttribute(
          "data-open-auth"
        );

      }
    );


    const signupButton =
      document.querySelector(
        ".navbar [data-open-auth='signup']"
      );


    if (signupButton) {

      signupButton.textContent =
        "Log out";

      signupButton.removeAttribute(
        "data-open-auth"
      );

      signupButton.addEventListener(
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

    if (!supabaseReady) {
      return;
    }

    try {

      const {
        error
      } =
        await supabaseClient.auth.signOut();


      if (error) {
        throw error;
      }


      currentUser =
        null;

      window.location.reload();


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
     PUBLIC DEBUG API
     ========================================================= */

  window.ChessMate = {

    getUser:
      function () {
        return currentUser;
      },

    openLogin:
      function () {
        openAuth("login");
      },

    openSignup:
      function () {
        openAuth("signup");
      },

    closeAuth:
      function () {
        closeAuthModal();
      },

    logout:
      function () {
        return logOut();
      }

  };


  console.log(
    "♞ ChessMate Study initialized successfully."
  );

});
