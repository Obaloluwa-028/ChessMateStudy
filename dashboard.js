/* =========================================================
   CHESSMATE STUDY
   DASHBOARD CONTROLLER
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

  const supabase = window.ChessMateSupabase;

  if (!supabase) {
    alert("ChessMate could not connect to Supabase.");
    return;
  }


  /* =========================================================
     ELEMENTS
     ========================================================= */

  const welcomeTitle =
    document.getElementById("welcomeTitle");

  const avatar =
    document.getElementById("avatar");

  const courseCount =
    document.getElementById("courseCount");

  const coursesList =
    document.getElementById("coursesList");

  const addCourseButton =
    document.getElementById("addCourseButton");

  const courseModal =
    document.getElementById("courseModal");

  const closeCourseModal =
    document.getElementById("closeCourseModal");

  const courseForm =
    document.getElementById("courseForm");

  const courseName =
    document.getElementById("courseName");

  const courseCode =
    document.getElementById("courseCode");

  const courseDescription =
    document.getElementById("courseDescription");

  const courseMessage =
    document.getElementById("courseMessage");

  const saveCourse =
    document.getElementById("saveCourse");

  const logoutButton =
    document.getElementById("logoutButton");


  let currentUser = null;


  /* =========================================================
     GET CURRENT USER
     ========================================================= */

  async function loadUser() {

    const {
      data,
      error
    } = await supabase.auth.getUser();


    if (error) {

      console.error(error);

      window.location.href = "index.html";

      return false;
    }


    if (!data.user) {

      window.location.href = "index.html";

      return false;
    }


    currentUser = data.user;

    return true;
  }


  /* =========================================================
     USER PROFILE
     ========================================================= */

  function displayUser() {

    if (!currentUser) return;


    const metadata =
      currentUser.user_metadata || {};


    const name =
      metadata.display_name ||
      metadata.username ||
      currentUser.email?.split("@")[0] ||
      "Student";


    welcomeTitle.textContent =
      `Welcome back, ${name} ♞`;


    avatar.textContent =
      name.charAt(0).toUpperCase();
  }


  /* =========================================================
     LOAD COURSES
     ========================================================= */

  async function loadCourses() {

    const {
      data,
      error
    } = await supabase
      .from("courses")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("created_at", {
        ascending: false
      });


    if (error) {

      console.error(
        "Course loading error:",
        error
      );

      coursesList.innerHTML = `
        <div class="empty">
          <div class="empty-piece">⚠</div>
          <h3>Unable to load courses</h3>
          <p>${escapeHtml(error.message)}</p>
        </div>
      `;

      return;
    }


    courseCount.textContent =
      data.length;


    renderCourses(data);
  }


  /* =========================================================
     RENDER COURSES
     ========================================================= */

  function renderCourses(courses) {

    if (!courses.length) {

      coursesList.innerHTML = `
        <div class="empty">
          <div class="empty-piece">♟</div>
          <h3>Your board is empty</h3>
          <p>
            Add your first course and begin your semester strategy.
          </p>
        </div>
      `;

      return;
    }


    coursesList.innerHTML =
      courses.map((course, index) => {

        const pieces = [
          "♟",
          "♞",
          "♝",
          "♜",
          "♛",
          "♚"
        ];

        const piece =
          pieces[index % pieces.length];


        return `
          <div class="course">

            <div class="course-top">

              <div class="course-name">

                <div class="piece">
                  ${piece}
                </div>

                <div>

                  <h3>
                    ${escapeHtml(course.name)}
                  </h3>

                  <div class="course-code">
                    ${escapeHtml(course.code || "Course")}
                  </div>

                </div>

              </div>


              <div class="progress-value">
                ${course.progress || 0}%
              </div>

            </div>


            <div class="progress-track">

              <div
                class="progress-fill"
                style="width:${course.progress || 0}%"
              ></div>

            </div>


            <div class="course-actions">

              <button
                class="delete-course"
                data-delete-course="${course.id}"
              >
                Remove course
              </button>

            </div>

          </div>
        `;

      }).join("");


    document
      .querySelectorAll("[data-delete-course]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => deleteCourse(
            button.dataset.deleteCourse
          )
        );

      });
  }


  /* =========================================================
     ADD COURSE
     ========================================================= */

  async function addCourse(event) {

    event.preventDefault();


    const name =
      courseName.value.trim();

    const code =
      courseCode.value.trim();

    const description =
      courseDescription.value.trim();


    if (!name) {

      showCourseMessage(
        "Please enter a course name.",
        "error"
      );

      return;
    }


    saveCourse.disabled = true;

    saveCourse.textContent =
      "Adding course...";


    showCourseMessage("", "");


    try {

      const {
        error
      } = await supabase
        .from("courses")
        .insert({

          user_id: currentUser.id,

          name: name,

          code: code || null,

          description:
            description || null,

          progress: 0

        });


      if (error) {
        throw error;
      }


      showCourseMessage(
        "Course added to your board!",
        "success"
      );


      courseForm.reset();


      await loadCourses();


      setTimeout(() => {

        closeModal();

      }, 600);


    } catch (error) {

      console.error(
        "Add course error:",
        error
      );

      showCourseMessage(
        error.message ||
        "Unable to add course.",
        "error"
      );

    } finally {

      saveCourse.disabled = false;

      saveCourse.textContent =
        "Add Course ♟";
    }
  }


  /* =========================================================
     DELETE COURSE
     ========================================================= */

  async function deleteCourse(id) {

    const confirmed =
      confirm(
        "Remove this course from your board?"
      );


    if (!confirmed) return;


    const {
      error
    } = await supabase
      .from("courses")
      .delete()
      .eq("id", id)
      .eq("user_id", currentUser.id);


    if (error) {

      alert(
        "Unable to remove course: " +
        error.message
      );

      return;
    }


    await loadCourses();
  }


  /* =========================================================
     MODAL
     ========================================================= */

  function openModal() {

    courseModal.classList.add("show");

    courseName.focus();
  }


  function closeModal() {

    courseModal.classList.remove("show");

    courseForm.reset();

    showCourseMessage("", "");
  }


  addCourseButton.addEventListener(
    "click",
    openModal
  );


  closeCourseModal.addEventListener(
    "click",
    closeModal
  );


  courseModal.addEventListener(
    "click",
    event => {

      if (event.target === courseModal) {
        closeModal();
      }

    }
  );


  courseForm.addEventListener(
    "submit",
    addCourse
  );


  /* =========================================================
     LOGOUT
     ========================================================= */

  logoutButton.addEventListener(
    "click",
    async () => {

      logoutButton.disabled = true;

      logoutButton.innerHTML =
        "Logging out...";


      const {
        error
      } = await supabase.auth.signOut();


      if (error) {

        alert(
          "Unable to log out: " +
          error.message
        );

        logoutButton.disabled = false;

        logoutButton.innerHTML =
          "🚪 <span>Log out</span>";

        return;
      }


      window.location.href =
        "index.html";
    }
  );


  /* =========================================================
     MESSAGE
     ========================================================= */

  function showCourseMessage(
    message,
    type
  ) {

    courseMessage.textContent =
      message;

    courseMessage.className =
      "form-message " +
      (type || "");
  }


  /* =========================================================
     HTML ESCAPE
     ========================================================= */

  function escapeHtml(value) {

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  /* =========================================================
     INITIALIZE
     ========================================================= */

  const authenticated =
    await loadUser();


  if (!authenticated) return;


  displayUser();

  await loadCourses();


  console.log(
    "♞ ChessMate Study dashboard initialized."
  );

});
