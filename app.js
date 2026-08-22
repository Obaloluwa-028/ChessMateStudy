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


  /* =========================================================
     APPLICATION STATE
     ========================================================= */

  let authMode = "signup";
  let currentUser = null;


  /* =========================================================
     SUPABASE CHECK
     ========================================================= */

  if (
    typeof supabaseClient === "undefined" ||
    !supabaseClient
  ) {
    console.error(
      "ChessMate Study: Supabase client was not found."
    );

    showMessage(
      "Supabase is not connected yet. Please check your Supabase configuration.",
      "error"
    );

    return;
  }


  /* =========================================================
     DECORATIVE CHESSBOARD
     ========================================================= */

  function createChessboard() {

    if (!boardSquares) {
      return;
    }

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

    authMode = mode;

    clearMessage();

    authForm.reset();

    updateAuthMode();

    authModal.classList.add("active");

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

    authModal.classList.remove("active");

    authModal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove("modal-open");

    clearMessage();
  }


  /* =========================================================
     UPDATE SIGNUP / LOGIN MODE
     ========================================================= */

  function updateAuthMode() {

    if (authMode === "signup") {

      authEyebrow.textContent =
        "WELCOME TO THE BOARD";

      authTitle.textContent =
        "Create your account";

      authSubtitle.textContent =
        "Your semester. Your strategy. Your board.";

      usernameWrap.style.display = "flex";
      displayNameWrap.style.display = "flex";

      usernameInput.required = true;
      displayNameInput.required = true;

      passwordInput.autocomplete =
        "new-password";

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

      usernameWrap.style.display = "none";
      displayNameWrap.style.display = "none";

      usernameInput.required = false;
      displayNameInput.required = false;

      passwordInput.autocomplete =
        "current-password";

      authSubmit.innerHTML =
        'Log In <span>→</span>';

      authSwitch.innerHTML =
        'New to ChessMate? ' +
        '<button type="button" data-switch-auth="signup">' +
        'Create an account' +
        '</button>';
    }


    /* Reconnect the switch button after changing innerHTML */

    const switchButton =
      authSwitch.querySelector(
        "[data-switch-auth]"
      );

    if (switchButton) {

      switchButton.addEventListener(
        "click",
        () => {

          const newMode =
            switchButton.dataset.switchAuth;

          openAuth(newMode);
        }
      );
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
        () => {

          const mode =
            button.dataset.openAuth;

          openAuth(mode);
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

      if (
        event.target === authModal
      ) {
        closeAuthModal();
      }
    }
  );


  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape" &&
        authModal.classList.contains("active")
      ) {
        closeAuthModal();
      }
    }
  );


  /* =========================================================
     SMOOTH SCROLL BUTTONS
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
     USERNAME NORMALIZATION
     ========================================================= */

  function normalizeUsername(username) {

    return username
      .trim()
      .toLowerCase()
      .replace(/^@/, "")
      .replace(/\s+/g, "");
  }


  /* =========================================================
     USERNAME VALIDATION
     ========================================================= */

  function isValidUsername(username) {

    /*
     * Allows:
     * letters
     * numbers
     * underscore
     * 3–20 characters
     */

    return /^[a-z0-9_]{3,20}$/.test(
      username
    );
  }


  /* =========================================================
     EMAIL VALIDATION
     ========================================================= */

  function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
    );
  }


  /* =========================================================
     PASSWORD VALIDATION
     ========================================================= */

  function isValidPassword(password) {

    return password.length >= 6;
  }


  /* =========================================================
     MESSAGE HANDLING
     ========================================================= */

  function showMessage(
    message,
    type = "info"
  ) {

    if (!authMessage) {
      return;
    }

    authMessage.textContent = message;

    authMessage.className =
      "auth-message " + type;
  }


  function clearMessage() {

    if (!authMessage) {
      return;
    }

    authMessage.textContent = "";

    authMessage.className =
      "auth-message";
  }


  /* =========================================================
     BUTTON LOADING STATE
     ========================================================= */

  function setLoading(
    loading,
    text
  ) {

    authSubmit.disabled = loading;

    if (loading) {

      authSubmit.innerHTML =
        `<span class="auth-loading">` +
        `Please wait...` +
        `</span>`;

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
      emailInput.value.trim().toLowerCase();

    const password =
      passwordInput.value;


    /* Validate username */

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
        "Username must be 3–20 characters and can only contain letters, numbers, and underscores.",
        "error"
      );

      usernameInput.focus();

      return;
    }


    /* Validate display name */

    if (!displayName) {

      showMessage(
        "Please enter your display name.",
        "error"
      );

      displayNameInput.focus();

      return;
    }


    /* Validate email */

    if (!isValidEmail(email)) {

      showMessage(
        "Please enter a valid email address.",
        "error"
      );

      emailInput.focus();

      return;
    }


    /* Validate password */

    if (!isValidPassword(password)) {

      showMessage(
        "Your password must be at least 6 characters.",
        "error"
      );

      passwordInput.focus();

      return;
    }


    setLoading(true);

    clearMessage();


    try {

      /*
       * Create the Supabase Auth account.
       *
       * We put the user's ChessMate information
       * inside user_metadata for now.
       *
       * Later, we'll create the proper profiles
       * table and move this information into it.
       */

      const {
        data,
        error
      } = await supabaseClient.auth.signUp({

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
          "ChessMate signup error:",
          error
        );

        throw error;
      }


      /*
       * Supabase may require email confirmation
       * depending on your project settings.
       */

      if (
        data.user &&
        !data.session
      ) {

        showMessage(
          "Account created! Check your email to confirm your account, then log in.",
          "success"
        );

        authForm.reset();

        return;
      }


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

        }, 1200);

        return;
      }


      showMessage(
        "Account created successfully.",
        "success"
      );

    } catch (error) {

      console.error(error);

      showMessage(
        getFriendlyAuthError(error),
        "error"
      );

    } finally {

      setLoading(false);
    }
  }


  /* =========================================================
     LOG IN
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
          "ChessMate login error:",
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

      }, 900);


    } catch (error) {

      console.error(error);

      showMessage(
        getFriendlyAuthError(error),
        "error"
      );

    } finally {

      setLoading(false);
    }
  }


  /* =========================================================
     AUTH FORM SUBMISSION
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
     FRIENDLY AUTH ERRORS
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
      lower.includes("network")
    )
    {

      return "Network error. Please check your internet connection.";
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

        console.error(
          "Session error:",
          error
        );

        return;
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
        "Could not check session:",
        error
      );
    }
  }


  /* =========================================================
     AUTH STATE LISTENER
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
     LOGGED-IN USER HANDLER
     ========================================================= */

  function handleLoggedInUser(user) {

    if (!user) {
      return;
    }


    console.log(
      "ChessMate user:",
      user
    );


    /*
     * For now we simply update the interface.
     *
     * The next stage will replace this with
     * the actual ChessMate Study dashboard.
     */

    const displayName =
      user.user_metadata?.display_name ||
      user.user_metadata?.username ||
      user.email?.split("@")[0] ||
      "Student";


    /*
     * Change the navigation buttons
     * once the user is logged in.
     */

    const loginButtons =
      document.querySelectorAll(
        '[data-open-auth="login"]'
      );

    const signupButtons =
      document.querySelectorAll(
        '[data-open-auth="signup"]'
      );


    loginButtons.forEach(button => {

      button.textContent =
        `Hi, ${displayName}`;

      button.removeAttribute(
        "data-open-auth"
      );

    });


    signupButtons.forEach(button => {

      if (
        button.closest(".navbar")
      ) {

        button.textContent =
          "Log out";

        button.removeAttribute(
          "data-open-auth"
        );

        button.addEventListener(
          "click",
          logOut
        );
      }

    });


    console.log(
      `Welcome to ChessMate Study, ${displayName}!`
    );
  }


  /* =========================================================
     LOG OUT
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


      /*
       * Reload the page so the public
       * landing page returns to its
       * normal state.
       */

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
     DEBUG HELPER
     ========================================================= */

  window.ChessMate = {

    getUser: () => currentUser,

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
