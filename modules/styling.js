/**
 * Styling properties
 * @param {string} logOutButton - logging out button
 * @param {string} s1 - style for logInContainer
 * @param {string} s2 - style for logoutbutton
 * @param {string} s3 - style for allKoodContainer
 */
const setStyle = (logOutButton, s1, s2, s3) => {
  document.querySelector(".logInContainer").style.display = s1;
  logOutButton.style.display = s2;
  document.querySelector(".allKoodContainer").style.display = s3;
};

/**
 * Modal listener for auditors top10 logic
 * @param {array} succesfulAuditorsTop10 - auditors in tuple consisting of name and value how many times they have audited
 */
const openModal = (succesfulAuditorsTop10) => {
  // Get the modal
  const modal = document.getElementById("myModal");

  // Get the button that opens the modal
  const btn = document.getElementById("myBtnId");

  // Get the <span> element that closes the modal
  const span = document.getElementsByClassName("close")[0];

  // When the user clicks on the button, open the modal
  btn.onclick = function () {
    modal.style.display = "block";
  };

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  const auditorTableBody = document.getElementById("auditorTableBody");

  let child = auditorTableBody.lastElementChild;
  // Clearing table before repopulating it
  while (child) {
    auditorTableBody.removeChild(child);
    child = auditorTableBody.lastElementChild;
  }

  succesfulAuditorsTop10.forEach((auditor) => {
    const row = document.createElement("tr");

    auditor.forEach((j) => {
      const cell = document.createElement("td");
      const cellText = document.createTextNode(j);
      cell.appendChild(cellText);
      row.appendChild(cell);
    });

    // add the row to the end of the table body
    auditorTableBody.appendChild(row);
  });
};

export { setStyle, openModal };
