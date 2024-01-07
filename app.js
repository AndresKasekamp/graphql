import { obtainJWT } from "./modules/jwt.js";

import { constructGraphQLQuery } from "./modules/query.js";
import {
  getName,
  getAuditCount,
  getUpDownAmount,
  getXPprogression,
  getSuccesfulAuditors,
} from "./modules/store.js";
import {
  parseGetName,
  parseGetAuditCount,
  parseUpDownAmount,
  parseXPprogression,
  parseSuccesfulAuditors,
} from "./modules/parser.js";
import {
  createAuditRatioChart,
  createProgressionChart,
} from "./modules/chart.js";

import { setStyle, openModal } from "./modules/styling.js";

import { errorLogin } from "./modules/utils.js";

// TODO päri koduaadress ja x-gis päring teha
// TODO responsivness parandada, ilmselt kaks rida basic infole ja mingi boks ümber ka

/**
 * Main router for application
 * @param {string} loginName - either an email or username
 * @param {string} password - password
 */
const router = async (loginName, password) => {
  try {
    const jwtToken = await obtainJWT(loginName, password);
    // Handling errors with login
    if (jwtToken instanceof TypeError) {
      errorLogin("Unexpected error");
    } else if (jwtToken.error === "User does not exist or password incorrect") {
      errorLogin(jwtToken.error);
    } else {
      const logOutButton = document.getElementById("logOutButton");
      setStyle(logOutButton, "none", "flex", "flex");
      // Logging out logic
      logOutButton.addEventListener("click", () => {
        setStyle(logOutButton, "flex", "none", "none");
      });

      // Queries
      const nameResponse = await constructGraphQLQuery(jwtToken, getName());
      const auditResponse = await constructGraphQLQuery(
        jwtToken,
        getAuditCount()
      );
      const upDownResponse = await constructGraphQLQuery(
        jwtToken,
        getUpDownAmount()
      );

      const xpProgressionResponse = await constructGraphQLQuery(
        jwtToken,
        getXPprogression()
      );

      // Parsers
      const [firstName, lastName, userID, createdAt, cityStreet] =
        parseGetName(nameResponse);
      const auditCount = parseGetAuditCount(auditResponse);
      const [upAmount, downAmount, xpAmount] =
        parseUpDownAmount(upDownResponse);
      const xpProgression = parseXPprogression(xpProgressionResponse);

      const succesfulAuditorsResponse = await constructGraphQLQuery(
        jwtToken,
        getSuccesfulAuditors(userID)
      );
      const succesfulAuditorsTop10 = parseSuccesfulAuditors(
        succesfulAuditorsResponse
      );

      // Setting values after request
      const nameSpan = document.getElementById("nameSpan");
      const xpSpan = document.getElementById("xpSpan");
      const auditSpan = document.getElementById("auditSpan");
      const activeSpan = document.getElementById("activeSpan");

      nameSpan.textContent = `${firstName} ${lastName}`;
      xpSpan.textContent = xpAmount;
      auditSpan.textContent = auditCount;
      activeSpan.textContent = createdAt;

      openModal(succesfulAuditorsTop10);

      // Displaying map
      const xGisMap = document.getElementById("xGisMap");

      if (cityStreet !== null) {
        xGisMap.src = `https://xgis.maaamet.ee/xgis2/page/app/maainfo?aadress=${cityStreet}&adshow=1&adfit=1`;
      } else {
        xGisMap.display.style = "none";
      }

      createAuditRatioChart([upAmount, downAmount]);
      createProgressionChart(xpProgression);
    }
  } catch (error) {
    errorLogin(error);
  }
};

// Main starting point for app
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("koodCredentials");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    const loginName = formData.get("login"); // also username should work
    const password = formData.get("password");

    router(loginName, password);
  });
});
