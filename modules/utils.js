/**
 * Error login snackbar rendering when login is unsuccessful for some reason
 * @param {string} errorMsg - error message to display
 */
export function errorLogin(errorMsg) {
  const snackbarElement = document.getElementById("snackbar");
  snackbarElement.textContent = `${errorMsg}`;
  snackbarElement.classList.add("show");
  document.body.addEventListener("mousemove", function hiding(e) {
    setTimeout(() => {
      snackbarElement.classList.add("hide");
      setTimeout(() => {
        snackbarElement.classList.remove("show");
        snackbarElement.classList.remove("hide");
        this.removeEventListener("mousemove", hiding);
      }, 500);
    }, 3000);
  });
}
