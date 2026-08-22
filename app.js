/* =========================================================
   CHESSMATE STUDY
   Authentication & Application Controller
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  console.log("♞ ChessMate app.js loaded.");

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
     SUPABASE
     ========================================================= */

  const supabaseClient =
    window.ChessMateSupabase || null;


  if (supabaseClient) {

    console.log(
      "♞ ChessMate: Supabase client detected."
    );

  } else {

    console.warn(
      "ChessMate: Supabase client not detected yet."
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
     OPEN AUTH MODAL
     ========================================================= */

  function openAuth(mode) {

    mode = mode || "signup";

    console.log(
      "♞ Opening auth:",
      mode
    );

    authMode = mode;

    clearMessage();

    if (authForm) {
      authForm.reset();
    }

    updateAuthMode();


    if (!authModal) {

      console.error(
        "ChessMate: authModal was not found."
      );

      return;
    }


    /*
     * IMPORTANT:
     * Your CSS uses .open, not .active.
     */

    authModal.classList.add("open");

    authModal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add(
      "modal-open"
    );


    console.log(
      "♞ Auth modal opened."
    );


    setTimeout(function () {

      if (authMode === "signup") {

        if (usernameInput) {
          usernameInput.focus();
        }

      } else {

        if (emailInput) {
          emailInput.focus();
        }

      }

    }, 100);
  }


  /* =========================================================
     CLOSE AUTH MODAL
     ========================================================= */

  function closeAuthModal() {

    if (!authModal) return;

    authModal.classList.remove("open");

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

      console.error(
        "ChessMate: Authentication elements missing."
      );

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

        passwordInput.autocomplete =
          "new-password";

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

        passwordInput.autocomplete =
          "current-password";

      }


      authSubmit.innerHTML =
        'Log In <span>→</span>';


      authSwitch.innerHTML =
        'New to ChessMate? ' +
        '<button type="button" data-switch-auth="signup">Create an account</button>';
    }


    const switchButton =
      authSwitch.querySelector(
        "[data-switch-auth]"
      );


    if (switchButton) {

      switchButton.onclick = function () {

        openAuth(
          switchButton.dataset.switchAuth
        );

      };

    }
  }


  /* =========================================================
     AUTH BUTTONS
     ========================================================= */

  const authButtons =
    document.querySelectorAll(
      "[data-open-auth]"
    );


  console.log(
    "♞ ChessMate auth buttons found:",
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
          ) || "signup";


        console.log(
          "♞ Auth button clicked:",
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
     CLOSE BY BACKDROP
     ========================================================= */

  if (authModal) {

    authModal.addEventListener(
      "click",
      function (event) {

        if (event.target === authModal) {

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
        authModal.classList.contains("open")
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
    .forEach(function (button) {

      button.addEventListener(
        "click",
        function () {

          const target =
            document.querySelector(
              button.dataset.scroll
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
     MESSAGE
     ========================================================= */

  function showMessage(
    message,
    type
  ) {

    if (!authMessage) return;

    authMessage.textContent =
      message;

    authMessage.className =
      "auth-message " +
      (type || "info");
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

    console.log(
      "♞ ChessMate: Signup started."
    );


    if (!supabaseClient) {

      showMessage(
        "Supabase is not connected. Please check the Supabase configuration in index.html.",
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
        "♞ ChessMate: Sending signup request to Supabase..."
      );


      const result =
        await supabaseClient.auth.signUp({

          email: email,

          password: password,

          options: {

            data: {

              username: username,

              display_name:
                displayName

            }

          }

        });


      console.log(
        "♞ Supabase signup result:",
        result
      );


      if (result.error) {

        throw result.error;

      }


      const data =
        result.data;


      if (
        data &&
        data.user &&
        !data.session
      ) {

        showMessage(
          "Account created! Please check your email to confirm your account.",
          "success"
        );

        authForm.reset();

        return;
      }


      if (
        data &&
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
          1000
        );

        return;
      }


      showMessage(
        "Account created successfully!",
        "success"
      );


    } catch (error) {

      console.error(
        "♞ ChessMate signup error:",
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
        "Supabase is not connected. Please check the Supabase configuration in index.html.",
        "error"
      );

      return;
    }


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

      const {
        data,
        error
      } =
        await supabaseClient.auth
          .signInWithPassword({

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
     FORM SUBMIT
     ========================================================= */

  if (authForm) {

    authForm.addEventListener(
      "submit",
      async function (event) {

        event.preventDefault();

        event.stopPropagation();


        console.log(
          "♞ ChessMate form submitted:",
          authMode
        );


        if (authMode === "signup") {

          await signUp();

        } else {

          await logIn();

        }

      }
    );

  } else {

    console.error(
      "ChessMate: authForm not found."
    );

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


    if (
      lower.includes("invalid api key")
    ) {

      return (
        "Supabase rejected the API key. " +
        "Please check the Publishable key in index.html."
      );
    }


    if (
      lower.includes("invalid login credentials")
    ) {

      return (
        "Incorrect email or password. " +
        "Please try again."
      );
    }


    if (
      lower.includes("email not confirmed")
    ) {

      return (
        "Please confirm your email address before logging in."
      );
    }


    if (
      lower.includes("user already registered")
    ) {

      return (
        "An account with this email already exists. Try logging in."
      );
    }


    if (
      lower.includes("password should be")
    ) {

      return (
        "Your password must be at least 6 characters."
      );
    }


    if (
      lower.includes("rate limit")
    ) {

      return (
        "Too many attempts. Please wait a moment and try again."
      );
    }


    if (
      lower.includes("duplicate") &&
      lower.includes("username")
    ) {

      return (
        "That username is already taken. Please choose another."
      );
    }


    if (
      lower.includes("failed to fetch")
    ) {

      return (
        "Unable to connect to Supabase. Please check your internet connection."
      );
    }


    return message;
  }


  /* =========================================================
     SESSION
     ========================================================= */

  async function checkCurrentSession() {

    if (!supabaseClient) return;


    try {

      const {
        data,
        error
      } =
        await supabaseClient.auth
          .getSession();


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

    supabaseClient.auth
      .onAuthStateChange(
        function (event, session) {

          console.log(
            "ChessMate auth event:",
            event
          );


          if (session?.user) {

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

      signupButton.onclick =
        logOut;

    }
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
        await supabaseClient.auth
          .signOut();


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

    getUser: function () {
      return currentUser;
    },

    openLogin: function () {
      openAuth("login");
    },

    openSignup: function () {
      openAuth("signup");
    },

    logout: function () {
      logOut();
    }

  };


  console.log(
    "♞ ChessMate Study initialized successfully."
  );

});
