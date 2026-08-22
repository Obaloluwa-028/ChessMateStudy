/* =========================================================
   CHESSMATE STUDY
   Authentication & Application Controller
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     SUPABASE CLIENT
     ========================================================= */

  const supabaseClient = window.ChessMateSupabase;

  if (!supabaseClient) {
    console.error(
      "ChessMate: Supabase client was not found."
    );

    alert(
      "ChessMate is not connected to Supabase. Please check your Supabase configuration in index.html."
    );

    return;
  }

  console.log("♞ ChessMate: Supabase client detected.");


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
     AUTH MODAL
     ========================================================= */

  function openAuth(mode = "signup") {

    if (!authModal) {
      console.error("ChessMate: Auth modal not found.");
      return;
    }

    authMode = mode;

    clearMessage();

    if (authForm) {
      authForm.reset();
    }

    updateAuthMode();

    authModal.classList.add("open");

    authModal.setAttribute(
      "aria-hidden",
      "false"
    );

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

    authModal.classList.remove("open");

    authModal.setAttribute(
      "aria-hidden",
      "true"
    );

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

      button.addEventListener("click", event => {

        event.preventDefault();

        const mode =
          button.dataset.openAuth;

        console.log(
          "ChessMate: Opening auth:",
          mode
        );

        openAuth(mode);

      });

    });


  /* =========================================================
     CLOSE AUTH
     ========================================================= */

  if (closeAuth) {

    closeAuth.addEventListener(
      "click",
      closeAuthModal
    );

  }


  if (authModal) {

    authModal.addEventListener(
      "click",
      event => {

        if (event.target === authModal) {
          closeAuthModal();
        }

      }
    );

  }


  document.addEventListener(
    "keydown",
    event => {

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
    .forEach(button => {

      button.addEventListener("click", event => {

        event.preventDefault();

        const target =
          document.querySelector(
            button.dataset.scroll
          );

        if (target) {

          target.scrollIntoView({
            behavior: "smooth"
          });

        }

      });

    });


  /* =========================================================
     USERNAME
     ========================================================= */

  function normalizeUsername(username) {

    return String(username || "")
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

    return String(password || "").length >= 6;
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
        usernameInput?.value
      );

    const displayName =
      displayNameInput?.value.trim() || "";

    const email =
      emailInput?.value.trim().toLowerCase() || "";

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

      console.log(
        "ChessMate: Creating account..."
      );


      const result =
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


      const data = result.data;
      const error = result.error;


      if (error) {

        console.error(
          "Supabase signup error:",
          error
        );

        throw error;
      }


      console.log(
        "ChessMate: Signup response:",
        data
      );


      /* EMAIL CONFIRMATION REQUIRED */

      if (
        data &&
        data.user &&
        !data.session
      ) {

        showMessage(
          "Account created! Please check your email and click the confirmation link.",
          "success"
        );

        return;
      }


      /* IMMEDIATE LOGIN */

      if (
        data &&
        data.user &&
        data.session
      ) {

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
        "Your account was created. Please check your email.",
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
      emailInput?.value.trim().toLowerCase() || "";

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

      console.log(
        "ChessMate: Logging in..."
      );


      const result =
        await supabaseClient.auth.signInWithPassword({

          email: email,

          password: password

        });


      const data = result.data;
      const error = result.error;


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

  if (authForm) {

    authForm.addEventListener(
      "submit",
      async event => {

        event.preventDefault();

        console.log(
          "ChessMate: Auth form submitted."
        );


        if (authMode === "signup") {

          await signUp();

        } else {

          await logIn();

        }

      }
    );

  }


  /* =========================================================
     FRIENDLY SUPABASE ERRORS
     ========================================================= */

  function getFriendlyAuthError(error) {

    const message =
      error?.message ||
      "Something went wrong. Please try again.";


    const lower =
      message.toLowerCase();


    if (
      lower.includes("invalid api key") ||
      lower.includes("invalid api_key") ||
      lower.includes("apikey")
    ) {

      return "The Supabase Publishable key is invalid. Please copy the current Publishable key from Supabase → Settings → API and replace the key in index.html.";
    }


    if (
      lower.includes("failed to fetch") ||
      lower.includes("network")
    ) {

      return "Unable to connect to Supabase. Please check your internet connection and try again.";
    }


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


    return message;
  }


  /* =========================================================
     CURRENT SESSION
     ========================================================= */

  async function checkCurrentSession() {

    try {

      const result =
        await supabaseClient.auth.getSession();


      if (result.error) {

        console.error(
          "ChessMate session error:",
          result.error
        );

        return;
      }


      const session =
        result.data?.session;


      if (session?.user) {

        currentUser =
          session.user;

        handleLoggedInUser(
          session.user
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


    /* LOGIN BUTTON */

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


    /* SIGNUP BUTTON BECOMES LOGOUT */

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


    console.log(
      `♞ Welcome to ChessMate Study, ${displayName}!`
    );
  }


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
     GLOBAL CHESSMATE API
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
