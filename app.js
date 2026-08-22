/* =========================================================
   CHESSMATE STUDY
   FINAL APPLICATION CONTROLLER
   Dashboard + Authentication + Course System
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     SUPABASE
     ========================================================= */

  const supabaseClient =
    window.ChessMateSupabase;

  if (!supabaseClient) {
    console.error("ChessMate: Supabase client was not found.");
    return;
  }

  console.log("♞ ChessMate: Supabase connected.");


  /* =========================================================
     ELEMENTS
     ========================================================= */

  const authModal =
    document.getElementById("authModal");

  const closeAuth =
    document.getElementById("closeAuth");

  const authForm =
    document.getElementById("authForm");

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

      authEyebrow.textContent =
        "WELCOME TO THE BOARD";

      authTitle.textContent =
        "Create your account";

      authSubtitle.textContent =
        "Your semester. Your strategy. Your board.";

      usernameWrap.style.display = "flex";
      displayNameWrap.style.display = "flex";

      usernameInput.disabled = false;
      displayNameInput.disabled = false;

      usernameInput.required = true;
      displayNameInput.required = true;

      passwordInput.autocomplete =
        "new-password";

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

      usernameWrap.style.display = "none";
      displayNameWrap.style.display = "none";

      usernameInput.disabled = true;
      displayNameInput.disabled = true;

      usernameInput.required = false;
      displayNameInput.required = false;

      passwordInput.autocomplete =
        "current-password";

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

      switchButton.onclick = () => {

        openAuth(
          switchButton.dataset.switchAuth
        );

      };
    }
  }


  /* =========================================================
     AUTH BUTTONS
     ========================================================= */

  document
    .querySelectorAll("[data-open-auth]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          openAuth(
            button.dataset.openAuth
          );

        }
      );

    });


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
        usernameInput.value
      );

    const displayName =
      displayNameInput.value.trim();

    const email =
      emailInput.value.trim().toLowerCase();

    const password =
      passwordInput.value;


    if (!isValidUsername(username)) {

      showMessage(
        "Username must be 3–20 characters using letters, numbers or underscores.",
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

      const {
        data,
        error
      } =
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


      if (error) {
        throw error;
      }


      if (data.user && !data.session) {

        showMessage(
          "Account created! Check your email to confirm your account.",
          "success"
        );

        authForm.reset();

        usernameInput.disabled = false;
        displayNameInput.disabled = false;

        usernameInput.required = true;
        displayNameInput.required = true;

        return;
      }


      if (data.session) {

        currentUser = data.user;

        closeAuthModal();

        showDashboard(
          data.user
        );

        return;
      }


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

          email,
          password

        });


      if (error) {
        throw error;
      }


      currentUser =
        data.user;


      closeAuthModal();

      showDashboard(
        data.user
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
      "Something went wrong.";

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

      return "This email already has an account. Please log in.";
    }


    if (
      lower.includes(
        "rate limit"
      )
    ) {

      return "Too many attempts. Please wait a moment.";
    }


    if (
      lower.includes("duplicate") &&
      lower.includes("username")
    ) {

      return "That username is already taken.";
    }


    return message;
  }


  /* =========================================================
     DASHBOARD STYLES
     ========================================================= */

  function injectDashboardStyles() {

    if (document.getElementById(
      "chessmate-dashboard-styles"
    )) return;


    const style =
      document.createElement("style");

    style.id =
      "chessmate-dashboard-styles";


    style.textContent = `

      body.chessmate-dashboard {
        margin: 0;
        background:
          radial-gradient(
            circle at top right,
            #202b3d 0%,
            #0b0f16 42%,
            #070a0f 100%
          );
        color: #f4f7fb;
        font-family: "DM Sans", sans-serif;
        min-height: 100vh;
      }

      body.chessmate-dashboard .site-bg,
      body.chessmate-dashboard .navbar,
      body.chessmate-dashboard main,
      body.chessmate-dashboard footer {
        display: none !important;
      }

      .cm-dashboard {
        min-height: 100vh;
        background:
          linear-gradient(
            135deg,
            rgba(255,255,255,.02),
            transparent 35%
          );
      }

      .cm-topbar {
        height: 76px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 5%;
        border-bottom: 1px solid rgba(255,255,255,.08);
        background: rgba(7,10,15,.88);
        backdrop-filter: blur(18px);
        position: sticky;
        top: 0;
        z-index: 20;
      }

      .cm-brand {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 20px;
        font-weight: 700;
      }

      .cm-brand-piece {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        display: grid;
        place-items: center;
        background: #d8b36a;
        color: #111;
        font-size: 25px;
      }

      .cm-user {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .cm-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: linear-gradient(135deg,#d8b36a,#8d6c2e);
        color: #111;
        font-weight: 800;
      }

      .cm-logout {
        border: 1px solid rgba(255,255,255,.12);
        background: rgba(255,255,255,.05);
        color: #fff;
        padding: 10px 16px;
        border-radius: 10px;
        cursor: pointer;
      }

      .cm-container {
        width: min(1200px, 90%);
        margin: 0 auto;
        padding: 45px 0 70px;
      }

      .cm-welcome {
        display: flex;
        justify-content: space-between;
        align-items: end;
        gap: 20px;
        margin-bottom: 32px;
      }

      .cm-welcome h1 {
        margin: 5px 0 8px;
        font-family: "Playfair Display", serif;
        font-size: clamp(32px,5vw,52px);
      }

      .cm-welcome p {
        color: #9da8b8;
        margin: 0;
      }

      .cm-eyebrow {
        color: #d8b36a;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 2px;
      }

      .cm-add {
        border: 0;
        background: #d8b36a;
        color: #111;
        padding: 14px 20px;
        border-radius: 12px;
        font-weight: 800;
        cursor: pointer;
        box-shadow: 0 10px 30px rgba(216,179,106,.15);
      }

      .cm-stats {
        display: grid;
        grid-template-columns: repeat(3,1fr);
        gap: 18px;
        margin-bottom: 35px;
      }

      .cm-stat {
        padding: 22px;
        border: 1px solid rgba(255,255,255,.08);
        background: rgba(255,255,255,.045);
        border-radius: 18px;
      }

      .cm-stat-icon {
        font-size: 24px;
      }

      .cm-stat strong {
        display: block;
        font-size: 30px;
        margin: 8px 0 3px;
      }

      .cm-stat span {
        color: #8f9bab;
        font-size: 13px;
      }

      .cm-section-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 18px;
      }

      .cm-section-title h2 {
        margin: 0;
        font-size: 22px;
      }

      .cm-courses {
        display: grid;
        grid-template-columns: repeat(3,1fr);
        gap: 18px;
      }

      .cm-course {
        border: 1px solid rgba(255,255,255,.08);
        background:
          linear-gradient(
            145deg,
            rgba(255,255,255,.07),
            rgba(255,255,255,.025)
          );
        border-radius: 20px;
        padding: 23px;
        position: relative;
        overflow: hidden;
      }

      .cm-course::after {
        content: "♞";
        position: absolute;
        right: -5px;
        bottom: -25px;
        font-size: 100px;
        opacity: .035;
      }

      .cm-course-code {
        color: #d8b36a;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 1.5px;
      }

      .cm-course h3 {
        margin: 8px 0 6px;
        font-size: 20px;
      }

      .cm-course p {
        color: #8f9bab;
        margin: 0 0 20px;
        font-size: 13px;
      }

      .cm-progress-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 12px;
      }

      .cm-progress {
        height: 7px;
        border-radius: 20px;
        background: rgba(255,255,255,.08);
        overflow: hidden;
      }

      .cm-progress i {
        display: block;
        height: 100%;
        background: linear-gradient(
          90deg,
          #d8b36a,
          #f0d48d
        );
        border-radius: inherit;
      }

      .cm-empty {
        grid-column: 1/-1;
        text-align: center;
        padding: 60px 20px;
        border: 1px dashed rgba(255,255,255,.15);
        border-radius: 20px;
        color: #8792a3;
      }

      .cm-empty-piece {
        font-size: 55px;
        margin-bottom: 12px;
        color: #d8b36a;
      }

      .cm-modal {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,.75);
        backdrop-filter: blur(10px);
        display: grid;
        place-items: center;
        z-index: 100;
        padding: 20px;
      }

      .cm-modal-box {
        width: min(480px,100%);
        background: #111722;
        border: 1px solid rgba(255,255,255,.1);
        border-radius: 22px;
        padding: 28px;
        box-shadow: 0 30px 100px rgba(0,0,0,.5);
      }

      .cm-modal-box h2 {
        margin-top: 0;
        font-family: "Playfair Display", serif;
      }

      .cm-form-group {
        margin-bottom: 16px;
      }

      .cm-form-group label {
        display: block;
        margin-bottom: 7px;
        font-size: 13px;
        color: #aab4c2;
      }

      .cm-form-group input {
        width: 100%;
        box-sizing: border-box;
        padding: 13px;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,.1);
        background: #0b1018;
        color: #fff;
        outline: none;
      }

      .cm-modal-actions {
        display: flex;
        gap: 10px;
        margin-top: 22px;
      }

      .cm-modal-actions button {
        flex: 1;
        padding: 13px;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 700;
      }

      .cm-cancel {
        background: transparent;
        border: 1px solid rgba(255,255,255,.12);
        color: #fff;
      }

      .cm-save {
        background: #d8b36a;
        border: 0;
        color: #111;
      }

      @media(max-width:800px) {

        .cm-stats,
        .cm-courses {
          grid-template-columns: 1fr;
        }

        .cm-welcome {
          align-items: stretch;
          flex-direction: column;
        }

        .cm-topbar {
          padding: 0 5%;
        }

        .cm-user span {
          display: none;
        }

      }

    `;

    document.head.appendChild(style);
  }


  /* =========================================================
     COURSE STORAGE
     ========================================================= */

  function getCourseStorageKey() {

    if (!currentUser) {
      return "chessmate_courses_guest";
    }

    return "chessmate_courses_" +
      currentUser.id;
  }


  function getCourses() {

    try {

      return JSON.parse(
        localStorage.getItem(
          getCourseStorageKey()
        ) || "[]"
      );

    } catch {

      return [];
    }
  }


  function saveCourses(courses) {

    localStorage.setItem(
      getCourseStorageKey(),
      JSON.stringify(courses)
    );
  }


  /* =========================================================
     DASHBOARD
     ========================================================= */

  function showDashboard(user) {

    currentUser = user;

    injectDashboardStyles();

    document.body.classList.add(
      "chessmate-dashboard"
    );


    let dashboard =
      document.getElementById(
        "chessmateDashboard"
      );


    if (!dashboard) {

      dashboard =
        document.createElement("div");

      dashboard.id =
        "chessmateDashboard";

      document.body.appendChild(
        dashboard
      );
    }


    const displayName =
      user.user_metadata?.display_name ||
      user.user_metadata?.username ||
      user.email?.split("@")[0] ||
      "Student";


    const firstName =
      displayName
        .split(" ")[0];


    renderDashboard(
      dashboard,
      firstName
    );
  }


  /* =========================================================
     RENDER DASHBOARD
     ========================================================= */

  function renderDashboard(
    dashboard,
    firstName
  ) {

    const courses =
      getCourses();


    const totalProgress =
      courses.length
        ? Math.round(
            courses.reduce(
              (sum, course) =>
                sum + Number(course.progress || 0),
              0
            ) / courses.length
          )
        : 0;


    const xp =
      courses.reduce(
        (sum, course) =>
          sum + Number(course.progress || 0) * 2,
        0
      );


    const level =
      Math.max(
        1,
        Math.floor(xp / 100) + 1
      );


    dashboard.innerHTML = `

      <div class="cm-dashboard">

        <header class="cm-topbar">

          <div class="cm-brand">

            <div class="cm-brand-piece">
              ♞
            </div>

            <div>
              ChessMate Study
            </div>

          </div>


          <div class="cm-user">

            <span>
              ${escapeHtml(firstName)}
            </span>

            <div class="cm-avatar">
              ${escapeHtml(
                firstName.charAt(0).toUpperCase()
              )}
            </div>

            <button
              class="cm-logout"
              id="cmLogout"
            >
              Log out
            </button>

          </div>

        </header>


        <div class="cm-container">

          <section class="cm-welcome">

            <div>

              <div class="cm-eyebrow">
                YOUR STUDY BOARD
              </div>

              <h1>
                Welcome, ${escapeHtml(firstName)} ♟
              </h1>

              <p>
                Plan your courses. Conquer your topics.
                Win your semester.
              </p>

            </div>


            <button
              class="cm-add"
              id="cmAddCourse"
            >
              + Add Course
            </button>

          </section>


          <section class="cm-stats">

            <div class="cm-stat">

              <div class="cm-stat-icon">
                ⚡
              </div>

              <strong>
                ${xp}
              </strong>

              <span>
                XP earned
              </span>

            </div>


            <div class="cm-stat">

              <div class="cm-stat-icon">
                👑
              </div>

              <strong>
                LVL ${level}
              </strong>

              <span>
                Current level
              </span>

            </div>


            <div class="cm-stat">

              <div class="cm-stat-icon">
                ♟
              </div>

              <strong>
                ${courses.length}
              </strong>

              <span>
                Courses on your board
              </span>

            </div>

          </section>


          <section>

            <div class="cm-section-title">

              <h2>
                Your Courses
              </h2>

              <span>
                ${totalProgress}% average progress
              </span>

            </div>


            <div
              class="cm-courses"
              id="cmCourses"
            >

              ${renderCourses(courses)}

            </div>

          </section>

        </div>

      </div>

    `;


    document
      .getElementById("cmLogout")
      ?.addEventListener(
        "click",
        logOut
      );


    document
      .getElementById("cmAddCourse")
      ?.addEventListener(
        "click",
        openCourseModal
      );
  }


  /* =========================================================
     RENDER COURSES
     ========================================================= */

  function renderCourses(courses) {

    if (!courses.length) {

      return `

        <div class="cm-empty">

          <div class="cm-empty-piece">
            ♞
          </div>

          <strong>
            Your board is empty.
          </strong>

          <p>
            Add your first course and make your first move.
          </p>

        </div>

      `;
    }


    return courses.map(course => {

      const progress =
        Math.max(
          0,
          Math.min(
            100,
            Number(course.progress || 0)
          )
        );


      return `

        <article class="cm-course">

          <div class="cm-course-code">
            ${escapeHtml(course.code)}
          </div>

          <h3>
            ${escapeHtml(course.name)}
          </h3>

          <p>
            ${escapeHtml(
              course.lecturer || "No lecturer added"
            )}
          </p>


          <div class="cm-progress-row">

            <span>
              Course progress
            </span>

            <strong>
              ${progress}%
            </strong>

          </div>


          <div class="cm-progress">

            <i
              style="width:${progress}%"
            ></i>

          </div>

        </article>

      `;

    }).join("");
  }


  /* =========================================================
     ADD COURSE MODAL
     ========================================================= */

  function openCourseModal() {

    const modal =
      document.createElement("div");

    modal.className =
      "cm-modal";

    modal.id =
      "cmCourseModal";


    modal.innerHTML = `

      <div class="cm-modal-box">

        <div class="cm-eyebrow">
          NEW CHESS PIECE
        </div>

        <h2>
          Add a course
        </h2>

        <p>
          Put a course on your study board.
        </p>


        <form id="cmCourseForm">

          <div class="cm-form-group">

            <label>
              Course code
            </label>

            <input
              id="cmCourseCode"
              placeholder="CSC 201"
              required
            >

          </div>


          <div class="cm-form-group">

            <label>
              Course name
            </label>

            <input
              id="cmCourseName"
              placeholder="Data Structures"
              required
            >

          </div>


          <div class="cm-form-group">

            <label>
              Lecturer
            </label>

            <input
              id="cmCourseLecturer"
              placeholder="Dr. Smith"
            >

          </div>


          <div class="cm-form-group">

            <label>
              Current progress (%)
            </label>

            <input
              id="cmCourseProgress"
              type="number"
              min="0"
              max="100"
              value="0"
            >

          </div>


          <div class="cm-modal-actions">

            <button
              type="button"
              class="cm-cancel"
              id="cmCancelCourse"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="cm-save"
            >
              Add Course ♟
            </button>

          </div>

        </form>

      </div>

    `;


    document.body.appendChild(
      modal
    );


    document
      .getElementById(
        "cmCancelCourse"
      )
      .onclick = () => {

        modal.remove();

      };


    document
      .getElementById(
        "cmCourseForm"
      )
      .onsubmit = event => {

        event.preventDefault();

        addCourse();

      };
  }


  /* =========================================================
     ADD COURSE
     ========================================================= */

  function addCourse() {

    const code =
      document
        .getElementById(
          "cmCourseCode"
        )
        .value
        .trim();


    const name =
      document
        .getElementById(
          "cmCourseName"
        )
        .value
        .trim();


    const lecturer =
      document
        .getElementById(
          "cmCourseLecturer"
        )
        .value
        .trim();


    const progress =
      Number(
        document
          .getElementById(
            "cmCourseProgress"
          )
          .value
      );


    if (!code || !name) {

      alert(
        "Please enter the course code and course name."
      );

      return;
    }


    const courses =
      getCourses();


    courses.push({

      id:
        Date.now(),

      code,

      name,

      lecturer,

      progress:
        Math.max(
          0,
          Math.min(
            100,
            progress || 0
          )
        )

    });


    saveCourses(
      courses
    );


    document
      .getElementById(
        "cmCourseModal"
      )
      ?.remove();


    const displayName =
      currentUser
        ?.user_metadata
        ?.display_name ||
      currentUser
        ?.user_metadata
        ?.username ||
      "Student";


    renderDashboard(
      document.getElementById(
        "chessmateDashboard"
      ),
      displayName.split(" ")[0]
    );
  }


  /* =========================================================
     ESCAPE HTML
     ========================================================= */

  function escapeHtml(value) {

    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
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

      document.body.classList.remove(
        "chessmate-dashboard"
      );


      document
        .getElementById(
          "chessmateDashboard"
        )
        ?.remove();


      window.location.reload();

    } catch (error) {

      console.error(
        "ChessMate logout error:",
        error
      );

      alert(
        "Unable to log out. Please try again."
      );
    }
  }


  /* =========================================================
     SESSION
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

        showDashboard(
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

    logout: () =>
      logOut(),

    addCourse: () =>
      openCourseModal()

  };


  console.log(
    "♞ ChessMate Study initialized successfully."
  );

});
