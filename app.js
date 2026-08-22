/* =========================================================
   CHESSMATE STUDY
   Main Application
   ========================================================= */

(function () {

  "use strict";

  console.log("♞ ChessMate app.js loaded");


  /* =========================================================
     WAIT FOR PAGE
     ========================================================= */

  document.addEventListener("DOMContentLoaded", function () {

    console.log("♞ ChessMate DOM ready");


    /* =======================================================
       GET ELEMENTS
       ======================================================= */

    const authModal = document.getElementById("authModal");
    const closeAuth = document.getElementById("closeAuth");
    const authForm = document.getElementById("authForm");

    const usernameWrap =
      document.getElementById("usernameWrap");

    const displayNameWrap =
      document.getElementById("displayNameWrap");

    const usernameInput =
      document.getElementById("username");

    const displayNameInput =
      document.getElementById("displayName");

    const emailInput =
      document.getElementById("email");

    const passwordInput =
      document.getElementById("password");

    const authEyebrow =
      document.getElementById("authEyebrow");

    const authTitle =
      document.getElementById("authTitle");

    const authSubtitle =
      document.getElementById("authSubtitle");

    const authSubmit =
      document.getElementById("authSubmit");

    const authSwitch =
      document.getElementById("authSwitch");

    const authMessage =
      document.getElementById("authMessage");

    const boardSquares =
      document.getElementById("boardSquares");


    /* =======================================================
       CHECK REQUIRED ELEMENTS
       ======================================================= */

    if (!authModal) {
      console.error("ChessMate ERROR: #authModal not found.");
      return;
    }

    if (!authForm) {
      console.error("ChessMate ERROR: #authForm not found.");
      return;
    }

    console.log("♞ ChessMate authentication elements found");


    /* =======================================================
       SUPABASE
       ======================================================= */

    const supabaseClient =
      window.ChessMateSupabase ||
      window.supabaseClient;


    if (!supabaseClient) {

      console.error(
        "ChessMate ERROR: Supabase client not available."
      );

      showMessage(
        "ChessMate is not connected to Supabase. Please check index.html.",
        "error"
      );

    } else {

      console.log(
        "♞ ChessMate Supabase client found"
      );

    }


    /* =======================================================
       STATE
       ======================================================= */

    let authMode = "signup";
    let currentUser = null;


    /* =======================================================
       CHESSBOARD
       ======================================================= */

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


    /* =======================================================
       MESSAGE
       ======================================================= */

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


    /* =======================================================
       OPEN AUTH MODAL
       ======================================================= */

    function openAuth(mode) {

      authMode = mode || "signup";

      console.log(
        "♞ Opening authentication:",
        authMode
      );

      clearMessage();

      updateAuthMode();

      authModal.classList.add("open");

      authModal.classList.add("active");

      authModal.setAttribute(
        "aria-hidden",
        "false"
      );

      document.body.classList.add(
        "modal-open"
      );


      /*
       * Reset only the input values.
       */

      if (usernameInput)
        usernameInput.value = "";

      if (displayNameInput)
        displayNameInput.value = "";

      if (emailInput)
        emailInput.value = "";

      if (passwordInput)
        passwordInput.value = "";


      setTimeout(function () {

        if (authMode === "signup") {

          if (usernameInput)
            usernameInput.focus();

        } else {

          if (emailInput)
            emailInput.focus();

        }

      }, 100);

    }


    /* =======================================================
       CLOSE AUTH MODAL
       ======================================================= */

    function closeAuthModal() {

      console.log(
        "♞ Closing authentication modal"
      );

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


    /* =======================================================
       AUTH MODE
       ======================================================= */

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
          usernameWrap.style.display = "block";

        if (displayNameWrap)
          displayNameWrap.style.display = "block";


        if (usernameInput) {
          usernameInput.disabled = false;
          usernameInput.required = true;
        }

        if (displayNameInput) {
          displayNameInput.disabled = false;
          displayNameInput.required = true;
        }


        if (emailInput)
          emailInput.required = true;

        if (passwordInput) {
          passwordInput.required = true;
          passwordInput.autocomplete =
            "new-password";
        }


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


        if (emailInput)
          emailInput.required = true;

        if (passwordInput) {
          passwordInput.required = true;
          passwordInput.autocomplete =
            "current-password";
        }


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
    }


    /* =======================================================
       AUTH BUTTONS
       ======================================================= */

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
            );

          console.log(
            "♞ Auth button clicked:",
            mode
          );

          openAuth(mode);

        }
      );

    });


    /* =======================================================
       AUTH SWITCH BUTTON
       ======================================================= */

    authSwitch?.addEventListener(
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


    /* =======================================================
       CLOSE BUTTON
       ======================================================= */

    closeAuth?.addEventListener(
      "click",
      function (event) {

        event.preventDefault();

        closeAuthModal();

      }
    );


    /* =======================================================
       CLICK OUTSIDE MODAL
       ======================================================= */

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


    /* =======================================================
       ESCAPE
       ======================================================= */

    document.addEventListener(
      "keydown",
      function (event) {

        if (
          event.key === "Escape" &&
          authModal.classList.contains("open")
        ) {

          closeAuthModal();

        }

      }
    );


    /* =======================================================
       SMOOTH SCROLL
       ======================================================= */

    document
      .querySelectorAll("[data-scroll]")
      .forEach(function (button) {

        button.addEventListener(
          "click",
          function () {

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


    /* =======================================================
       USERNAME
       ======================================================= */

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


    /* =======================================================
       EMAIL
       ======================================================= */

    function isValidEmail(email) {

      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      );
    }


    /* =======================================================
       LOADING
       ======================================================= */

    function setLoading(loading) {

      if (!authSubmit) return;

      authSubmit.disabled = loading;

      if (loading) {

        authSubmit.textContent =
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


    /* =======================================================
       SIGN UP
       ======================================================= */

    async function signUp() {

      console.log(
        "♞ ChessMate signup started"
      );


      if (!supabaseClient) {

        showMessage(
          "Supabase is not connected. Please check your configuration.",
          "error"
        );

        return;
      }


      const username =
        normalizeUsername(
          usernameInput?.value || ""
        );

      const displayName =
        (displayNameInput?.value || "")
          .trim();

      const email =
        (emailInput?.value || "")
          .trim()
          .toLowerCase();

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


      if (password.length < 6) {

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
          "♞ Sending signup request to Supabase..."
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


        console.log(
          "♞ Supabase signup response:",
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
            "Account created! Please check your email and confirm your account.",
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
            "Account created successfully! Welcome to ChessMate.",
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


    /* =======================================================
       LOGIN
       ======================================================= */

    async function logIn() {

      console.log(
        "♞ ChessMate login started"
      );


      if (!supabaseClient) {

        showMessage(
          "Supabase is not connected. Please check your configuration.",
          "error"
        );

        return;
      }


      const email =
        (emailInput?.value || "")
          .trim()
          .toLowerCase();

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
          await supabaseClient.auth
            .signInWithPassword({

              email: email,

              password: password

            });


        console.log(
          "♞ Login response:",
          result
        );


        if (result.error) {

          throw result.error;

        }


        currentUser =
          result.data.user;


        showMessage(
          "Welcome back! Your board is ready.",
          "success"
        );


        setTimeout(
          function () {

            closeAuthModal();

            handleLoggedInUser(
              result.data.user
            );

          },
          700
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


    /* =======================================================
       FORM SUBMISSION
       ======================================================= */

    authForm.addEventListener(
      "submit",
      async function (event) {

        event.preventDefault();

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


    /* =======================================================
       FRIENDLY ERRORS
       ======================================================= */

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

        return "This email is already registered. Try logging in.";

      }


      if (
        lower.includes(
          "invalid api key"
        )
      ) {

        return "The Supabase API key is invalid. Please check the Publishable key in index.html.";

      }


      if (
        lower.includes(
          "failed to fetch"
        )
      ) {

        return "Could not connect to Supabase. Please check your internet connection and Supabase URL.";

      }


      if (
        lower.includes(
          "rate limit"
        )
      ) {

        return "Too many attempts. Please wait a moment and try again.";

      }


      if (
        lower.includes("duplicate") &&
        lower.includes("username")
      ) {

        return "That username is already taken.";

      }


      return message;

    }


    /* =======================================================
       SESSION
       ======================================================= */

    async function checkCurrentSession() {

      if (!supabaseClient) return;


      try {

        const result =
          await supabaseClient.auth
            .getSession();


        if (result.error) {

          console.error(
            "Session error:",
            result.error
          );

          return;
        }


        if (
          result.data &&
          result.data.session
        ) {

          currentUser =
            result.data.session.user;

          handleLoggedInUser(
            currentUser
          );

        }

      } catch (error) {

        console.error(
          "ChessMate session error:",
          error
        );

      }

    }


    /* =======================================================
       AUTH STATE
       ======================================================= */

    if (supabaseClient) {

      supabaseClient.auth.onAuthStateChange(
        function (event, session) {

          console.log(
            "♞ Auth state:",
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


    /* =======================================================
       LOGGED IN USER
       ======================================================= */

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
            "Hi, " + displayName;

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

    }


    /* =======================================================
       LOGOUT
       ======================================================= */

    async function logOut() {

      if (!supabaseClient) return;


      try {

        const result =
          await supabaseClient.auth
            .signOut();


        if (result.error) {

          throw result.error;

        }


        currentUser = null;

        window.location.reload();

      } catch (error) {

        console.error(
          "Logout error:",
          error
        );

      }

    }


    /* =======================================================
       INITIALIZE
       ======================================================= */

    updateAuthMode();

    checkCurrentSession();


    /* =======================================================
       PUBLIC API
       ======================================================= */

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

})();
